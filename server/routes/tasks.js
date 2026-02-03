import express from 'express';
import Task from '../models/Task.js';
import TaskSubmission from '../models/TaskSubmission.js';
import Student from '../models/Student.js';
import Group from '../models/Group.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/tasks');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'task-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Get all tasks (admin)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { group_id, status, task_type } = req.query;
    const filter = {};

    if (group_id) filter.group_id = group_id;
    if (status) filter.status = status;
    if (task_type) filter.task_type = task_type;

    const tasks = await Task.find(filter)
      .populate('group_id', 'name')
      .populate('teacher_id', 'full_name')
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    console.error('❌ Get tasks error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single task
router.get('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('group_id', 'name')
      .populate('teacher_id', 'full_name');
    
    if (!task) {
      return res.status(404).json({ message: 'Topshiriq topilmadi' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('❌ Get task error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create task (admin)
router.post('/', authenticate, requireAdmin, upload.single('file'), async (req, res) => {
  try {
    const { title, description, group_id, due_date, max_score, task_type } = req.body;

    const task = new Task({
      title,
      description,
      group_id,
      teacher_id: req.user.id,
      due_date: new Date(due_date),
      max_score: max_score || 100,
      task_type: task_type || 'HOMEWORK',
      file_path: req.file ? '/uploads/tasks/' + req.file.filename : null,
      status: 'PUBLISHED'
    });

    await task.save();
    await task.populate('group_id', 'name');

    console.log('✅ Task created:', task.title);
    res.status(201).json(task);
  } catch (error) {
    console.error('❌ Create task error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update task (admin)
router.put('/:id', authenticate, requireAdmin, upload.single('file'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Topshiriq topilmadi' });
    }

    const { title, description, due_date, max_score, task_type, status } = req.body;

    if (title) task.title = title;
    if (description) task.description = description;
    if (due_date) task.due_date = new Date(due_date);
    if (max_score) task.max_score = max_score;
    if (task_type) task.task_type = task_type;
    if (status) task.status = status;

    if (req.file) {
      // Delete old file if exists
      if (task.file_path) {
        const oldFilePath = path.join(__dirname, '..', task.file_path);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      task.file_path = '/uploads/tasks/' + req.file.filename;
    }

    await task.save();
    await task.populate('group_id', 'name');

    console.log('✅ Task updated:', task.title);
    res.json(task);
  } catch (error) {
    console.error('❌ Update task error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete task (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Topshiriq topilmadi' });
    }

    // Delete associated file if exists
    if (task.file_path) {
      const filePath = path.join(__dirname, '..', task.file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete all submissions for this task
    await TaskSubmission.deleteMany({ task_id: req.params.id });

    console.log('✅ Task deleted:', task.title);
    res.json({ message: 'Topshiriq muvaffaqiyatli o\'chirildi' });
  } catch (error) {
    console.error('❌ Delete task error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get task submissions
router.get('/:id/submissions', authenticate, requireAdmin, async (req, res) => {
  try {
    const submissions = await TaskSubmission.find({ task_id: req.params.id })
      .populate('student_id', 'full_name phone')
      .sort({ submitted_at: -1 });
    
    res.json(submissions);
  } catch (error) {
    console.error('❌ Get submissions error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Grade submission
router.put('/submissions/:submissionId/grade', authenticate, requireAdmin, async (req, res) => {
  try {
    const { score, feedback } = req.body;
    
    const submission = await TaskSubmission.findById(req.params.submissionId)
      .populate('task_id')
      .populate('student_id');
    
    if (!submission) {
      return res.status(404).json({ message: 'Topshirma topilmadi' });
    }

    submission.score = score;
    submission.feedback = feedback;
    submission.status = 'GRADED';
    submission.graded_at = new Date();
    submission.graded_by = req.user.id;

    await submission.save();

    console.log('✅ Submission graded:', submission.student_id.full_name, 'Score:', score);
    res.json(submission);
  } catch (error) {
    console.error('❌ Grade submission error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
