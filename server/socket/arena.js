import { Server } from 'socket.io';
import ArenaRoom from '../models/ArenaRoom.js';
import ArenaPlayer from '../models/ArenaPlayer.js';
import ArenaResult from '../models/ArenaResult.js';
import WordSet from '../models/WordSet.js';
import Student from '../models/Student.js';

const activeRooms = new Map(); // Store active room state in memory

// Helper to generate 4-digit code
const generateRoomCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

// Calculate PTS based on performance
const calculatePTS = (rank, playersCount, baseScore) => {
    const rankMultiplier = playersCount - rank + 1;
    const pts = Math.round(baseScore * (rankMultiplier / playersCount));
    return Math.max(pts, 10); // Minimum 10 PTS
};

// Get rank from PTS
const getRankFromPTS = (pts) => {
    if (pts >= 2500) return 'Grandmaster';
    if (pts >= 2000) return 'Master';
    if (pts >= 1600) return 'Diamond';
    if (pts >= 1300) return 'Platinum';
    if (pts >= 1000) return 'Gold';
    if (pts >= 700) return 'Silver';
    return 'Bronze';
};

export const setupArenaSocket = (io) => {
    const arena = io.of('/arena');

    // Initialize word sets on startup
    WordSet.initializeDefaults();

    arena.on('connection', (socket) => {
        console.log('User connected to arena:', socket.id);

        // Create a new game room
        socket.on('create_room', async ({ studentId }) => {
            try {
                const student = await Student.findById(studentId);
                if (!student) {
                    return socket.emit('error', 'Student topilmadi');
                }

                const roomCode = generateRoomCode();
                
                // Get word sets for all stages
                const stage1Words = await WordSet.findOne({ category: 'stage1', is_active: true });
                const stage2Words = await WordSet.findOne({ category: 'stage2', is_active: true });
                const stage3Words = await WordSet.findOne({ category: 'stage3', is_active: true });

                // Create room in database
                const room = await ArenaRoom.create({
                    room_code: roomCode,
                    host_id: studentId,
                    game_type: 'TYPING_SPEED',
                    max_players: 7,
                    stage_words: {
                        stage1: stage1Words?.words.map(w => w.word) || [],
                        stage2: stage2Words?.words.map(w => w.word) || [],
                        stage3: stage3Words?.words.map(w => w.word) || []
                    }
                });

                // Create host player
                await ArenaPlayer.create({
                    room_id: room._id,
                    student_id: studentId,
                    socket_id: socket.id,
                    is_host: true
                });

                // Store in memory for real-time operations
                const roomState = {
                    id: roomCode,
                    dbId: room._id,
                    host: socket.id,
                    hostId: studentId,
                    players: [{
                        id: socket.id,
                        studentId: studentId,
                        name: student.full_name,
                        current_stage: 0,
                        stage_progress: { stage1: {}, stage2: {}, stage3: {} },
                        total_score: 0,
                        isHost: true,
                        arena_pts: student.arena_pts,
                        arena_rank: student.arena_rank
                    }],
                    status: 'LOBBY',
                    current_stage: 0,
                    stage_words: room.stage_words,
                    started_at: null
                };

                activeRooms.set(roomCode, roomState);
                socket.join(roomCode);
                
                socket.emit('room_created', {
                    roomCode,
                    roomState
                });
                
                arena.to(roomCode).emit('update_lobby', roomState);
            } catch (err) {
                console.error('Create room error:', err);
                socket.emit('error', 'Xona yaratishda xatolik');
            }
        });

        // Join an existing room
        socket.on('join_room', async ({ roomCode, studentId }) => {
            try {
                const student = await Student.findById(studentId);
                if (!student) {
                    return socket.emit('error', 'Student topilmadi');
                }

                const room = activeRooms.get(roomCode);
                if (!room) {
                    // Try to load from database if not in memory
                    const dbRoom = await ArenaRoom.findOne({ room_code: roomCode });
                    if (!dbRoom) {
                        return socket.emit('error', 'Xona topilmadi');
                    }
                    return socket.emit('error', 'Xona hali faol emas');
                }

                if (room.status !== 'LOBBY') {
                    return socket.emit('error', 'O\'yin allaqachon boshlangan');
                }

                if (room.players.length >= 7) {
                    return socket.emit('error', 'Xona to\'la (max 7 kishi)');
                }

                const existingPlayer = room.players.find(p => p.studentId === studentId);
                if (existingPlayer) {
                    return socket.emit('error', 'Siz allaqachon bu xonadasiz');
                }

                // Create player in database
                await ArenaPlayer.create({
                    room_id: room.dbId,
                    student_id: studentId,
                    socket_id: socket.id,
                    is_host: false
                });

                // Add to room state
                room.players.push({
                    id: socket.id,
                    studentId: studentId,
                    name: student.full_name,
                    current_stage: 0,
                    stage_progress: { stage1: {}, stage2: {}, stage3: {} },
                    total_score: 0,
                    isHost: false,
                    arena_pts: student.arena_pts,
                    arena_rank: student.arena_rank
                });

                socket.join(roomCode);
                arena.to(roomCode).emit('update_lobby', room);
                socket.emit('joined_room', roomState);
            } catch (err) {
                console.error('Join room error:', err);
                socket.emit('error', 'Xonaga qo\'shilishda xatolik');
            }
        });

        // Start the game
        socket.on('start_game', async (roomCode) => {
            try {
                const room = activeRooms.get(roomCode);
                if (!room) return;

                if (room.host !== socket.id) {
                    return socket.emit('error', 'Faqat xona egasi o\'yinni boshlashi mumkin');
                }

                room.status = 'PLAYING';
                room.current_stage = 1;
                room.started_at = Date.now();

                // Update database
                await ArenaRoom.findByIdAndUpdate(room.dbId, {
                    status: 'PLAYING',
                    current_stage: 1,
                    started_at: new Date()
                });

                // Start stage 1
                arena.to(roomCode).emit('stage_started', {
                    stage: 1,
                    words: room.stage_words.stage1,
                    stage_time: 30 // 30 seconds for stage 1
                });
            } catch (err) {
                console.error('Start game error:', err);
                socket.emit('error', 'O\'yinni boshlashda xatolik');
            }
        });

        // Update typing progress
        socket.on('typing_progress', ({ roomCode, stage, wordsCompleted, wpm, accuracy }) => {
            const room = activeRooms.get(roomCode);
            if (!room || room.status !== 'PLAYING') return;

            const player = room.players.find(p => p.id === socket.id);
            if (!player) return;

            // Update player progress
            player.current_stage = stage;
            player.stage_progress[`stage${stage}`] = {
                words_completed: wordsCompleted,
                wpm: wpm,
                accuracy: accuracy
            };

            // Broadcast real-time progress
            arena.to(roomCode).emit('progress_update', {
                players: room.players.map(p => ({
                    name: p.name,
                    current_stage: p.current_stage,
                    stage_progress: p.stage_progress[`stage${stage}`],
                    total_score: p.total_score
                }))
            });

            // Check if player completed current stage
            const stageWords = room.stage_words[`stage${stage}`];
            if (wordsCompleted >= stageWords.length && !player.stage_progress[`stage${stage}`].completed_at) {
                player.stage_progress[`stage${stage}`].completed_at = Date.now();
                
                // Calculate stage score
                const baseScore = 100;
                const wpmBonus = Math.min(wpm / 10, 20); // Max 20 bonus points for WPM
                const accuracyBonus = (accuracy / 100) * 30; // Max 30 bonus points for accuracy
                const stageScore = Math.round(baseScore + wpmBonus + accuracyBonus);
                
                player.total_score += stageScore;

                socket.emit('stage_completed', {
                    stage,
                    score: stageScore,
                    total_score: player.total_score
                });

                // Check if all players completed current stage
                const allCompleted = room.players.every(p => 
                    p.stage_progress[`stage${stage}`].completed_at
                );

                if (allCompleted) {
                    // Move to next stage or finish game
                    if (stage < 3) {
                        setTimeout(() => {
                            room.current_stage = stage + 1;
                            arena.to(roomCode).emit('stage_started', {
                                stage: stage + 1,
                                words: room.stage_words[`stage${stage + 1}`],
                                stage_time: stage + 1 === 2 ? 45 : 60 // 45s for stage 2, 60s for stage 3
                            });
                        }, 2000); // 2 second delay between stages
                    } else {
                        // Game finished
                        finishGame(roomCode);
                    }
                }
            }
        });

        // Handle player finishing the game
        socket.on('finish_game', ({ roomCode }) => {
            const room = activeRooms.get(roomCode);
            if (!room) return;

            const player = room.players.find(p => p.id === socket.id);
            if (!player || player.finished_at) return;

            player.finished_at = Date.now();
            
            // Check if all players finished
            const allFinished = room.players.every(p => p.finished_at);
            if (allFinished) {
                finishGame(roomCode);
            } else {
                // Notify others about waiting
                const remainingPlayers = room.players.filter(p => !p.finished_at).length;
                arena.to(roomCode).emit('waiting_for_players', {
                    count: remainingPlayers,
                    message: `${remainingPlayers} ta o'yinchi yakunlashini kutmoqda...`
                });
            }
        });

        socket.on('leave_room', (roomCode) => {
            handleDisconnect(socket, roomCode);
        });

        socket.on('disconnect', () => {
            // Find user's room
            for (const [code, room] of activeRooms.entries()) {
                if (room.players.find(p => p.id === socket.id)) {
                    handleDisconnect(socket, code);
                    break;
                }
            }
        });
    });

    // Admin namespace for monitoring
    const adminArena = io.of('/admin-arena');
    adminArena.on('connection', (socket) => {
        console.log('Admin connected to arena monitoring:', socket.id);

        // Send initial room data
        socket.emit('rooms_update', Array.from(activeRooms.values()));

        socket.on('disconnect', () => {
            console.log('Admin disconnected from arena monitoring');
        });
    });
};

