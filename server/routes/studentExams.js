import express from 'express';
import Exam from '../models/Exam.js';
import ExamResult from '../models/ExamResult.js';
import { authenticateStudent } from '../middleware/auth.js';

const router = express.Router();

// Get available exams for student
router.get('/', authenticateStudent, async (req, res) => {
  try {
    console.log('📝 Fetching exams for student:', req.student);
    const student = req.student;
    const now = new Date();

    // Get exams for student's group
    const exams = await Exam.find({
      group_id: student.group_id,
      status: 'PUBLISHED',
      start_date: { $lte: now },
      end_date: { $gte: now }
    }).populate('group_id', 'name');

    console.log('📊 Found exams for group:', student.group_id, 'Count:', exams.length);

    // Get student's exam results
    const studentResults = await ExamResult.find({
      student_id: student._id
    });

    console.log('📊 Student results:', studentResults.length);

    // Combine exam info with result status
    const examsWithStatus = exams.map(exam => {
      const result = studentResults.find(r => r.exam_id.toString() === exam._id.toString());
      return {
        ...exam.toObject(),
        status: result ? result.status : 'NOT_STARTED',
        score: result ? result.score : 0,
        percentage: result ? result.percentage : 0,
        finished_at: result ? result.finished_at : null,
        canStart: !result || result.status === 'STARTED',
        canView: result && result.status === 'FINISHED'
      };
    });

    console.log('📊 Exams with status:', examsWithStatus.length);
    res.json(examsWithStatus);
  } catch (error) {
    console.error('❌ Error fetching student exams:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get exam details for student
router.get('/:id', authenticateStudent, async (req, res) => {
  try {
    const student = req.student;
    const now = new Date();

    const exam = await Exam.findById(req.params.id)
      .populate('group_id', 'name');

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check if exam is for student's group and is published
    const studentGroupId = student.group_id._id ? student.group_id._id.toString() : student.group_id.toString();
    if (exam.group_id._id.toString() !== studentGroupId || exam.status !== 'PUBLISHED') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if exam is within time range
    if (now < exam.start_date || now > exam.end_date) {
      return res.status(403).json({ message: 'Exam is not available at this time' });
    }

    // Get student's result if exists
    const result = await ExamResult.findOne({
      exam_id: exam._id,
      student_id: student._id
    });

    // If exam is finished, show results
    if (result && result.status === 'FINISHED') {
      return res.json({
        exam: {
          title: exam.title,
          description: exam.description,
          duration: exam.duration,
          total_points: exam.total_points,
          questions: exam.questions.map((q, index) => {
            const studentAnswer = result.answers.find(a => a.question_index === index);
            return {
              question_text: q.question_text,
              options: q.options,
              correct_answer: q.correct_answer,
              student_answer: studentAnswer !== undefined && studentAnswer !== null ? studentAnswer.selected_answer : null,
              points: q.points,
              is_correct: studentAnswer !== undefined && studentAnswer !== null ? q.correct_answer === studentAnswer.selected_answer : false
            };
          })
        },
        result: {
          score: result.score,
          percentage: result.percentage,
          finished_at: result.finished_at,
          time_taken: result.time_taken,
          answers: result.answers
        }
      });
    }

    // If exam is not started, show questions without correct answers
    if (!result || result.status === 'STARTED') {
      return res.json({
        exam: {
          title: exam.title,
          description: exam.description,
          duration: exam.duration,
          total_points: exam.total_points,
          questions: exam.questions.map(q => ({
            question_text: q.question_text,
            options: q.options,
            points: q.points
          }))
        },
        result: result ? {
          started_at: result.started_at,
          answers: result.answers
        } : null
      });
    }

    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start exam
router.post('/:id/start', authenticateStudent, async (req, res) => {
  try {
    const student = req.student;
    const now = new Date();

    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Check if exam is for student's group and is published
    const studentGroupId = student.group_id._id ? student.group_id._id.toString() : student.group_id.toString();
    if (exam.group_id.toString() !== studentGroupId || exam.status !== 'PUBLISHED') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if exam is within time range
    if (now < exam.start_date || now > exam.end_date) {
      return res.status(403).json({ message: 'Exam is not available at this time' });
    }

    // Check if student already started exam
    let result = await ExamResult.findOne({
      exam_id: exam._id,
      student_id: student._id
    });

    if (!result) {
      // Create new result
      result = new ExamResult({
        exam_id: exam._id,
        student_id: student._id,
        total_points: exam.total_points,
        started_at: now
      });
      await result.save();
    }

    res.json({
      result: {
        started_at: result.started_at,
        answers: result.answers
      },
      exam: {
        title: exam.title,
        description: exam.description,
        duration: exam.duration,
        total_points: exam.total_points,
        questions: exam.questions.map(q => ({
          question_text: q.question_text,
          options: q.options,
          points: q.points
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit exam
router.post('/:id/submit', authenticateStudent, async (req, res) => {
  try {
    const student = req.student;
    const { answers } = req.body;

    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Get or create result
    let result = await ExamResult.findOne({
      exam_id: exam._id,
      student_id: student._id
    });

    if (!result) {
      return res.status(404).json({ message: 'Exam not started' });
    }

    if (result.status === 'FINISHED') {
      return res.status(400).json({ message: 'Exam already finished' });
    }

    // Calculate score
    let score = 0;
    const processedAnswers = answers.map(answer => {
      const question = exam.questions[answer.question_index];
      const isCorrect = question.correct_answer === answer.selected_answer;
      if (isCorrect) {
        score += question.points;
      }
      return {
        question_index: answer.question_index,
        selected_answer: answer.selected_answer
      };
    });

    // Update result
    result.answers = processedAnswers;
    result.score = score;
    result.finished_at = new Date();
    result.status = 'FINISHED';
    result.time_taken = Math.floor((result.finished_at - result.started_at) / 1000);

    await result.save();

    const questionsWithAnswers = exam.questions.map((q, index) => {
      const studentAnswer = result.answers.find(a => a.question_index === index);
      return {
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        student_answer: studentAnswer !== undefined && studentAnswer !== null ? studentAnswer.selected_answer : null,
        points: q.points,
        is_correct: studentAnswer !== undefined && studentAnswer !== null ? q.correct_answer === studentAnswer.selected_answer : false
      };
    });

    res.json({
      message: 'Exam submitted successfully',
      result: {
        score: result.score,
        percentage: result.percentage,
        finished_at: result.finished_at,
        time_taken: result.time_taken,
        answers: result.answers
      },
      questions: questionsWithAnswers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get exam result
router.get('/:id/result', authenticateStudent, async (req, res) => {
  try {
    const student = req.student;

    const result = await ExamResult.findOne({
      exam_id: req.params.id,
      student_id: student._id
    }).populate('exam_id', 'title description total_points');

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    if (result.status !== 'FINISHED') {
      return res.status(400).json({ message: 'Exam not finished yet' });
    }

    const exam = await Exam.findById(req.params.id);

    // Add correct answers to questions
    const questionsWithAnswers = exam.questions.map((q, index) => {
      const studentAnswer = result.answers.find(a => a.question_index === index);
      return {
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        student_answer: studentAnswer !== undefined && studentAnswer !== null ? studentAnswer.selected_answer : null,
        points: q.points,
        is_correct: studentAnswer !== undefined && studentAnswer !== null ? q.correct_answer === studentAnswer.selected_answer : false
      };
    });

    res.json({
      result: {
        score: result.score,
        percentage: result.percentage,
        finished_at: result.finished_at,
        time_taken: result.time_taken,
        started_at: result.started_at
      },
      exam: {
        title: exam.title,
        description: exam.description,
        total_points: exam.total_points
      },
      questions: questionsWithAnswers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
