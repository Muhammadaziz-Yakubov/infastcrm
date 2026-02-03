import express from 'express';
import jwt from 'jsonwebtoken';
<<<<<<< HEAD
import multer from 'multer';
import path from 'path';
=======
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
import Student from '../models/Student.js';
import Payment from '../models/Payment.js';
import Attendance from '../models/Attendance.js';
import Group from '../models/Group.js';
<<<<<<< HEAD
import QuizResult from '../models/QuizResult.js';
import { authenticateStudent } from '../middleware/auth.js';
import ExamResult from '../models/ExamResult.js';
import ArenaResult from '../models/ArenaResult.js';
import RatingService from '../services/RatingService.js';
import Task from '../models/Task.js';
import TaskSubmission from '../models/TaskSubmission.js';
import fs from 'fs';

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/submissions/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images, PDFs, and documents
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Format noto\'g\'ri. Faqat rasm, PDF va hujjatlar (doc, zip) ruxsat berilgan.'));
    }
  }
});

=======

const router = express.Router();

>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
// Student Login
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;
<<<<<<< HEAD

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
=======
    console.log('📧 Student login attempt for:', login);
    
    const student = await Student.findOne({ login }).select('+password').populate('group_id');
    if (!student) {
      console.log('❌ Student not found:', login);
      return res.status(401).json({ message: 'Login yoki parol noto\'g\'ri' });
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    }

    if (!student.password) {
      return res.status(401).json({ message: 'Parol o\'rnatilmagan' });
    }

<<<<<<< HEAD
    const isMatch = await student.comparePassword(trimmedPassword);
    console.log('🔐 Password match:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: 'Parol noto\'g\'ri' });