async function finishGame(roomCode) {
    const room = activeRooms.get(roomCode);
    if (!room) return;

    room.status = 'FINISHED';

    // Sort players by score
    const sortedPlayers = [...room.players].sort((a, b) => b.total_score - a.total_score);
    
    // Assign ranks and calculate PTS
    for (let i = 0; i < sortedPlayers.length; i++) {
        const player = sortedPlayers[i];
        player.final_rank = i + 1;
        
        const ptsEarned = calculatePTS(i + 1, sortedPlayers.length, player.total_score);
        player.pts_earned = ptsEarned;

        // Save result to database
        await saveArenaResult(player, room, i + 1, ptsEarned);
        
        // Update student PTS and rank
        await updateStudentPTS(player.studentId, ptsEarned);
    }

    // Update room in database
    await ArenaRoom.findByIdAndUpdate(room.dbId, {
        status: 'FINISHED',
        finished_at: new Date()
    });

    // Notify all players
    arena.to(roomCode).emit('game_finished', {
        players: sortedPlayers,
        final_rankings: sortedPlayers
    });

    // Notify admin
    adminArena.emit('rooms_update', Array.from(activeRooms.values()));

    // Cleanup room after delay
    setTimeout(() => {
        activeRooms.delete(roomCode);
        adminArena.emit('rooms_update', Array.from(activeRooms.values()));
    }, 300000); // 5 minutes cleanup
}

