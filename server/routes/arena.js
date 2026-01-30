import express from 'express';
import mongoose from 'mongoose';
import ArenaRoom from '../models/ArenaRoom.js';
import ArenaResult from '../models/ArenaResult.js';
import Student from '../models/Student.js';
import { authenticateStudent } from '../middleware/auth.js';

const router = express.Router();

// Get student's arena stats
router.get('/stats', authenticateStudent, async (req, res) => {
    try {
        // Check MongoDB connection status
        if (mongoose.connection.readyState !== 1) {
            return res.json({
                total_games: 0,
                total_score: 0,
                arena_pts: 0,
                arena_rank: 'Bronze',
                avg_wpm: 0,
                avg_accuracy: 0,
                recent_results: [],
                message: 'Database not connected - using mock data'
            });
        }

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

// Get global leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        // Check MongoDB connection status
        if (mongoose.connection.readyState !== 1) {
            return res.json([
                { full_name: 'Demo Player 1', arena_pts: 1500, arena_rank: 'Gold' },
                { full_name: 'Demo Player 2', arena_pts: 1200, arena_rank: 'Silver' },
                { full_name: 'Demo Player 3', arena_pts: 800, arena_rank: 'Bronze' }
            ]);
        }

        const limit = parseInt(req.query.limit) || 50;
        const students = await Student.find({ arena_pts: { $gt: 0 } })
            .select('full_name arena_pts arena_rank')
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
        // Check MongoDB connection status
        if (mongoose.connection.readyState !== 1) {
            return res.json({
                results: [],
                pagination: { page: 1, limit: 10, total: 0, pages: 0 },
                message: 'Database not connected - using mock data'
            });
        }

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

// Get available rooms
router.get('/rooms', async (req, res) => {
    try {
        // Check MongoDB connection status
        if (mongoose.connection.readyState !== 1) {
            return res.json([]);
        }

        const rooms = await ArenaRoom.find({ status: 'LOBBY' })
            .populate('host_id', 'full_name')
            .select('room_code game_type max_players current_players created_at')
            .sort({ created_at: -1 })
            .limit(20);

        res.json(rooms);
    } catch (err) {
        console.error('Get available rooms error:', err);
        res.status(500).json({ message: 'Xonalarni olishda xatolik' });
    }
});

export default router;
