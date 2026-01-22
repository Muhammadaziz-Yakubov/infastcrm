import express from 'express';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Payment from '../models/Payment.js';
import Attendance from '../models/Attendance.js';
import Group from '../models/Group.js';
import QuizResult from '../models/QuizResult.js';
import { authenticateStudent } from '../middleware/auth.js';
import ExamResult from '../models/ExamResult.js';
import ArenaResult from '../models/ArenaResult.js';

const router = express.Router();

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
      return res.status(401).json({ message: 'Parol o\'rnatilmagan' });
    }

    const isMatch = await student.comparePassword(trimmedPassword);
    console.log('🔐 Password match:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: 'Parol noto\'g\'ri' });
    }

    const token = jwt.sign(
      { studentId: student._id, login: student.login, type: 'student' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log('🎉 Student login successful for:', trimmedLogin);
    res.json({
      token,
      student: {
        id: student._id,
        full_name: student.full_name,
        login: student.login,
        group: student.group_id,
        status: student.status,
        next_payment_date: student.next_payment_date
      }
    });
  } catch (error) {
    console.error('❌ Student login error:', error);
    res.status(500).json({ message: 'Server xatosi' });
  }
});

// Get student dashboard
router.get('/dashboard', authenticateStudent, async (req, res) => {
  try {
    const student = req.student;

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

    // Calculate attendance stats
    const totalAttendances = attendances.length;
    const presentCount = attendances.filter(a => a.status === 'PRESENT').length;
    const absentCount = attendances.filter(a => a.status === 'ABSENT').length;
    const lateCount = attendances.filter(a => a.status === 'LATE').length;

    // Total payments
    const allPayments = await Payment.find({ student_id: student._id });
    const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);

    // Get quiz results
    const quizResults = await QuizResult.find({ student_id: student._id })
      .sort({ createdAt: -1 })
      .limit(5);

    const quizStats = {
      total: await QuizResult.countDocuments({ student_id: student._id, status: 'FINISHED' }),
      avgPercentage: 0
    };

    if (quizStats.total > 0) {
      const allResults = await QuizResult.find({ student_id: student._id, status: 'FINISHED' });
      const totalPercentage = allResults.reduce((sum, r) => sum + (r.percentage || 0), 0);
      quizStats.avgPercentage = Math.round(totalPercentage / quizStats.total);
    }

    res.json({
      student: {
        id: student._id,
        full_name: student.full_name,
        phone: student.phone,
        status: student.status,
        joined_date: student.joined_date,
        next_payment_date: student.next_payment_date,
        last_payment_date: student.last_payment_date
      },
      group: {
        id: student.group_id._id,
        name: student.group_id.name,
        course: student.group_id.course_id?.name,
        days: student.group_id.days_of_week,
        time: student.group_id.time,
        status: student.group_id.status
      },
      payments: payments,
      totalPaid,
      attendance: {
        records: attendances,
        stats: {
          total: totalAttendances,
          present: presentCount,
          absent: absentCount,
          late: lateCount,
          percentage: totalAttendances > 0
            ? Math.round((presentCount / totalAttendances) * 100)
            : 0
        }
      },
      quizzes: {
        lastResults: quizResults,
        stats: quizStats
      }
    });
  } catch (error) {
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
      profile_image: req.student.profile_image || '',
      login: req.student.login,
      group: req.student.group_id,
      status: req.student.status,
      next_payment_date: req.student.next_payment_date
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
    const attendances = await Attendance.find({
      student_id: req.student._id,
      group_id: req.student.group_id._id
    })
      .sort({ date: -1 });
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ STUDENT TASKS ============
import Task from '../models/Task.js';
import TaskSubmission from '../models/TaskSubmission.js';

// Get tasks for student's group
router.get('/tasks', authenticateStudent, async (req, res) => {
  try {
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
router.post('/tasks/:id/submit', authenticateStudent, async (req, res) => {
  try {
    const { code, description } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Vazifa topilmadi' });
    }

    // Check if already submitted
    const existingSubmission = await TaskSubmission.findOne({
      task_id: task._id,
      student_id: req.student._id
    });

    if (existingSubmission) {
      // Update existing submission
      existingSubmission.code = code;
      existingSubmission.description = description;
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
      code,
      description
    });
    await submission.save();

    res.status(201).json(submission);
  } catch (error) {
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
    // Get all graded submissions for this student
    // Get all graded submissions for this student
    const submissions = await TaskSubmission.find({
      student_id: req.student._id,
      status: 'GRADED'
    }).populate('task_id');

    // Calculate Student's Own Stats
    const totalScore = submissions.reduce((sum, ts) => sum + (ts.score || 0), 0);
    const totalPoints = submissions.reduce((sum, ts) => sum + (ts.task_id?.max_score || 100), 0);

    // Quiz scores
    const quizzes = await QuizResult.find({ student_id: req.student._id, status: 'FINISHED' });
    const quizScore = quizzes.reduce((sum, q) => sum + (q.score || 0), 0);
    const quizPoints = quizzes.reduce((sum, q) => sum + (q.total_points || 0), 0);

    // Exam scores
    const exams = await ExamResult.find({ student_id: req.student._id, status: 'FINISHED' });
    const examScore = exams.reduce((sum, e) => sum + (e.score || 0), 0);
    const examPoints = exams.reduce((sum, e) => sum + (e.total_points || 0), 0);

    // Arena scores (Extra credit)
    const arenaResults = await ArenaResult.find({ student_id: req.student._id });
    const arenaScore = arenaResults.reduce((sum, r) => sum + (r.score || 0), 0);

    const grandTotalScore = totalScore + quizScore + examScore + arenaScore;
    const grandTotalPoints = totalPoints + quizPoints + examPoints;
    const percentage = grandTotalPoints > 0 ? Math.round((grandTotalScore / grandTotalPoints) * 100) : 0;

    // Get rank among all students (Expensive operation - duplicated logic from public.js)
    const allStudents = await Student.find({ status: { $in: ['ACTIVE', 'DEBTOR'] } });

    // We need to calculate score for ALL students to determine rank
    const allRatings = await Promise.all(allStudents.map(async (student) => {
      // Tasks
      const sSubmissions = await TaskSubmission.find({ student_id: student._id, status: 'GRADED' }).populate('task_id');
      const sTotalScore = sSubmissions.reduce((sum, s) => sum + (s.score || 0), 0);
      const sTotalPoints = sSubmissions.reduce((sum, s) => sum + (s.task_id?.max_score || 100), 0);

      // Quizzes
      const sQuizzes = await QuizResult.find({ student_id: student._id, status: 'FINISHED' });
      const sQuizScore = sQuizzes.reduce((sum, q) => sum + (q.score || 0), 0);
      const sQuizPoints = sQuizzes.reduce((sum, q) => sum + (q.total_points || 0), 0);

      // Exams
      const sExams = await ExamResult.find({ student_id: student._id, status: 'FINISHED' });
      const sExamScore = sExams.reduce((sum, e) => sum + (e.score || 0), 0);
      const sExamPoints = sExams.reduce((sum, e) => sum + (e.total_points || 0), 0);

      // Arena
      const sArena = await ArenaResult.find({ student_id: student._id });
      const sArenaScore = sArena.reduce((sum, r) => sum + (r.score || 0), 0);

      const sGrandTotalScore = sTotalScore + sQuizScore + sExamScore + sArenaScore;
      const sGrandTotalPoints = sTotalPoints + sQuizPoints + sExamPoints;

      const sPercentage = sGrandTotalPoints > 0 ? (sGrandTotalScore / sGrandTotalPoints * 100) : 0;

      return {
        studentId: student._id.toString(),
        percentage: sPercentage,
        totalScore: sGrandTotalScore // tie breaker
      };
    }));

    // Sort by percentage desc, then score desc
    allRatings.sort((a, b) => {
      if (b.percentage !== a.percentage) return b.percentage - a.percentage;
      return b.totalScore - a.totalScore;
    });

    const rank = allRatings.findIndex(r => r.studentId === req.student._id.toString()) + 1;

    res.json({
      averageScore: percentage, // This is now "Overall Percentage"
      taskCount: submissions.length,
      attendanceCount: quizzes.length + exams.length, // repurposing field or just showing assessments
      totalAssessments: submissions.length + quizzes.length + exams.length + arenaResults.length,
      rank,
      totalStudents: allStudents.length
    });
  } catch (error) {
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
    res.status(500).json({ message: error.message });
  }
});

export default router;

