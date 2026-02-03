import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import Student from '../models/Student.js';
import Payment from '../models/Payment.js';
import Attendance from '../models/Attendance.js';
import Group from '../models/Group.js';
import QuizResult from '../models/QuizResult.js';
import { authenticateStudent } from '../middleware/auth.js';
import ExamResult from '../models/ExamResult.js';
import ArenaResult from '../models/ArenaResult.js';
import RatingService from '../services/RatingService.js';
import Task from '../models/Task.js';
import TaskSubmission from '../models/TaskSubmission.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/profiles');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Student Login
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    // Input validation
    if (!login || !password) {
      return res.status(400).json({ message: 'Login va parol talab etiladi' });
    }

    if (typeof login !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Noto\'g\'ri ma\'lumotlar formati' });
    }

    const trimmedLogin = login.trim();
    const trimmedPassword = password.trim();

    if (!trimmedLogin || !trimmedPassword) {
      return res.status(400).json({ message: 'Login va parol bo\'sh bo\'lishi mumkin emas' });
    }

    console.log('📧 Student login attempt for:', trimmedLogin);

    const student = await Student.findOne({ login: trimmedLogin }).select('+password').populate('group_id');
    if (!student) {
      console.log('❌ Student not found:', trimmedLogin);
      return res.status(401).json({ message: 'Login noto\'g\'ri' });
    }

    if (!student.password) {
      console.log('❌ Student has no password set:', trimmedLogin);
      return res.status(401).json({ message: 'Login noto\'g\'ri' });
    }

    const isPasswordValid = await student.comparePassword(trimmedPassword);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', trimmedLogin);
      return res.status(401).json({ message: 'Parol noto\'g\'ri' });
    }

    // Check if student is active
    if (student.status !== 'ACTIVE') {
      console.log('❌ Student account not active:', trimmedLogin, 'Status:', student.status);
      return res.status(401).json({ message: 'Hisobingiz faol emas. Iltimos administrator bilan bog\'laning.' });
    }

    // Check if group is active
    if (student.group_id && student.group_id.status !== 'ACTIVE') {
      console.log('❌ Student group not active:', student.group_id.name, 'Status:', student.group_id.status);
      return res.status(401).json({ message: 'Guruh faol emas. Iltimos administrator bilan bog\'laning.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: student._id, 
        login: student.login, 
        role: 'STUDENT',
        type: 'student'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log('✅ Student login successful:', trimmedLogin);

    // Remove password from response
    const studentObj = student.toObject();
    delete studentObj.password;

    res.json({
      message: 'Muvaffaqiyatli kirish',
      token,
      student: studentObj
    });

  } catch (error) {
    console.error('❌ Student login error:', error);
    res.status(500).json({ message: 'Server xatolik yuz berdi' });
  }
});

// Get current student profile
router.get('/profile', authenticateStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).populate('group_id');
    if (!student) {
      return res.status(404).json({ message: 'O\'quvchi topilmadi' });
    }
    res.json(student);
  } catch (error) {
    console.error('❌ Get student profile error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update student profile
router.put('/profile', authenticateStudent, upload.single('profile_image'), async (req, res) => {
  try {
    const student = await Student.findById(req.student.id);
    if (!student) {
      return res.status(404).json({ message: 'O\'quvchi topilmadi' });
    }

    const { full_name, phone, parent_phone, address } = req.body;

    // Update allowed fields
    if (full_name) student.full_name = full_name;
    if (phone) student.phone = phone;
    if (parent_phone) student.parent_phone = parent_phone;
    if (address) student.address = address;

    // Update profile image if uploaded
    if (req.file) {
      // Delete old profile image if exists
      if (student.profile_image) {
        const oldImagePath = path.join(__dirname, '..', student.profile_image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      student.profile_image = '/uploads/profiles/' + req.file.filename;
    }

    await student.save();
    await student.populate('group_id');

    console.log('✅ Student profile updated:', student.login);
    res.json({
      message: 'Profil muvaffaqiyatli yangilandi',
      student
    });

  } catch (error) {
    console.error('❌ Update student profile error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get student payments
router.get('/payments', authenticateStudent, async (req, res) => {
  try {
    const payments = await Payment.find({ student_id: req.student.id })
      .populate('group_id')
      .sort({ payment_date: -1 });
    res.json(payments);
  } catch (error) {
    console.error('❌ Get student payments error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get student attendance
router.get('/attendance', authenticateStudent, async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = { student_id: req.student.id };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      filter.date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const attendance = await Attendance.find(filter)
      .populate('group_id')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    console.error('❌ Get student attendance error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get student quiz results
router.get('/quiz-results', authenticateStudent, async (req, res) => {
  try {
    const results = await QuizResult.find({ student_id: req.student.id })
      .populate('quiz_id')
      .sort({ completed_at: -1 });
    res.json(results);
  } catch (error) {
    console.error('❌ Get student quiz results error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get student exam results
router.get('/exam-results', authenticateStudent, async (req, res) => {
  try {
    const results = await ExamResult.find({ student_id: req.student.id })
      .populate('exam_id')
      .sort({ completed_at: -1 });
    res.json(results);
  } catch (error) {
    console.error('❌ Get student exam results error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get student arena results
router.get('/arena-results', authenticateStudent, async (req, res) => {
  try {
    const results = await ArenaResult.find({ student_id: req.student.id })
      .sort({ completed_at: -1 });
    res.json(results);
  } catch (error) {
    console.error('❌ Get student arena results error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get student rating
router.get('/rating', authenticateStudent, async (req, res) => {
  try {
    const { group_id } = req.query;
    const rating = await RatingService.getStudentRating(req.student.id, group_id);
    res.json(rating);
  } catch (error) {
    console.error('❌ Get student rating error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get student tasks
router.get('/tasks', authenticateStudent, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { student_id: req.student.id };

    if (status) {
      filter.status = status;
    }

    const tasks = await TaskSubmission.find(filter)
      .populate('task_id')
      .sort({ submitted_at: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('❌ Get student tasks error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Submit task
router.post('/tasks/:taskId/submit', authenticateStudent, upload.single('file'), async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Topshiriq topilmadi' });
    }

    // Check if already submitted
    const existingSubmission = await TaskSubmission.findOne({
      task_id: taskId,
      student_id: req.student.id
    });

    if (existingSubmission) {
      return res.status(400).json({ message: 'Bu topshiriq allaqachon topshirilgan' });
    }

    const submission = new TaskSubmission({
      task_id: taskId,
      student_id: req.student.id,
      content,
      file_path: req.file ? '/uploads/tasks/' + req.file.filename : null,
      status: 'SUBMITTED'
    });

    await submission.save();
    await submission.populate('task_id');

    console.log('✅ Task submitted:', taskId, 'by student:', req.student.id);
    res.status(201).json({
      message: 'Topshiriq muvaffaqiyatli topshirildi',
      submission
    });

  } catch (error) {
    console.error('❌ Submit task error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
