import express from 'express';
import Quiz from '../models/Quiz.js';
import QuizResult from '../models/QuizResult.js';
import Student from '../models/Student.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all quizzes (admin)
router.get('/', authenticate, requireAdmin, async (req, res) => {
    try {
        const { group_id, status } = req.query;
        const filter = {};
        if (group_id) filter.group_id = group_id;
        if (status) filter.status = status;

        const quizzes = await Quiz.find(filter)
            .populate('group_id', 'name')
            .populate('created_by', 'full_name email')
            .sort({ createdAt: -1 });

        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new quiz (admin)
router.post('/', authenticate, requireAdmin, async (req, res) => {
    try {
        const quiz = new Quiz({
            ...req.body,
            created_by: req.user.userId || req.user._id
        });
        await quiz.save();
        await quiz.populate('group_id', 'name');
        res.status(201).json(quiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update quiz (admin)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            .populate('group_id', 'name');
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        res.json(quiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete quiz (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        await QuizResult.deleteMany({ quiz_id: req.params.id });
        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get quiz results (admin)
router.get('/:id/results', authenticate, requireAdmin, async (req, res) => {
    try {
        const results = await QuizResult.find({ quiz_id: req.params.id })
            .populate('student_id', 'full_name phone')
            .sort({ score: -1 });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