async function saveArenaResult(player, room, rank, ptsEarned) {
    try {
        const stageResults = {};
        for (let stage = 1; stage <= 3; stage++) {
            const progress = player.stage_progress[`stage${stage}`];
            stageResults[`stage${stage}`] = {
                wpm: progress.wpm || 0,
                accuracy: progress.accuracy || 0,
                time_seconds: 30 + (stage - 1) * 15, // 30, 45, 60 seconds
                score: 0 // Will be calculated
            };
        }

        await ArenaResult.create({
            student_id: player.studentId,
            room_id: room.dbId,
            game_type: 'TYPING_SPEED',
            total_score: player.total_score,
            pts_earned: ptsEarned,
            stage_results: stageResults,
            overall_wpm: player.stage_progress.stage3?.wpm || 0,
            overall_accuracy: player.stage_progress.stage3?.accuracy || 0,
            total_time_seconds: 135, // 30 + 45 + 60
            rank_in_game: rank,
            players_count: room.players.length
        });
    } catch (err) {
        console.error('Error saving arena result:', err);
    }
}

async function updateStudentPTS(studentId, ptsEarned) {
    try {
        const student = await Student.findById(studentId);
        if (!student) return;

        const newPTS = student.arena_pts + ptsEarned;
        const newRank = getRankFromPTS(newPTS);

        await Student.findByIdAndUpdate(studentId, {
            arena_pts: newPTS,
            arena_rank: newRank
        });
    } catch (err) {
        console.error('Error updating student PTS:', err);
    }
}

function handleDisconnect(socket, roomCode) {
    const room = activeRooms.get(roomCode);
    if (!room) return;

    room.players = room.players.filter(p => p.id !== socket.id);

    if (room.players.length === 0) {
        activeRooms.delete(roomCode);
    } else {
        // If host left, assign new host
        if (room.host === socket.id) {
            room.host = room.players[0].id;
            room.players[0].isHost = true;
        }
        socket.leave(roomCode);
        // Notify others
        socket.to(roomCode).emit('update_lobby', room);
    }

    // Notify admin
    adminArena.emit('rooms_update', Array.from(activeRooms.values()));
}
