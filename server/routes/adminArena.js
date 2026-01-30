import express from 'express';
import mongoose from 'mongoose';
import ArenaRoom from '../models/ArenaRoom.js';
import ArenaResult from '../models/ArenaResult.js';
import ArenaPlayer from '../models/ArenaPlayer.js';
import Student from '../models/Student.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all arena statistics
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
    try {
        // Check MongoDB connection status
        if (mongoose.connection.readyState !== 1) {
            return res.json({
                total_rooms: 0,
                active_rooms: 0,
                lobby_rooms: 0,
                finished_rooms: 0,
                total_games: 0,
                today_games: 0,
                total_players: 0,
                active_players: 0,
                avg_wpm: 0,
                avg_accuracy: 0,
                total_pts_awarded: 0,
                game_completion_rate: 0,
                pts_distribution: {},
                message: 'Database not connected - using mock data'
            });
        }

        // Total rooms
        const totalRooms = await ArenaRoom.countDocuments();
        const activeRooms = await ArenaRoom.countDocuments({ status: 'PLAYING' });
        const lobbyRooms = await ArenaRoom.countDocuments({ status: 'LOBBY' });
        const finishedRooms = await ArenaRoom.countDocuments({ status: 'FINISHED' });

        // Total games
        const totalGames = await ArenaResult.countDocuments();
        const todayGames = await ArenaResult.countDocuments({
            played_at: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
        });

        // Player stats
        const totalPlayers = await Student.countDocuments({ arena_pts: { $gt: 0 } });
        const activePlayers = await Student.countDocuments({
            'gamification.last_activity_date': {
                $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
            }
        });

        // PTS distribution
        const ptsStats = await Student.aggregate([
            { $match: { arena_pts: { $gt: 0 } } },
            {
                $group: {
                    _id: '$arena_rank',
                    count: { $sum: 1 },
                    avg_pts: { $avg: '$arena_pts' }
                }
            },
            { $sort: { avg_pts: -1 } }
        ]);

        res.json({
            rooms: {
                total: totalRooms,
                active: activeRooms,
                lobby: lobbyRooms,
                finished: finishedRooms
            },
            games: {
                total: totalGames,
                today: todayGames
            },
            players: {
                total: totalPlayers,
                active: activePlayers
            },
            pts_distribution: ptsStats
        });
    } catch (err) {
        console.error('Get admin arena stats error:', err);
        res.status(500).json({ message: 'Arena statistikasini olishda xatolik' });
    }
});

// Get recent games with details
router.get('/recent-games', authenticate, requireAdmin, async (req, res) => {
    try {
        // Check MongoDB connection status
        if (mongoose.connection.readyState !== 1) {
            return res.json({
                games: [],
                pagination: { page: 1, limit: 20, total: 0, pages: 0 },
                message: 'Database not connected - using mock data'
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const games = await ArenaResult.find({})
            .populate('student_id', 'full_name phone')
            .populate('room_id', 'room_code created_at')
            .sort({ played_at: -1 })
            .skip(skip)
            .limit(limit);

        const total = await ArenaResult.countDocuments();

        res.json({
            games,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error('Get recent games error:', err);
        res.status(500).json({ message: 'So\'nggi o\'yinlarni olishda xatolik' });
    }
});

// Get room details
router.get('/rooms/:roomCode', authenticate, requireAdmin, async (req, res) => {
    try {
        // Check MongoDB connection status
        if (mongoose.connection.readyState !== 1) {
            return res.json({
                room: null,
                results: [],
                message: 'Database not connected - using mock data'
            });
        }

        const room = await ArenaRoom.findOne({ room_code: req.params.roomCode })
            .populate('host_id', 'full_name phone')
            .populate({
                path: 'players',
                populate: {
                    path: 'student_id',
                    select: 'full_name phone arena_pts arena_rank'
                }
            });

        if (!room) {
            return res.status(404).json({ message: 'Xona topilmadi' });
        }

        // Get results for this room
        const results = await ArenaResult.find({ room_id: room._id })
            .populate('student_id', 'full_name')
            .sort({ rank_in_game: 1 });

        res.json({
            room,
            results
        });
    } catch (err) {
        console.error('Get room details error:', err);
        res.status(500).json({ message: 'Xona ma\'lumotlarini olishda xatolik' });
    }
});

// Get top players
router.get('/top-players', authenticate, requireAdmin, async (req, res) => {
    try {
        // Check MongoDB connection status
        if (mongoose.connection.readyState !== 1) {
            return res.json([
                { full_name: 'Demo Player 1', phone: '+998901234567', arena_pts: 1500, arena_rank: 'Gold', games_played: 25 },
                { full_name: 'Demo Player 2', phone: '+998907654321', arena_pts: 1200, arena_rank: 'Silver', games_played: 18 }
            ]);
        }

        const limit = parseInt(req.query.limit) || 100;
        const players = await Student.find({ arena_pts: { $gt: 0 } })
            .select('full_name phone arena_pts arena_rank gamification')
            .sort({ arena_pts: -1 })
            .limit(limit);

        // Get game count for each player
        const playersWithStats = await Promise.all(
            players.map(async (player) => {
                const gameCount = await ArenaResult.countDocuments({ student_id: player._id });
                const avgScore = await ArenaResult.aggregate([
                    { $match: { student_id: player._id } },
                    { $group: { _id: null, avgScore: { $avg: '$total_score' } } }
                ]);

                return {
                    ...player.toObject(),
                    total_games: gameCount,
                    average_score: avgScore[0]?.avgScore || 0
                };
            })
        );

        res.json(playersWithStats);
    } catch (err) {
        console.error('Get top players error:', err);
        res.status(500).json({ message: 'Eng yaxshi o\'yinchilarni olishda xatolik' });
    }
});

// Get arena performance analytics
router.get('/analytics', authenticate, requireAdmin, async (req, res) => {
    try {
        // Check MongoDB connection status
        if (mongoose.connection.readyState !== 1) {
            return res.json({
                daily_stats: [],
                hourly_distribution: [],
                game_type_stats: { TYPING: 0, QUIZ: 0 },
                rank_distribution: {},
                message: 'Database not connected - using mock data'
            });
        }

        const period = req.query.period || '7d'; // 7d, 30d, 90d
        
        let startDate;
        switch (period) {
            case '30d':
                startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        }

        // Games over time
        const gamesOverTime = await ArenaResult.aggregate([
            { $match: { played_at: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$played_at" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Average WPM over time
        const wpmOverTime = await ArenaResult.aggregate([
            { $match: { played_at: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$played_at" } },
                    avg_wpm: { $avg: "$overall_wpm" },
                    avg_accuracy: { $avg: "$overall_accuracy" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Rank distribution
        const rankDistribution = await ArenaResult.aggregate([
            { $match: { played_at: { $gte: startDate } } },
            {
                $group: {
                    _id: '$rank_in_game',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            games_over_time: gamesOverTime,
            wpm_over_time: wpmOverTime,
            rank_distribution: rankDistribution,
            period
        });
    } catch (err) {
        console.error('Get arena analytics error:', err);
        res.status(500).json({ message: 'Arena analitikasini olishda xatolik' });
    }
});

export default router;