=======
    const isMatch = await student.comparePassword(password);
    console.log('🔐 Password match:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: 'Login yoki parol noto\'g\'ri' });
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    }

    const token = jwt.sign(
      { studentId: student._id, login: student.login, type: 'student' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

<<<<<<< HEAD
    console.log('🎉 Student login successful for:', trimmedLogin);
    res.json({
      token,
      student: {
        id: student._id,
        full_name: student.full_name,
=======
    console.log('🎉 Student login successful for:', login);
    res.json({ 
      token, 
      student: { 
        id: student._id, 
        full_name: student.full_name, 
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
        login: student.login,
        group: student.group_id,
        status: student.status,
        next_payment_date: student.next_payment_date
<<<<<<< HEAD
      }
    });
  } catch (error) {
    console.error('❌ Student login error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

=======
      } 
    });
  } catch (error) {
    console.error('❌ Student login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Student Auth Middleware
const authenticateStudent = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Kirish talab etiladi' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (decoded.type !== 'student') {
      return res.status(401).json({ message: 'Noto\'g\'ri token turi' });
    }

    const student = await Student.findById(decoded.studentId).populate({
      path: 'group_id',
      populate: { path: 'course_id' }
    });
    if (!student) {
      return res.status(401).json({ message: 'O\'quvchi topilmadi' });
    }

    req.student = student;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token yaroqsiz' });
  }
};

>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
// Get student dashboard
router.get('/dashboard', authenticateStudent, async (req, res) => {
  try {
    const student = req.student;

<<<<<<< HEAD
    // Run all queries in parallel for better performance
    const [
      payments,
      attendances,
      allPayments,
      quizResults,
      tasks,
      submissions,
      examResults
    ] = await Promise.all([
      // Get recent payments (limit 5 instead of 10)
      Payment.find({ student_id: student._id })
        .sort({ payment_date: -1 })
        .limit(5)
        .lean(),

      // Get recent attendance (limit 10 instead of 30)
      Attendance.find({
        student_id: student._id,
        group_id: student.group_id._id
      })
        .sort({ date: -1 })
        .limit(10)
        .lean(),

      // Get all payments for total calculation
      Payment.find({ student_id: student._id })
        .select('amount')
        .lean(),

      // Get recent quiz results (limit 3 instead of 5)
      QuizResult.find({ student_id: student._id })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean(),

      // Get tasks for student's group
      Task.find({
        group_id: student.group_id._id,
        status: 'ACTIVE'
      })
        .select('_id deadline')
        .lean(),

      // Get task submissions
      TaskSubmission.find({
        student_id: student._id
      })
        .select('task_id status')
        .lean(),

      // Get exam results
      ExamResult.find({ student_id: student._id })
        .select('score')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean()
    ]);
=======
    // Get payment history
    const payments = await Payment.find({ student_id: student._id })
      .sort({ payment_date: -1 })
      .limit(10);

    // Get attendance history
    const attendances = await Attendance.find({ 
      student_id: student._id,
      group_id: student.group_id._id 
    })
      .sort({ date: -1 })
      .limit(30);
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88

    // Calculate attendance stats
    const totalAttendances = attendances.length;
    const presentCount = attendances.filter(a => a.status === 'PRESENT').length;
    const absentCount = attendances.filter(a => a.status === 'ABSENT').length;
    const lateCount = attendances.filter(a => a.status === 'LATE').length;

<<<<<<< HEAD
    // Calculate total payments
    const totalPaid = allPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Calculate quiz stats (optimized)
    const quizStats = {
      total: quizResults.length,
      avgPercentage: quizResults.length > 0
        ? Math.round(quizResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / quizResults.length)
        : 0
    };

    // Calculate task stats (optimized)
    const taskStats = {
      total: tasks.length,
      pending: 0,
      submitted: submissions.length,
      graded: submissions.filter(s => s.status === 'GRADED').length
    };

    const submissionTaskIds = new Set(submissions.map(s => s.task_id.toString()));
    tasks.forEach(task => {
      if (!submissionTaskIds.has(task._id.toString())) {
        taskStats.pending++;
      }
    });

    // Calculate exam stats (optimized)
    const examStats = {
      count: examResults.length,
      avgScore: examResults.length > 0
        ? Math.round(examResults.reduce((sum, e) => sum + (e.score || 0), 0) / examResults.length)
        : 0
    };
=======
    // Total payments
    const allPayments = await Payment.find({ student_id: student._id });
    const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88

    res.json({
      student: {
        id: student._id,
        full_name: student.full_name,
        phone: student.phone,
        status: student.status,
        joined_date: student.joined_date,
        next_payment_date: student.next_payment_date,
<<<<<<< HEAD
        last_payment_date: student.last_payment_date,
        coin_balance: student.coin_balance || 0
=======
        last_payment_date: student.last_payment_date
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
      },
      group: {
        id: student.group_id._id,
        name: student.group_id.name,
        course: student.group_id.course_id?.name,
        days: student.group_id.days_of_week,
        time: student.group_id.time,
        status: student.group_id.status
      },
<<<<<<< HEAD
      payments,
=======
      payments: payments,
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
      totalPaid,
      attendance: {
        records: attendances,
        stats: {
          total: totalAttendances,
          present: presentCount,
          absent: absentCount,
          late: lateCount,
<<<<<<< HEAD
          percentage: totalAttendances > 0
            ? Math.round((presentCount / totalAttendances) * 100)
            : 0
        }
      },
      quizzes: {
        lastResults: quizResults,
        stats: quizStats
      },
      tasks: {
        pendingCount: taskStats.pending,
        submittedCount: taskStats.submitted,
        gradedCount: taskStats.graded,
        totalCount: taskStats.total
      },
      exams: {
        stats: examStats
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
=======
          percentage: totalAttendances > 0 
            ? Math.round((presentCount / totalAttendances) * 100) 
            : 0
        }
      }
    });
  } catch (error) {
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    res.status(500).json({ message: error.message });
  }
});

