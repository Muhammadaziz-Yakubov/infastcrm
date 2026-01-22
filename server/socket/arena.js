import { Server } from 'socket.io';
import ArenaResult from '../models/ArenaResult.js';

const rooms = new Map(); // Store room state

// Helper to generate 4-digit code
const generateRoomCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

// Word list for typing game (Uzbek tech terms)
const words = [
    "algoritm", "dastur", "internet", "kompyuter", "tizim", "kod", "funksiya", "ozgaruvchi", "massiv", "obyekt",
    "ma'lumot", "server", "mijoz", "interfeys", "tarmoq", "xavfsizlik", "shifrlash", "platforma", "ilovalar",
    "brauzer", "qidiruv", "fayl", "papka", "yuklash", "chat", "bot", "sun'iy", "intellekt", "texnologiya",
    "innovatsiya", "raqamli", "iqtisodiyot", "starup", "loyiha", "boshqaruv", "tahlil", "testlash", "optimallashtirish",
    "deploy", "versiya", "git", "github", "gitlab", "terminal", "buyruq", "klaviatura", "monitor", "protsessor",
    "xotira", "disk", "bulut", "xosting", "domen", "protokol", "http", "https", "api", "json", "xml", "html", "css",
    "javascript", "python", "java", "cpp", "csharp", "php", "sql", "nosql", "database", "mongodb", "postgres",
    "mysql", "redis", "docker", "kubernetes", "linux", "windows", "macos", "android", "ios", "mobil", "web",
    "dizayn", "frontend", "backend", "fullstack", "devops", "agile", "scrum", "kanban", "jira", "trello"
];

const GAMES = {
    TYPING: 'TYPING',
    QUIZ: 'QUIZ'
};

export const setupArenaSocket = (io) => {
    const arena = io.of('/arena');

    arena.on('connection', (socket) => {
        console.log('User connected to arena:', socket.id);

        // Create a new game room
        socket.on('create_room', ({ student, gameType = GAMES.TYPING }) => {
            const roomCode = generateRoomCode();

            rooms.set(roomCode, {
                id: roomCode,
                host: socket.id,
                players: [{
                    id: socket.id,
                    studentId: student.id,
                    name: student.full_name,
                    score: 0,
                    progress: 0,
                    wpm: 0,
                    isHost: true
                }],
                status: 'LOBBY', // LOBBY, PLAYING, FINISHED
                gameType,
                text: gameType === GAMES.TYPING ? words.sort(() => 0.5 - Math.random()).slice(0, 20).join(' ') : null,
                startTime: null
            });

            socket.join(roomCode);
            socket.emit('room_created', roomCode);
            arena.to(roomCode).emit('update_lobby', rooms.get(roomCode));
        });

        // Join an existing room
        socket.on('join_room', ({ roomCode, student }) => {
            const room = rooms.get(roomCode);

            if (!room) {
                return socket.emit('error', 'Xona topilmadi');
            }

            if (room.status !== 'LOBBY') {
                return socket.emit('error', 'O\'yin allaqachon boshlangan');
            }

            if (room.players.length >= 5) { // Limit to 5 players
                return socket.emit('error', 'Xona to\'la');
            }

            const existingPlayer = room.players.find(p => p.studentId === student.id);
            if (existingPlayer) {
                // Reconnect logic could go here, but for now just error
                return socket.emit('error', 'Siz allaqachon bu xonadasiz');
            }

            room.players.push({
                id: socket.id,
                studentId: student.id,
                name: student.full_name,
                score: 0,
                progress: 0,
                wpm: 0,
                isHost: false
            });

            socket.join(roomCode);
            arena.to(roomCode).emit('update_lobby', room);
        });

        // Start the game
        socket.on('start_game', (roomCode) => {
            const room = rooms.get(roomCode);
            if (!room) return;

            if (room.host !== socket.id) {
                return socket.emit('error', 'Faqat xona egasi o\'yinni boshlashi mumkin');
            }

            room.status = 'PLAYING';
            room.startTime = Date.now();

            arena.to(roomCode).emit('game_started', {
                text: room.text,
                startTime: room.startTime
            });
        });

        // Update progress (for typing game)
        socket.on('update_progress', ({ roomCode, progress, wpm }) => {
            const room = rooms.get(roomCode);
            if (!room || room.status !== 'PLAYING') return;

            const player = room.players.find(p => p.id === socket.id);
            if (player) {
                player.progress = progress;
                player.wpm = wpm;

                // Broadcast updates to everyone (real-time leaderboard)
                arena.to(roomCode).emit('progress_update', room.players);

                // Check for win condition (100% progress)
                if (progress >= 100 && !room.finishedPlayers?.includes(player.id)) {
                    if (!room.finishedPlayers) room.finishedPlayers = [];
                    room.finishedPlayers.push(player.id);

                    // Assign rank/score based on finish order
                    const rank = room.finishedPlayers.length;
                    let score = 0;
                    if (rank === 1) score = 100;
                    else if (rank === 2) score = 80;
                    else if (rank === 3) score = 60;
                    else score = 40;

                    player.score = score;
                    player.rank = rank;

                    // Save result to DB
                    saveResult(player.studentId, room.gameType, score, wpm, rank);

                    if (room.finishedPlayers.length === room.players.length) {
                        room.status = 'FINISHED';
                        arena.to(roomCode).emit('game_over', room.players);

                        // Cleanup room after delay
                        setTimeout(() => {
                            rooms.delete(roomCode);
                        }, 3600000); // 1 hour cleanup
                    }
                }
            }
        });

        socket.on('leave_room', (roomCode) => {
            handleDisconnect(socket, roomCode);
        });

        socket.on('disconnect', () => {
            // Find user's room
            for (const [code, room] of rooms.entries()) {
                if (room.players.find(p => p.id === socket.id)) {
                    handleDisconnect(socket, code);
                    break;
                }
            }
        });
    });
};

async function saveResult(studentId, gameType, score, wpm, rank) {
    try {
        await ArenaResult.create({
            student_id: studentId,
            game_type: gameType,
            score,
            wpm,
            rank_in_game: rank
        });
    } catch (err) {
        console.error('Error saving arena result:', err);
    }
}

function handleDisconnect(socket, roomCode) {
    const room = rooms.get(roomCode);
    if (!room) return;

    room.players = room.players.filter(p => p.id !== socket.id);

    if (room.players.length === 0) {
        rooms.delete(roomCode);
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
}
