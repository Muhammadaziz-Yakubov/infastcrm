import express from 'express';
import ArenaRoom from '../models/ArenaRoom.js';
import ArenaResult from '../models/ArenaResult.js';
import Student from '../models/Student.js';
import { authenticateStudent } from '../middleware/auth.js';

const router = express.Router();

// Get student's arena stats
router.get('/stats', authenticateStudent, async (req, res) => {
    try {
        const student = await Student.findById(req.student._id);
        if (!student) {
            return res.status(404).json({ message: 'Student topilmadi' });
        }

        // Get arena results
        const results = await ArenaResult.find({ student_id: req.student._id })
            .sort({ played_at: -1 })
            .limit(10);

        // Calculate stats
        const totalGames = results.length;
        const totalScore = results.reduce((sum, r) => sum + r.total_score, 0);
        const totalPTS = results.reduce((sum, r) => sum + r.pts_earned, 0);
        const avgWPM = totalGames > 0 ? results.reduce((sum, r) => sum + r.overall_wpm, 0) / totalGames : 0;
        const avgAccuracy = totalGames > 0 ? results.reduce((sum, r) => sum + r.overall_accuracy, 0) / totalGames : 0;

        // Get best rank
        const bestRank = results.length > 0 ? Math.min(...results.map(r => r.rank_in_game)) : null;

        res.json({
            arena_pts: student.arena_pts,
            arena_rank: student.arena_rank,
            total_games: totalGames,
            total_score: totalScore,
            total_pts_earned: totalPTS,
            average_wpm: Math.round(avgWPM),
            average_accuracy: Math.round(avgAccuracy),
            best_rank: bestRank,
            recent_results: results
        });
    } catch (err) {
        console.error('Get arena stats error:', err);
        res.status(500).json({ message: 'Arena statistikasini olishda xatolik' });
    }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const students = await Student.find({})
            .select('full_name arena_pts arena_rank gamification')
            .sort({ arena_pts: -1 })
            .limit(limit);

        res.json(students);
    } catch (err) {
        console.error('Get leaderboard error:', err);
        res.status(500).json({ message: 'Reytingni olishda xatolik' });
    }
});

// Get room history
router.get('/history', authenticateStudent, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const results = await ArenaResult.find({ student_id: req.student._id })
            .populate('room_id', 'room_code created_at')
            .sort({ played_at: -1 })
            .skip(skip)
            .limit(limit);

        const total = await ArenaResult.countDocuments({ student_id: req.student._id });

        res.json({
            results,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error('Get arena history error:', err);
        res.status(500).json({ message: 'Arena tarixini olishda xatolik' });
    }
});

// Get available rooms (for joining)
router.get('/rooms', async (req, res) => {
    try {
        const rooms = await ArenaRoom.find({
            status: 'LOBBY'
        })
        .populate('host_id', 'full_name')
        .populate({
            path: 'players',
            populate: {
                path: 'student_id',
                select: 'full_name'
            }
        })
        .sort({ created_at: -1 })
        .limit(20);

        res.json(rooms);
    } catch (err) {
        console.error('Get available rooms error:', err);
        res.status(500).json({ message: 'Xonalarni olishda xatolik' });
    }
});

export default router;
