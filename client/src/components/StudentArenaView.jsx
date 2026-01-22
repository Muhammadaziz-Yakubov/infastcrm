import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import {
    Gamepad2,
    Users,
    Play,
    Trophy,
    Timer,
    Keyboard,
    ArrowRight,
    Copy,
    Crown,
    Activity,
    Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SOCKET_URL = import.meta.env.DEV ? 'http://localhost:5000/arena' : 'https://infastcrm-0b2r.onrender.com/arena';

export default function StudentArenaView() {
    const { student } = useAuth();
    const [socket, setSocket] = useState(null);
    const [gameState, setGameState] = useState('MENU'); // MENU, LOBBY, PLAYING, FINISHED
    const [roomCode, setRoomCode] = useState('');
    const [roomData, setRoomData] = useState(null);
    const [inputCode, setInputCode] = useState('');
    const [error, setError] = useState('');

    // Game State
    const [text, setText] = useState('');
    const [input, setInput] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [wpm, setWpm] = useState(0);
    const [progress, setProgress] = useState(0);
    const [myResult, setMyResult] = useState(null);

    const inputRef = useRef(null);

    // Initialize Socket
    useEffect(() => {
        const newSocket = io(SOCKET_URL, {
            transports: ['websocket'],
            autoConnect: true
        });

        setSocket(newSocket);

        // Listeners
        newSocket.on('connect', () => console.log('Connected to Arena'));

        newSocket.on('room_created', (code) => {
            setRoomCode(code);
            setGameState('LOBBY');
        });

        newSocket.on('update_lobby', (data) => {
            setRoomData(data);
            if (data.status === 'LOBBY') setGameState('LOBBY');
        });

        newSocket.on('game_started', ({ text, startTime }) => {
            setText(text);
            setStartTime(startTime);
            setGameState('PLAYING');
            setInput('');
            setProgress(0);
            setWpm(0);
            // Focus input
            setTimeout(() => inputRef.current?.focus(), 100);
        });

        newSocket.on('progress_update', (players) => {
            setRoomData(prev => ({ ...prev, players }));
        });

        newSocket.on('game_over', (players) => {
            setRoomData(prev => ({ ...prev, players, status: 'FINISHED' }));
            setGameState('FINISHED');
            // Find my result
            const me = players.find(p => p.studentId === student.id);
            setMyResult(me);
        });

        newSocket.on('error', (msg) => setError(msg));

        return () => newSocket.close();
    }, [student.id]);

    // Clear errors after 3s
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const createGame = () => {
        if (!socket) return;
        socket.emit('create_room', { student });
    };

    const joinGame = () => {
        if (!socket || !inputCode) return;
        socket.emit('join_room', { roomCode: inputCode, student });
        setRoomCode(inputCode);
    };

    const startGame = () => {
        if (!socket || !roomCode) return;
        socket.emit('start_game', roomCode);
    };

    const handleTyping = (e) => {
        const value = e.target.value;
        setInput(value);

        // Calculate progress
        if (!text) return;

        // Simple matching logic
        // We only count correct characters from the start
        let correctChars = 0;
        for (let i = 0; i < value.length; i++) {
            if (value[i] === text[i]) correctChars++;
            else break; // Stop at first error? Or allow corrections? Let's just track correct prefix.
        }

        // If strict typing (must match exactly)
        // Let's do simple: length of input relative to text, but only if it matches
        const isMatch = text.startsWith(value);
        const currentProgress = Math.min(100, Math.floor((value.length / text.length) * 100));

        // WPM Calc
        const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
        const wordsTyped = value.length / 5;
        const currentWpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;

        if (isMatch) {
            setProgress(currentProgress);
            setWpm(currentWpm);
            socket.emit('update_progress', { roomCode, progress: currentProgress, wpm: currentWpm });
        }
    };

    // Prevent copy paste
    const handlePaste = (e) => e.preventDefault();

    return (
        <div className="h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-8 animate-fade-in-down">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                        <span className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/30">
                            <Gamepad2 size={32} />
                        </span>
                        Arena
                    </h1>
                    <p className="text-gray-500 font-bold mt-2 ml-1">Guruhdoshlar bilan bellashuv maydoni</p>
                </div>

                {/* Connection Status */}
                <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 ${socket?.connected ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-red-100 text-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${socket?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                    {socket?.connected ? 'Online' : 'Offline'}
                </div>
            </div>

            {/* Error Toast */}
            {error && (
                <div className="fixed top-6 right-6 bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl animate-shake z-50 font-bold flex items-center gap-3">
                    <Activity size={20} />
                    {error}
                </div>
            )}

            {/* VIEW: MENU */}
            {gameState === 'MENU' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12 animate-fade-in-up">
                    {/* CREATE GAME */}
                    <button
                        onClick={createGame}
                        className="group relative overflow-hidden bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] shadow-2xl hover:shadow-indigo-500/30 transition-all border border-gray-100 dark:border-gray-700 text-left"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-indigo-600/20 transition-colors"></div>
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform shadow-lg">
                                <Gamepad2 size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">O'yin yaratish</h2>
                            <p className="text-gray-500 font-medium mb-8">Yangi xona oching va do'stlaringizni taklif qiling. Bellashuvni boshqaring!</p>
                            <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-sm group-hover:translate-x-2 transition-transform">
                                Boshlash <ArrowRight size={18} />
                            </div>
                        </div>
                    </button>

                    {/* JOIN GAME */}
                    <div className="group relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-800 p-10 rounded-[2.5rem] shadow-2xl text-white text-left">
                        <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg">
                                <Users size={40} />
                            </div>
                            <h2 className="text-3xl font-black mb-4">O'yinga qo'shilish</h2>
                            <p className="text-indigo-100 font-medium mb-8">Do'stingiz yuborgan kodni kiriting va jangga kirishing.</p>

                            <div className="mt-auto space-y-4">
                                <input
                                    type="text"
                                    maxLength={4}
                                    value={inputCode}
                                    onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                                    placeholder="4 xonali kod"
                                    className="w-full bg-white/10 border-2 border-white/20 rounded-2xl px-6 py-4 text-white placeholder-white/50 font-mono text-xl font-bold text-center tracking-[0.5em] focus:outline-none focus:border-white transition-colors"
                                />
                                <button
                                    onClick={joinGame}
                                    disabled={inputCode.length !== 4}
                                    className="w-full bg-white text-indigo-600 rounded-2xl py-4 font-black uppercase tracking-widest hover:bg-indigo-50 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Qo'shilish
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW: LOBBY */}
            {gameState === 'LOBBY' && roomData && (
                <div className="max-w-4xl mx-auto mt-8 animate-fade-in">
                    {/* Room Info */}
                    <div className="text-center mb-12">
                        <h2 className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-4">Xona kodi</h2>
                        <div
                            className="inline-flex items-center gap-6 bg-white dark:bg-gray-800 px-12 py-6 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-700 cursor-pointer hover:scale-105 transition-transform active:scale-95"
                            onClick={() => {
                                navigator.clipboard.writeText(roomCode);
                                // alert toast
                            }}
                        >
                            <span className="text-6xl font-black text-indigo-600 font-mono tracking-[0.2em]">{roomCode}</span>
                            <Copy size={24} className="text-gray-400" />
                        </div>
                        <p className="text-indigo-500 font-bold mt-4 text-xs uppercase tracking-wider animate-pulse">O'yinchilar kutilmoqda...</p>
                    </div>

                    {/* Players View */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                        {roomData.players.map((player) => (
                            <div key={player.id} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-lg border-2 border-transparent relative overflow-hidden animate-pop-in">
                                {player.isHost && (
                                    <div className="absolute top-0 right-0 p-3 bg-yellow-400 rounded-bl-2xl shadow-lg">
                                        <Crown size={16} className="text-white" />
                                    </div>
                                )}
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black mb-4 shadow-lg shadow-indigo-500/30">
                                        {player.name[0]}
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg text-center truncate w-full">{player.name}</h3>
                                    <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest mt-2">
                                        Tayyor
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Empty slots */}
                        {[...Array(5 - roomData.players.length)].map((_, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center opacity-50">
                                <div className="text-gray-300 dark:text-gray-600 font-bold text-sm uppercase tracking-widest">
                                    Bo'sh joy
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    {roomData.host === socket?.id ? (
                        <button
                            onClick={startGame}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-[2rem] font-black text-xl uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            O'yinni Boshlash
                        </button>
                    ) : (
                        <div className="text-center p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] text-indigo-600 font-bold animate-pulse">
                            Host o'yinni boshlashini kuting...
                        </div>
                    )}
                </div>
            )}

            {/* VIEW: PLAYING */}
            {gameState === 'PLAYING' && (
                <div className="max-w-5xl mx-auto mt-4 animate-fade-in">
                    {/* Progress Bars of Opponents */}
                    <div className="space-y-4 mb-10">
                        {roomData.players.filter(p => p.id !== socket?.id).map(player => (
                            <div key={player.id} className="flex items-center gap-4 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-black text-indigo-600">
                                    {player.name[0]}
                                </div>
                                <span className="text-xs font-bold text-gray-500 w-24 truncate">{player.name}</span>
                                <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 transition-all duration-300 ease-out"
                                        style={{ width: `${player.progress}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs font-mono font-bold text-gray-900 dark:text-white w-12 text-right">{player.wpm} WPM</span>
                            </div>
                        ))}
                    </div>

                    {/* Main Game Area */}
                    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                        {/* Stats Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-around text-white">
                            <div className="text-center">
                                <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Tezlik</p>
                                <p className="text-3xl font-black font-mono">{wpm} <span className="text-sm opacity-50">WPM</span></p>
                            </div>
                            <div className="text-center">
                                <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Progress</p>
                                <p className="text-3xl font-black font-mono">{progress}%</p>
                            </div>
                            <div className="text-center">
                                <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Aniqlik</p>
                                <p className="text-3xl font-black font-mono">100%</p>
                            </div>
                        </div>

                        <div className="p-8 md:p-12 relative cursor-text" onClick={() => inputRef.current?.focus()}>
                            {/* Text Display - visible, below input */}
                            <div className="mb-8 text-xl md:text-2xl leading-relaxed font-mono font-medium text-gray-400 select-none relative z-0">
                                {/* Overlay already typed text */}
                                <span className="text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 transition-colors">
                                    {text.substring(0, input.length)}
                                </span>
                                {/* Cursor */}
                                <span className="inline-block w-0.5 h-6 align-middle bg-orange-500 animate-blink mx-px"></span>
                                {/* Remaining text */}
                                <span>{text.substring(input.length)}</span>
                            </div>

                            {/* Input Area - Invisible covering layer */}
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={handleTyping}
                                onPaste={handlePaste}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10 resize-none p-8 md:p-12 text-xl font-mono focus:outline-none"
                                spellCheck="false"
                                autoFocus
                            />

                            <div className="absolute bottom-4 left-0 w-full text-center text-gray-400 text-sm font-bold animate-pulse pointer-events-none z-0">
                                Yozish uchun bosing...
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW: FINISHED */}
            {gameState === 'FINISHED' && (
                <div className="max-w-3xl mx-auto mt-8 animate-fade-in-up">
                    <div className="text-center mb-10">
                        <Trophy size={64} className="text-yellow-400 mx-auto mb-6 animate-bounce" />
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">O'yin Tugadi!</h2>
                        <p className="text-gray-500 font-medium">Natijalar hisoblandi</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                        {roomData.players
                            .sort((a, b) => (b.score || 0) - (a.score || 0))
                            .map((player, index) => (
                                <div
                                    key={player.id}
                                    className={`flex items-center justify-between p-6 md:p-8 border-b border-gray-50 dark:border-gray-700/50 last:border-0 ${player.id === socket?.id ? 'bg-indigo-50 dark:bg-indigo-900/10' : ''}`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg
                        ${index === 0 ? 'bg-yellow-400 text-white' :
                                                index === 1 ? 'bg-gray-300 text-white' :
                                                    index === 2 ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-400'}
                      `}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                {player.name}
                                                {player.id === socket?.id && <span className="bg-indigo-100 text-indigo-600 text-[10px] px-2 py-1 rounded-full uppercase tracking-wider">Men</span>}
                                            </h3>
                                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{player.wpm} WPM</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <span className={`text-3xl font-black ${index === 0 ? 'text-yellow-500' : 'text-indigo-600'}`}>
                                            +{player.score || 0}
                                        </span>
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Ball</p>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => {
                                setGameState('MENU');
                                setRoomCode('');
                                setRoomData(null);
                                setMyResult(null);
                            }}
                            className="bg-white dark:bg-gray-800 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-indigo-600 shadow-xl hover:scale-105 transition-transform"
                        >
                            Bosh sahifa
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
