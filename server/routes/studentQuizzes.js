import express from 'express';
import Quiz from '../models/Quiz.js';
import QuizResult from '../models/QuizResult.js';
import { authenticateStudent } from '../middleware/auth.js';
import CoinService from '../services/CoinService.js';

const router = express.Router();

// Get available quizzes for student
router.get('/', authenticateStudent, async (req, res) => {
    try {
        const student = req.student;
        const now = new Date();

        const quizzes = await Quiz.find({
            group_id: student.group_id,
            status: 'PUBLISHED',
            start_date: { $lte: now },
            end_date: { $gte: now }
        }).populate('group_id', 'name');

        const studentResults = await QuizResult.find({ student_id: student._id });

        const quizzesWithStatus = quizzes.map(quiz => {
            const result = studentResults.find(r => r.quiz_id.toString() === quiz._id.toString());
            return {
                ...quiz.toObject(),
                status: result ? result.status : 'NOT_STARTED',
                score: result ? result.score : 0,
                total_points: 100,
                percentage: result ? result.percentage : 0,
                finished_at: result ? result.finished_at : null,
                canStart: !result || result.status === 'STARTED',
                canView: result && result.status === 'FINISHED'
            };
        });

        res.json(quizzesWithStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start quiz
router.post('/:id/start', authenticateStudent, async (req, res) => {
    try {
        const student = req.student;
        const now = new Date();
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        const studentGroupId = student.group_id._id ? student.group_id._id.toString() : student.group_id.toString();
        if (quiz.group_id.toString() !== studentGroupId || quiz.status !== 'PUBLISHED') {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (now < quiz.start_date || now > quiz.end_date) {
            return res.status(403).json({ message: 'Quiz is not available at this time' });
        }

        let result = await QuizResult.findOne({ quiz_id: quiz._id, student_id: student._id });
        if (!result) {
            result = new QuizResult({
                quiz_id: quiz._id,
                student_id: student._id,
                total_points: quiz.total_points,
                started_at: now
            });
            await result.save();
        }

        res.json({
            result: { started_at: result.started_at, answers: result.answers },
            quiz: {
                title: quiz.title,
                description: quiz.description,
                duration: quiz.duration,
                total_points: quiz.total_points,
                questions: quiz.questions.map(q => ({
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

// Submit quiz
router.post('/:id/submit', authenticateStudent, async (req, res) => {
    try {
        const student = req.student;
        const { answers } = req.body;
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        let result = await QuizResult.findOne({ quiz_id: quiz._id, student_id: student._id });
        if (!result) return res.status(404).json({ message: 'Quiz not started' });
        if (result.status === 'FINISHED') return res.status(400).json({ message: 'Quiz already finished' });

        const totalQuestions = quiz.questions.length;
        const pointsPerQuestion = totalQuestions > 0 ? 100 / totalQuestions : 0;
        let score = 0;

        const processedAnswers = answers.map(answer => {
            const question = quiz.questions[answer.question_index];
            if (question && question.correct_answer === answer.selected_answer) {
                score += pointsPerQuestion;
            }
            return {
                question_index: answer.question_index,
                selected_answer: answer.selected_answer
            };
        });

        result.answers = processedAnswers;
        result.score = Math.round(score);
        result.total_points = 100;
        result.finished_at = new Date();
        result.status = 'FINISHED';
        result.time_taken = Math.floor((result.finished_at - result.started_at) / 1000);

        await result.save();

        // Award or deduct coins based on quiz score
        try {
            if (result.score === 100) {
                await CoinService.addCoins(
                    student._id,
                    100,
                    `Quiz 100% bajarildi: ${quiz.title}`,
                    'QUIZ_COMPLETED',
                    null,
                    student.group_id,
                    result._id
                );
            } else {
                await CoinService.deductCoins(
                    student._id,
                    100,
                    `Quiz to'liq bajarilmadi (${result.score}%): ${quiz.title}`,
                    'QUIZ_NOT_COMPLETED',
                    null,
                    student.group_id,
                    result._id
                );
            }
        } catch (coinError) {
            console.error('Error updating coins for quiz:', coinError);
        }

        const questionsWithAnswers = quiz.questions.map((q, index) => {
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

        res.json({ message: 'Quiz submitted', result, questions: questionsWithAnswers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get quiz result
router.get('/:id/result', authenticateStudent, async (req, res) => {
    try {
        const student = req.student;
        const result = await QuizResult.findOne({ quiz_id: req.params.id, student_id: student._id });
        if (!result) return res.status(404).json({ message: 'Result not found' });

        const quiz = await Quiz.findById(req.params.id);
        const questionsWithAnswers = quiz.questions.map((q, index) => {
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

        res.json({ result, quiz, questions: questionsWithAnswers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