// Get student profile
router.get('/profile', authenticateStudent, async (req, res) => {
  try {
    res.json({
      id: req.student._id,
      full_name: req.student.full_name,
      phone: req.student.phone,
<<<<<<< HEAD
      profile_image: req.student.profile_image || '',
=======
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
      login: req.student.login,
      group: req.student.group_id,
      status: req.student.status,
      next_payment_date: req.student.next_payment_date
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

<<<<<<< HEAD
// Update student profile
router.put('/profile', authenticateStudent, async (req, res) => {
  try {
    const { phone, profile_image, full_name } = req.body;

    console.log('📝 Profile update request:', {
      studentId: req.student._id,
      phone,
      hasImage: !!profile_image,
      imageLength: profile_image ? profile_image.length : 0,
      full_name
    });

    const updateData = {};

    if (phone !== undefined) updateData.phone = phone;
    if (full_name !== undefined) updateData.full_name = full_name;
    // Allow setting profile_image to null/empty string to delete it
    if (profile_image !== undefined) updateData.profile_image = profile_image;

    const student = await Student.findByIdAndUpdate(
      req.student._id,
      updateData,
      { new: true, runValidators: true }
    ).populate('group_id');

    res.json({
      id: student._id,
      full_name: student.full_name,
      phone: student.phone,
      profile_image: student.profile_image || '',
      login: student.login,
      group: student.group_id,
      status: student.status
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student by ID (for viewing other students' profiles - no phone)
router.get('/view/:id', authenticateStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('group_id');
    if (!student) {
      return res.status(404).json({ message: 'O\'quvchi topilmadi' });
    }

    // Don't show phone for other students
    res.json({
      id: student._id,
      full_name: student.full_name,
      profile_image: student.profile_image || '',
      group: student.group_id,
      status: student.status,
      joined_date: student.joined_date
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get classmates (students in same group)
router.get('/classmates', authenticateStudent, async (req, res) => {
  try {
    // Handle both populated and non-populated group_id
    const groupId = req.student.group_id?._id || req.student.group_id;

    if (!groupId) {
      return res.json([]);
    }

    const students = await Student.find({
      group_id: groupId,
      _id: { $ne: req.student._id }, // Exclude current student
      status: { $in: ['ACTIVE', 'DEBTOR'] } // Only show active students
    }).populate('group_id').select('-phone -password -login');

    res.json(students.map(s => ({
      id: s._id,
      full_name: s.full_name,
      profile_image: s.profile_image || '',
      group: s.group_id,
      status: s.status
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

=======
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
// Get student payments
router.get('/payments', authenticateStudent, async (req, res) => {
  try {
    const payments = await Payment.find({ student_id: req.student._id })
      .sort({ payment_date: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student attendance
router.get('/attendance', authenticateStudent, async (req, res) => {
  try {
<<<<<<< HEAD
    const attendances = await Attendance.find({
      student_id: req.student._id,
      group_id: req.student.group_id._id
=======
    const attendances = await Attendance.find({ 
      student_id: req.student._id,
      group_id: req.student.group_id._id 
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    })
      .sort({ date: -1 });
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ STUDENT TASKS ============
<<<<<<< HEAD
=======
import Task from '../models/Task.js';
import TaskSubmission from '../models/TaskSubmission.js';
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88

// Get tasks for student's group
router.get('/tasks', authenticateStudent, async (req, res) => {
  try {
<<<<<<< HEAD
    const groupId = req.student.group_id?._id || req.student.group_id;

    const [tasks, submissions] = await Promise.all([
      Task.find({
        group_id: groupId,
        status: 'ACTIVE'
      })
        .select('title description image_url group_id deadline max_score status createdAt')
        .sort({ createdAt: -1 })
        .lean(),

      TaskSubmission.find({
        student_id: req.student._id
      })
        .select('task_id status score submitted_at feedback')
        .lean()
    ]);

    const submissionByTaskId = new Map(
      submissions.map(s => [s.task_id.toString(), s])
    );

    const tasksWithStatus = tasks.map(task => {
      const submission = submissionByTaskId.get(task._id.toString());
      return {
        ...task,
=======
    const tasks = await Task.find({ 
      group_id: req.student.group_id._id,
      status: 'ACTIVE'
    })
      .populate('group_id')
      .sort({ createdAt: -1 });

    // Get student's submissions
    const submissions = await TaskSubmission.find({ 
      student_id: req.student._id 
    });

    // Add submission status to each task
    const tasksWithStatus = tasks.map(task => {
      const submission = submissions.find(
        s => s.task_id.toString() === task._id.toString()
      );
      return {
        ...task.toObject(),
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
        submission: submission ? {
          _id: submission._id,
          status: submission.status,
          score: submission.score,
          submitted_at: submission.submitted_at,
          feedback: submission.feedback
        } : null
      };
    });

    res.json(tasksWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single task
router.get('/tasks/:id', authenticateStudent, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('group_id');
    if (!task) {
      return res.status(404).json({ message: 'Vazifa topilmadi' });
    }

    // Check if student has already submitted
    const submission = await TaskSubmission.findOne({
      task_id: task._id,
      student_id: req.student._id
    });

    res.json({
      ...task.toObject(),
      submission: submission ? {
        _id: submission._id,
        code: submission.code,
        description: submission.description,
        status: submission.status,
        score: submission.score,
        submitted_at: submission.submitted_at,
        feedback: submission.feedback
      } : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit task
<<<<<<< HEAD
router.post('/tasks/:id/submit', authenticateStudent, upload.array('files', 5), async (req, res) => {
  try {
    const { description } = req.body;
    const task = await Task.findById(req.params.id);

=======
router.post('/tasks/:id/submit', authenticateStudent, async (req, res) => {
  try {
    const { code, description } = req.body;
    const task = await Task.findById(req.params.id);
    
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    if (!task) {
      return res.status(404).json({ message: 'Vazifa topilmadi' });
    }

<<<<<<< HEAD
    // Handle file uploads
    let submitted_files = [];
    if (req.files && req.files.length > 0) {
      submitted_files = req.files.map(file => ({
        filename: file.filename,
        original_name: file.originalname,
        file_path: `/uploads/submissions/${file.filename}`,
        file_size: file.size,
        mime_type: file.mimetype
      }));
    }

=======
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    // Check if already submitted
    const existingSubmission = await TaskSubmission.findOne({
      task_id: task._id,
      student_id: req.student._id
    });

    if (existingSubmission) {
      // Update existing submission
<<<<<<< HEAD
      existingSubmission.description = description;
      existingSubmission.submitted_files = submitted_files;
=======
      existingSubmission.code = code;
      existingSubmission.description = description;
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
      existingSubmission.submitted_at = new Date();
      existingSubmission.status = 'PENDING';
      existingSubmission.score = null;
      existingSubmission.feedback = '';
      await existingSubmission.save();
      return res.json(existingSubmission);
    }

    // Create new submission
    const submission = new TaskSubmission({
      task_id: task._id,
      student_id: req.student._id,
<<<<<<< HEAD
      description,
      submitted_files
=======
      code,
      description
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    });
    await submission.save();

    res.status(201).json(submission);
  } catch (error) {
<<<<<<< HEAD
    console.error('Task submission error:', error);
=======
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    res.status(400).json({ message: error.message });
  }
});

// Get student's submissions history
router.get('/submissions', authenticateStudent, async (req, res) => {
  try {
    const submissions = await TaskSubmission.find({ student_id: req.student._id })
      .populate('task_id')
      .sort({ submitted_at: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student's rating info
router.get('/my-rating', authenticateStudent, async (req, res) => {
  try {
<<<<<<< HEAD
    const ratingData = await RatingService.getStudentRank(req.student._id);

    res.json({
      averageScore: ratingData.total_points, // Mapped to expected frontend field
      totalPoints: ratingData.total_points,
      rank: ratingData.rank,
      totalStudents: ratingData.total_students,
      stats: ratingData.stats,
      full_name: ratingData.full_name
    });
  } catch (error) {
    console.error('❌ Error in /my-rating:', error);
    res.status(500).json({ message: error.message });
  }
});

// Change password
router.put('/change-password', authenticateStudent, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const student = await Student.findById(req.student._id).select('+password');

    if (!student) {
      return res.status(404).json({ message: 'O\'quvchi topilmadi' });
    }

    const isMatch = await student.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Eski parol noto\'g\'ri' });
    }

    student.password = newPassword;
    await student.save();

    res.json({ message: 'Parol muvaffaqiyatli o\'zgartirildi' });
  } catch (error) {
=======
    // Get all graded submissions for this student
    const submissions = await TaskSubmission.find({ 
      student_id: req.student._id,
      status: 'GRADED'
    });
    const taskScores = submissions.map(s => s.score).filter(s => s !== null);

    // Get attendance scores
    const attendances = await Attendance.find({ 
      student_id: req.student._id,
      score: { $ne: null }
    });
    const attendanceScores = attendances.map(a => a.score);

    // Calculate averages
    const allScores = [...taskScores, ...attendanceScores];
    const averageScore = allScores.length > 0
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 0;

    // Get rank among all students
    const allStudents = await Student.find({ status: { $in: ['ACTIVE', 'DEBTOR'] } });
    const allRatings = await Promise.all(allStudents.map(async (student) => {
      const subs = await TaskSubmission.find({ 
        student_id: student._id, 
        status: 'GRADED' 
      });
      const atts = await Attendance.find({ 
        student_id: student._id, 
        score: { $ne: null } 
      });
      const scores = [...subs.map(s => s.score), ...atts.map(a => a.score)].filter(s => s !== null);
      return {
        studentId: student._id.toString(),
        avg: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
      };
    }));

    allRatings.sort((a, b) => b.avg - a.avg);
    const rank = allRatings.findIndex(r => r.studentId === req.student._id.toString()) + 1;

    res.json({
      averageScore,
      taskCount: submissions.length,
      attendanceCount: attendances.length,
      totalAssessments: allScores.length,
      rank,
      totalStudents: allStudents.length
    });
  } catch (error) {
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    res.status(500).json({ message: error.message });
  }
});

export default router;

