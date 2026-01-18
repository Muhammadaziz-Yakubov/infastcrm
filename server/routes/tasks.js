import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Task from '../models/Task.js';
import TaskSubmission from '../models/TaskSubmission.js';
import { authenticate, requireAdmin, authenticateStudent } from '../middleware/auth.js';
import { sendTelegramMessageToChat } from '../services/telegramBot.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/tasks';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and documents
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|rar|mp4|avi|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, documents, and videos are allowed.'));
    }
  }
});

// Helper function to get full URL for files
const getFileUrl = (filePath) => {
  if (!filePath) return null;
  
  // If it's already a full URL, return as is
  if (filePath.startsWith('http')) {
    return filePath;
  }
  
  // Always use the production URL since we're on Render.com
  const baseUrl = 'https://infastcrm-0b2r.onrender.com';
  
  // Remove leading slash to avoid double slash
  const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  const fullUrl = `${baseUrl}/${cleanPath}`;
  
  console.log(`🔗 getFileUrl: ${filePath} -> ${fullUrl}`);
  return fullUrl;
};

// Get all tasks for admin
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { group_id, status } = req.query;
    const filter = {};
    
    if (group_id) filter.group_id = group_id;
    if (status) filter.status = status;
    
    const tasks = await Task.find(filter)
      .populate('group_id', 'name telegram_chat_id')
      .populate('created_by', 'name email')
      .sort({ createdAt: -1 });
    
    // Convert image_url to full URL for existing tasks
    const tasksWithFullUrls = tasks.map(task => ({
      ...task.toObject(),
      image_url: task.image_url ? getFileUrl(task.image_url) : null
    }));
    
    res.json(tasksWithFullUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get tasks for student
router.get('/student', authenticateStudent, async (req, res) => {
  try {
    const student = req.student;
    
    const tasks = await Task.find({
      group_id: student.group_id,
      status: 'ACTIVE'
    }).populate('group_id', 'name');
    
    // Get submissions for this student
    const submissions = await TaskSubmission.find({
      student_id: student._id
    }).populate('task_id');
    
    // Combine tasks with submission status
    const tasksWithStatus = tasks.map(task => {
      const submission = submissions.find(s => s.task_id._id.toString() === task._id.toString());
      return {
        ...task.toObject(),
        image_url: task.image_url ? getFileUrl(task.image_url) : null,
        submitted: !!submission,
        submission: submission || null
      };
    });
    
    res.json(tasksWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single task
router.get('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('group_id', 'name')
      .populate('created_by', 'name email');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Convert image_url to full URL
    const taskWithFullUrl = {
      ...task.toObject(),
      image_url: task.image_url ? getFileUrl(task.image_url) : null
    };
    
    res.json(taskWithFullUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new task
router.post('/', authenticate, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, group_id, deadline, max_score } = req.body;
    
    const taskData = {
      title,
      description,
      group_id,
      max_score: max_score || 100,
      created_by: req.user.userId
    };
    
    if (deadline) {
      taskData.deadline = new Date(deadline);
    }
    
    if (req.file) {
      taskData.image_url = getFileUrl(`/uploads/tasks/${req.file.filename}`);
    }
    
    const task = new Task(taskData);
    await task.save();
    
    // Populate group info
    await task.populate('group_id', 'name telegram_chat_id');
    
    // Send Telegram notification to group
    if (task.group_id.telegram_chat_id) {
      const message = `
📝 <b>Yangi vazifa berildi!</b>

🏷️ <b>Sarlavha:</b> ${task.title}
👥 <b>Guruh:</b> ${task.group_id.name}
📅 <b>Muddati:</b> ${task.deadline ? new Date(task.deadline).toLocaleDateString('uz-UZ') : 'Mudditsiz'}
🎯 <b>Maksimum ball:</b> ${task.max_score}

${task.description}

📋 <b>Eslatma:</b> Vazifani bajarish uchun veb-saytga kirib o'zingizning panelingizdan vazifalar sahifasiga oting va vazifangizni yuboring!
      `.trim();
      
      try {
        await sendTelegramMessageToChat(task.group_id.telegram_chat_id, message);
        console.log(`✅ Task notification sent to group ${task.group_id.name}`);
      } catch (telegramError) {
        console.error('❌ Error sending Telegram notification:', telegramError);
      }
    }
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update task
router.put('/:id', authenticate, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, group_id, deadline, max_score, status } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (group_id) updateData.group_id = group_id;
    if (deadline) updateData.deadline = new Date(deadline);
    if (max_score) updateData.max_score = max_score;
    if (status) updateData.status = status;
    
    if (req.file) {
      updateData.image_url = getFileUrl(`/uploads/tasks/${req.file.filename}`);
    }
    
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('group_id', 'name');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete task
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Delete associated submissions
    await TaskSubmission.deleteMany({ task_id: req.params.id });
    
    // Delete image file if exists
    if (task.image_url) {
      const imagePath = path.join(process.cwd(), task.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit task
router.post('/:id/submit', authenticateStudent, upload.array('files', 5), async (req, res) => {
  try {
    const student = req.student;
    const { description } = req.body;
    
    console.log('Submit task - req.files:', req.files);
    console.log('Submit task - req.body:', req.body);
    console.log('Submit task - student:', student);
    
    // Check if already submitted
    const existingSubmission = await TaskSubmission.findOne({
      task_id: req.params.id,
      student_id: student._id
    });
    
    if (existingSubmission) {
      return res.status(400).json({ message: 'You have already submitted this task' });
    }
    
    // Check if files exist
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
    // Handle both array and object cases
    const filesArray = Array.isArray(req.files) ? req.files : [req.files];
    
    const submittedFiles = filesArray.map(file => ({
      filename: file.filename,
      original_name: file.originalname,
      file_path: getFileUrl(`/uploads/tasks/${file.filename}`),
      file_size: file.size,
      mime_type: file.mimetype
    }));
    
    console.log('Processed submittedFiles:', submittedFiles);
    console.log('About to create submission with submitted_files:', submittedFiles);
    
    const submission = new TaskSubmission({
      task_id: req.params.id,
      student_id: student._id,
      submitted_files: submittedFiles,
      description: description || ''
    });
    
    await submission.save();
    await submission.populate('task_id');
    await submission.populate('student_id', 'full_name');
    
    res.status(201).json(submission);
  } catch (error) {
    console.error('Error submitting task:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get task submissions for admin
router.get('/:id/submissions', authenticate, requireAdmin, async (req, res) => {
  try {
    const submissions = await TaskSubmission.find({ task_id: req.params.id })
      .populate('student_id', 'full_name phone')
      .populate('graded_by', 'name email')
      .sort({ submitted_at: -1 });
    
    // Convert file paths to full URLs
    const submissionsWithFullUrls = submissions.map(submission => ({
      ...submission.toObject(),
      submitted_files: submission.submitted_files.map(file => ({
        ...file,
        file_path: file.file_path.startsWith('http') ? file.file_path : getFileUrl(file.file_path)
      }))
    }));
    
    res.json(submissionsWithFullUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Grade submission
router.post('/submissions/:id/grade', authenticate, requireAdmin, async (req, res) => {
  try {
    const { score, feedback } = req.body;
    
    const submission = await TaskSubmission.findByIdAndUpdate(
      req.params.id,
      {
        score,
        feedback,
        graded_by: req.user.userId,
        graded_at: new Date(),
        status: 'GRADED'
      },
      { new: true }
    ).populate('student_id', 'full_name');
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
