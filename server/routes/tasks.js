import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Task from '../models/Task.js';
import TaskSubmission from '../models/TaskSubmission.js';
import { authenticate, requireAdmin, authenticateStudent } from '../middleware/auth.js';
import { sendTelegramMessageToChat } from '../services/telegramBot.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads - using memory storage for database storage
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for base64 storage (to keep database size reasonable)
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

// Helper function to convert buffer to base64 data URL
const bufferToDataUrl = (buffer, mimeType) => {
  if (!buffer) return null;
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
};

// Helper function to get file URL - supports both base64 data URLs and regular URLs
const getFileUrl = (filePath) => {
  if (!filePath) return null;
  
  // If it's already a full URL or data URL, return as is (don't modify)
  if (filePath.startsWith('http') || filePath.startsWith('data:')) {
    console.log(`🔗 getFileUrl: Returning as-is (${filePath.substring(0, 50)}...)`);
    return filePath;
  }
  
  // Use environment variable for base URL, fallback to hardcoded production URL
  const baseUrl = process.env.API_URL || process.env.RENDER_EXTERNAL_URL || 'https://infastcrm-0b2r.onrender.com';
  
  // Ensure path starts with /uploads
  let cleanPath = filePath.startsWith('/') ? filePath : '/' + filePath;
  // Remove double slashes if any (but keep http:// or https://)
  cleanPath = cleanPath.replace(/([^:]\/)\/+/g, '$1');
  const fullUrl = `${baseUrl}${cleanPath}`;
  
  console.log(`🔗 getFileUrl: Converting path -> ${fullUrl.substring(0, 100)}... (baseUrl: ${baseUrl})`);
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
    const tasksWithFullUrls = tasks.map(task => {
      const taskObj = task.toObject();
      console.log(`📋 Task ${taskObj._id}: image_url = ${taskObj.image_url ? taskObj.image_url.substring(0, 100) + '...' : 'null'}`);

      return {
        ...taskObj,
        image_url: taskObj.image_url ? getFileUrl(taskObj.image_url) : null
      };
    });
    
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
      
      // Convert submission file paths to full URLs if submission exists
      let submissionWithUrls = null;
      if (submission) {
        submissionWithUrls = {
          ...submission.toObject(),
          submitted_files: submission.submitted_files.map(file => ({
            ...file,
            file_path: file.file_path && file.file_path.startsWith('http') ? file.file_path : getFileUrl(file.file_path || `/uploads/tasks/${file.filename}`)
          }))
        };
      }
      
      const taskObj = task.toObject();
      console.log(`📋 Student Task ${taskObj._id}: image_url = ${taskObj.image_url ? taskObj.image_url.substring(0, 100) + '...' : 'null'}`);

      return {
        ...taskObj,
        image_url: taskObj.image_url ? getFileUrl(taskObj.image_url) : null,
        submitted: !!submission,
        submission: submissionWithUrls
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
      // Convert image to base64 data URL for database storage
      const isImage = req.file.mimetype && req.file.mimetype.startsWith('image/');
      const hasBuffer = req.file.buffer && Buffer.isBuffer(req.file.buffer);
      
      console.log(`📤 Creating task with file: ${req.file.originalname}, size: ${req.file.size}, hasBuffer: ${hasBuffer}, isImage: ${isImage}`);
      
      if (isImage && hasBuffer && req.file.size <= 5 * 1024 * 1024) {
        // Store as base64 data URL for images under 5MB
        taskData.image_url = bufferToDataUrl(req.file.buffer, req.file.mimetype);
        console.log(`✅ Task image stored as base64 (${req.file.size} bytes, data URL length: ${taskData.image_url.length})`);
      } else {
        // For larger files, non-images, or if buffer is missing, use URL (fallback)
        // Note: With memory storage, this fallback shouldn't be needed, but we keep it for safety
        if (hasBuffer) {
          // Still convert to base64 even if larger (database will handle it)
          taskData.image_url = bufferToDataUrl(req.file.buffer, req.file.mimetype);
          console.log(`⚠️ Large file stored as base64 anyway (${req.file.size} bytes)`);
        } else {
          taskData.image_url = getFileUrl(`/uploads/tasks/${req.file.filename}`);
          console.log(`⚠️ Buffer missing, using URL fallback: ${taskData.image_url}`);
        }
      }
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
    
    // Convert image_url to full URL
    const taskWithFullUrl = {
      ...task.toObject(),
      image_url: task.image_url ? getFileUrl(task.image_url) : null
    };
    
    res.status(201).json(taskWithFullUrl);
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
      // Convert image to base64 data URL for database storage
      const isImage = req.file.mimetype.startsWith('image/');
      if (isImage && req.file.size <= 5 * 1024 * 1024) {
        // Store as base64 data URL for images under 5MB
        updateData.image_url = bufferToDataUrl(req.file.buffer, req.file.mimetype);
        console.log(`✅ Task image updated as base64 (${req.file.size} bytes)`);
      } else {
        // For larger files or non-images, still use URL (fallback)
        updateData.image_url = getFileUrl(`/uploads/tasks/${req.file.filename}`);
      }
    }
    
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('group_id', 'name');
    
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

// Delete task
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    console.log(`🗑️ Admin ${req.user._id} deleting task ${req.params.id}`);

    // Validate task ID
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log(`❌ Invalid task ID: ${req.params.id}`);
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri vazifa ID'
      });
    }

    // Check if task exists and populate for better logging
    const task = await Task.findById(req.params.id).populate('group_id', 'name').populate('created_by', 'full_name');
    if (!task) {
      console.log(`❌ Task ${req.params.id} not found`);
      return res.status(404).json({
        success: false,
        message: 'Vazifa topilmadi'
      });
    }

    console.log(`✅ Found task: "${task.title}" (ID: ${task._id}) in group: ${task.group_id?.name || 'Unknown'}`);

    // Check if task can be safely deleted
    const activeSubmissions = await TaskSubmission.countDocuments({
      task_id: req.params.id,
      status: 'GRADED'
    });

    if (activeSubmissions > 0) {
      console.log(`⚠️ Task has ${activeSubmissions} graded submissions - allowing deletion but logging`);
    }

    // Start a database transaction-like operation (MongoDB doesn't support transactions in all versions)
    let deletedSubmissionsCount = 0;
    let imageDeleted = false;

    try {
      // Delete associated submissions
      const submissionDeleteResult = await TaskSubmission.deleteMany({ task_id: req.params.id });
      deletedSubmissionsCount = submissionDeleteResult.deletedCount;
      console.log(`🗑️ Deleted ${deletedSubmissionsCount} submissions for task ${task.title}`);

      // Delete image file if exists
      if (task.image_url) {
        try {
          const imagePath = path.join(process.cwd(), task.image_url);
          console.log(`🖼️ Checking image file: ${imagePath}`);

          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            imageDeleted = true;
            console.log(`🗑️ Deleted image file: ${imagePath}`);
          } else {
            console.log(`ℹ️ Image file not found (might be external URL): ${imagePath}`);
          }
        } catch (imageError) {
          console.error(`❌ Error deleting image file:`, imageError);
          // Don't fail the whole operation for image deletion error
        }
      }

      // Finally delete the task
      const deleteResult = await Task.findByIdAndDelete(req.params.id);
      if (!deleteResult) {
        throw new Error('Task deletion failed');
      }

      console.log(`✅ Task "${task.title}" deleted successfully by admin ${req.user.full_name || req.user.email}`);

      res.json({
        success: true,
        message: 'Vazifa muvaffaqiyatli o\'chirildi',
        data: {
          taskTitle: task.title,
          groupName: task.group_id?.name,
          deletedSubmissions: deletedSubmissionsCount,
          imageDeleted: imageDeleted
        }
      });

    } catch (dbError) {
      console.error('❌ Database error during deletion:', dbError);
      throw dbError; // Re-throw to be caught by outer catch
    }

  } catch (error) {
    console.error('❌ Error deleting task:', error);

    // Provide more specific error messages
    let errorMessage = 'Vazifani o\'chirishda xatolik yuz berdi';
    if (error.name === 'CastError') {
      errorMessage = 'Noto\'g\'ri vazifa ID formati';
    } else if (error.code === 11000) {
      errorMessage = 'Ma\'lumotlar bazasida konflikt yuz berdi';
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
    
    const submittedFiles = filesArray.map(file => {
      const fileData = {
        filename: file.filename || `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        original_name: file.originalname,
        file_size: file.size,
        mime_type: file.mimetype
      };
      
      // For images under 5MB, store as base64. For others, use URL (fallback)
      const isImage = file.mimetype.startsWith('image/');
      if (isImage && file.size <= 5 * 1024 * 1024 && file.buffer) {
        fileData.file_path = bufferToDataUrl(file.buffer, file.mimetype);
        console.log(`✅ Submission file stored as base64: ${file.originalname} (${file.size} bytes)`);
      } else {
        fileData.file_path = getFileUrl(`/uploads/tasks/${fileData.filename}`);
      }
      
      return fileData;
    });
    
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
    
    // Convert file paths to full URLs in response
    const submissionWithUrls = {
      ...submission.toObject(),
      submitted_files: submission.submitted_files.map(file => ({
        ...file,
        file_path: file.file_path && (file.file_path.startsWith('http') || file.file_path.startsWith('data:')) ? file.file_path : getFileUrl(file.file_path || `/uploads/tasks/${file.filename}`)
      }))
    };
    
    res.status(201).json(submissionWithUrls);
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
    
    // Convert file paths to full URLs (or return data URLs as-is)
    const submissionsWithFullUrls = submissions.map(submission => {
      const submissionObj = submission.toObject();
      console.log(`📋 Submission ${submissionObj._id} files:`);
      submissionObj.submitted_files.forEach((file, i) => {
        console.log(`   File ${i}: ${file.original_name} -> ${file.file_path?.substring(0, 100)}...`);
      });

      return {
        ...submissionObj,
        submitted_files: submissionObj.submitted_files.map(file => ({
          ...file,
          file_path: file.file_path && (file.file_path.startsWith('http') || file.file_path.startsWith('data:')) ? file.file_path : getFileUrl(file.file_path)
        }))
      };
    });
    
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
