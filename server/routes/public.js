import express from 'express';
import Student from '../models/Student.js';
import Task from '../models/Task.js';
import TaskSubmission from '../models/TaskSubmission.js';
import QuizResult from '../models/QuizResult.js';
import ExamResult from '../models/ExamResult.js';

const router = express.Router();

// Public ratings endpoint (no auth required)
router.get('/ratings', async (req, res) => {
  try {
    // Get all students with their task scores
    const students = await Student.find({ status: 'ACTIVE' })
      .select('full_name group_id')
      .populate('group_id', 'name');

    // Calculate ratings for each student
    const ratings = [];

    for (const student of students) {
      const studentSubmissions = await TaskSubmission.find({
        student_id: student._id,
        status: 'GRADED'
      }).populate('task_id', 'title max_score');

      const totalScore = studentSubmissions.reduce((sum, ts) => sum + (ts.score || 0), 0);
      const totalPoints = studentSubmissions.reduce((sum, ts) => sum + (ts.task_id?.max_score || 100), 0);

      // Quiz scores
      const studentQuizzes = await QuizResult.find({ student_id: student._id, status: 'FINISHED' });
      const quizScore = studentQuizzes.reduce((sum, q) => sum + (q.score || 0), 0);
      const quizPoints = studentQuizzes.reduce((sum, q) => sum + (q.total_points || 0), 0);

      // Exam scores
      const studentExams = await ExamResult.find({ student_id: student._id, status: 'FINISHED' });
      const examScore = studentExams.reduce((sum, e) => sum + (e.score || 0), 0);
      const examPoints = studentExams.reduce((sum, e) => sum + (e.total_points || 0), 0);

      const grandTotalScore = totalScore + quizScore + examScore;
      const grandTotalPoints = totalPoints + quizPoints + examPoints;
      const percentage = grandTotalPoints > 0 ? (grandTotalScore / grandTotalPoints * 100) : 0;
      const completedTasks = studentSubmissions.length + studentQuizzes.length + studentExams.length;

      ratings.push({
        student_id: student._id,
        full_name: student.full_name,
        group_name: student.group_id?.name || 'Noma\'lum',
        total_score: totalScore,
        total_points: totalPoints,
        percentage: percentage,
        completed_tasks: completedTasks
      });
    }

    // Sort by percentage, then by score
    ratings.sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage;
      }
      return b.total_score - a.total_score;
    });

    // Add rank
    ratings.forEach((rating, index) => {
      rating.rank = index + 1;
    });

    res.json(ratings);
  } catch (error) {
    console.error('Error fetching public ratings:', error);
    res.status(500).json({ message: error.message });
  }
});

// Student-specific ratings (with student auth)
router.get('/student/ratings', async (req, res) => {
  try {
    const studentId = req.student?.id;

    if (!studentId) {
      return res.status(401).json({ message: 'Student authentication required' });
    }

    // Get student's group
    const student = await Student.findById(studentId).populate('group_id');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get all students in the same group
    const groupStudents = await Student.find({
      group_id: student.group_id._id,
      status: 'ACTIVE'
    }).select('full_name');

    // Calculate ratings for group students
    const ratings = [];

    for (const groupStudent of groupStudents) {
      const studentSubmissions = await TaskSubmission.find({
        student_id: groupStudent._id,
        status: 'GRADED'
      }).populate('task_id', 'title max_score');

      const totalScore = studentSubmissions.reduce((sum, ts) => sum + (ts.score || 0), 0);
      const totalPoints = studentSubmissions.reduce((sum, ts) => sum + (ts.task_id?.max_score || 100), 0);
      const percentage = totalPoints > 0 ? (totalScore / totalPoints * 100) : 0;
      const completedTasks = studentSubmissions.length;

      ratings.push({
        student_id: groupStudent._id,
        full_name: groupStudent.full_name,
        total_score: totalScore,
        total_points: totalPoints,
        percentage: percentage,
        completed_tasks: completedTasks
      });
    }

    // Sort by percentage, then by score
    ratings.sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage;
      }
      return b.total_score - a.total_score;
    });

    // Add rank
    ratings.forEach((rating, index) => {
      rating.rank = index + 1;
    });

    res.json(ratings);
  } catch (error) {
    console.error('Error fetching student ratings:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
