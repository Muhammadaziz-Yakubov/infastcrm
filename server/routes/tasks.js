import express from 'express';
<<<<<<< HEAD
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Task from '../models/Task.js';
import TaskSubmission from '../models/TaskSubmission.js';
import Student from '../models/Student.js';
import Group from '../models/Group.js';
import { authenticate, requireAdmin, authenticateStudent } from '../middleware/auth.js';
import { sendTelegramMessageToChat } from '../services/telegramBot.js';
import CoinService from '../services/CoinService.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/tasks/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for disk storage
  },
  fileFilter: (req, file, cb) => {
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

=======
import Task from '../models/Task.js';
import TaskSubmission from '../models/TaskSubmission.js';
import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all tasks (Admin)
router.get('/', authenticate, async (req, res) => {
  try {
    const { group_id, status } = req.query;
    const filter = {};
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    if (group_id) filter.group_id = group_id;
    if (status) filter.status = status;

    const tasks = await Task.find(filter)
<<<<<<< HEAD
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
=======
      .populate('group_id')
      .populate('created_by', 'full_name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single task
router.get('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
<<<<<<< HEAD
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
=======
      .populate('group_id')
      .populate('created_by', 'full_name email');
    if (!task) {
      return res.status(404).json({ message: 'Vazifa topilmadi' });
    }
    res.json(task);
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

<<<<<<< HEAD
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
      taskData.image_url = `/uploads/tasks/${req.file.filename}`;
      console.log(`✅ Task image saved to disk: ${taskData.image_url}`);
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
      if (req.file) {
        updateData.image_url = `/uploads/tasks/${req.file.filename}`;
        console.log(`✅ Task image updated on disk: ${updateData.image_url}`);
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
    console.log(`🗑️ Admin ${req.user?._id || 'unknown'} deleting task ${req.params.id}`);
    console.log(`📋 Request details:`, {
      method: req.method,
      url: req.url,
      params: req.params,
      user: req.user ? { id: req.user._id, role: req.user.role } : 'no user'
    });

    // Validate task ID
    if (!req.params.id) {
      console.log(`❌ Missing task ID`);
      return res.status(400).json({
        success: false,
        message: 'Vazifa ID berilmagan'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log(`❌ Invalid task ID format: ${req.params.id}`);
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri vazifa ID formati'
      });
    }

    console.log(`✅ Task ID validation passed: ${req.params.id}`);

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
        filename: file.filename,
        original_name: file.originalname,
        file_size: file.size,
        mime_type: file.mimetype,
        file_path: `/uploads/tasks/${file.filename}`
      };

      console.log(`✅ Submission file saved to disk: ${file.originalname} -> ${fileData.file_path}`);
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

    // Award coins for task submission
    try {
      await CoinService.addCoins(
        student._id,
        100,
        `Vazifa topshirildi: ${submission.task_id.title}`,
        'HOMEWORK_SUBMITTED',
        null,
        student.group_id,
        submission._id
      );
    } catch (coinError) {
      console.error('Error awarding coins for task submission:', coinError);
    }

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
=======
// Create task (Admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      created_by: req.user.userId
    });
    await task.save();
    await task.populate('group_id');
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update task (Admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('group_id');
    if (!task) {
      return res.status(404).json({ message: 'Vazifa topilmadi' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete task (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Vazifa topilmadi' });
    }
    // Also delete all submissions for this task
    await TaskSubmission.deleteMany({ task_id: req.params.id });
    res.json({ message: 'Vazifa o\'chirildi' });
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

<<<<<<< HEAD
// Get all task submissions for admin (with optional filters)
router.get('/submissions/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const { student_id, task_id } = req.query;
    const filter = {};

    if (student_id) filter.student_id = student_id;
    if (task_id) filter.task_id = task_id;

    const submissions = await TaskSubmission.find(filter)
      .populate('student_id', 'full_name phone')
      .populate('task_id', 'title max_score group_id')
      .populate('graded_by', 'name email')
      .sort({ submitted_at: -1 });

    // Convert file paths to full URLs
    const submissionsWithFullUrls = submissions.map(submission => {
      const submissionObj = submission.toObject();
      return {
        ...submissionObj,
        submitted_files: submissionObj.submitted_files.map(file => ({
          ...file,
          file_path: file.file_path && (file.file_path.startsWith('http') || file.file_path.startsWith('data:')) ? file.file_path : getFileUrl(file.file_path)
        }))
      };
    });

    res.json(submissionsWithFullUrls);
=======
// ============ SUBMISSIONS ============

// Get all submissions (Admin - for grading)
router.get('/submissions/all', authenticate, async (req, res) => {
  try {
    const { task_id, group_id, status } = req.query;
    const filter = {};
    if (task_id) filter.task_id = task_id;
    if (status) filter.status = status;

    let submissions = await TaskSubmission.find(filter)
      .populate({
        path: 'task_id',
        populate: { path: 'group_id' }
      })
      .populate('student_id', 'full_name phone group_id')
      .populate('graded_by', 'full_name')
      .sort({ submitted_at: -1 });

    // Filter by group if needed
    if (group_id) {
      submissions = submissions.filter(s => 
        s.task_id?.group_id?._id?.toString() === group_id
      );
    }

    res.json(submissions);
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

<<<<<<< HEAD
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

=======
// Get submission by ID
router.get('/submissions/:id', authenticate, async (req, res) => {
  try {
    const submission = await TaskSubmission.findById(req.params.id)
      .populate({
        path: 'task_id',
        populate: { path: 'group_id' }
      })
      .populate('student_id', 'full_name phone')
      .populate('graded_by', 'full_name');
    
    if (!submission) {
      return res.status(404).json({ message: 'Topshiriq topilmadi' });
    }
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

<<<<<<< HEAD
export default router;
=======
// Grade a submission (Admin only)
router.put('/submissions/:id/grade', authenticate, requireAdmin, async (req, res) => {
  try {
    const { score, feedback } = req.body;
    
    if (score < 0 || score > 100) {
      return res.status(400).json({ message: 'Ball 0-100 orasida bo\'lishi kerak' });
    }

    const submission = await TaskSubmission.findByIdAndUpdate(
      req.params.id,
      {
        score,
        feedback,
        status: 'GRADED',
        graded_at: new Date(),
        graded_by: req.user.userId
      },
      { new: true }
    )
      .populate('task_id')
      .populate('student_id', 'full_name')
      .populate('graded_by', 'full_name');

    if (!submission) {
      return res.status(404).json({ message: 'Topshiriq topilmadi' });
    }

    res.json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ============ RATINGS ============

// Get student ratings (all students ranked by average score)
router.get('/ratings/students', authenticate, async (req, res) => {
  try {
    // Get all students with their groups
    const students = await Student.find({ status: { $in: ['ACTIVE', 'DEBTOR'] } })
      .populate('group_id')
      .select('full_name phone group_id status');

    // Get all graded submissions
    const submissions = await TaskSubmission.find({ status: 'GRADED' });

    // Get all attendance records with scores
    const attendances = await Attendance.find({ 
      score: { $ne: null } 
    });

    // Calculate average score for each student
    const ratings = students.map(student => {
      // Task submissions scores
      const studentSubmissions = submissions.filter(
        s => s.student_id.toString() === student._id.toString()
      );
      const taskScores = studentSubmissions.map(s => s.score).filter(s => s !== null);
      
      // Attendance scores
      const studentAttendances = attendances.filter(
        a => a.student_id.toString() === student._id.toString()
      );
      const attendanceScores = studentAttendances.map(a => a.score).filter(s => s !== null);

      // Combine all scores
      const allScores = [...taskScores, ...attendanceScores];
      const averageScore = allScores.length > 0
        ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
        : 0;

      return {
        student: {
          _id: student._id,
          full_name: student.full_name,
          phone: student.phone,
          group: student.group_id,
          status: student.status
        },
        taskCount: studentSubmissions.length,
        attendanceCount: studentAttendances.length,
        averageScore,
        totalAssessments: allScores.length
      };
    });

    // Sort by average score (descending)
    ratings.sort((a, b) => b.averageScore - a.averageScore);

    // Add rank
    const rankedRatings = ratings.map((r, index) => ({
      ...r,
      rank: index + 1
    }));

    res.json(rankedRatings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
