import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
  Sword,
  Users,
  Trophy,
  Clock,
  Zap,
  Play,
  Plus,
  Copy,
  Check,
  X,
  Timer,
  Target,
  Award,
  Star,
  Flame,
  ChevronRight,
  Gamepad2,
  Keyboard,
  Gauge,
  Medal,
  Crown,
  Loader2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const StudentArena = () => {
  const { theme } = useTheme();
  const { student } = useAuth();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [activeTab, setActiveTab] = useState('lobby');
  const [roomCode, setRoomCode] = useState('');
  const [roomState, setRoomState] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [currentStage, setCurrentStage] = useState(0);
  const [stageWords, setStageWords] = useState([]);
  const [stageTime, setStageTime] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/arena`, {
      transports: ['polling']
    });
    
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('room_created', ({ roomCode, roomState }) => {
      setRoomCode(roomCode);
      setRoomState(roomState);
      setActiveTab('room');
    });

    newSocket.on('joined_room', (roomState) => {
      setRoomState(roomState);
      setActiveTab('room');
    });

    newSocket.on('update_lobby', (room) => {
      setRoomState(room);
    });

    newSocket.on('stage_started', ({ stage, words, stage_time }) => {
      setCurrentStage(stage);
      setStageWords(words);
      setStageTime(stage_time);
      setGameState('playing');
      setCurrentWordIndex(0);
      setUserInput('');
      setStartTime(Date.now());
      setTotalKeystrokes(0);
      setCorrectKeystrokes(0);
    });

    newSocket.on('progress_update', ({ players }) => {
      if (roomState) {
        setRoomState(prev => ({
          ...prev,
          players: prev.players.map(p => {
            const playerData = players.find(pl => pl.name === p.name);
            return playerData ? { ...p, ...playerData } : p;
          })
        }));
      }
    });

    newSocket.on('stage_completed', ({ stage, score, total_score }) => {
      // Update player score in room state
      if (roomState) {
        setRoomState(prev => ({
          ...prev,
          players: prev.players.map(p => 
            p.id === socket.id ? { ...p, total_score } : p
          )
        }));
      }
    });

    newSocket.on('waiting_for_players', ({ count, message }) => {
      setGameState('waiting');
    });

    newSocket.on('game_finished', ({ players, final_rankings }) => {
      setGameState('finished');
      setRoomState(prev => ({ ...prev, players: final_rankings }));
    });

    newSocket.on('error', (message) => {
      alert(message);
      setLoading(false);
    });

    return () => newSocket.close();
  }, []);

  // Load initial data
  useEffect(() => {
    loadStats();
    loadLeaderboard();
    loadAvailableRooms();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/api/arena/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Stats loading error:', err);
      // Set fallback data for development/offline mode
      setStats({
        total_games: 0,
        total_score: 0,
        arena_pts: 0,
        arena_rank: 'Bronze',
        avg_wpm: 0,
        avg_accuracy: 0,
        recent_results: [],
        message: 'Using offline mode - connect to server for live data'
      });
    }
  };

  const loadLeaderboard = async () => {
    try {
      const response = await api.get('/api/arena/leaderboard?limit=10');
      setLeaderboard(response.data);
    } catch (err) {
      console.error('Leaderboard loading error:', err);
      // Set fallback data
      setLeaderboard([
        { full_name: 'Demo Player 1', arena_pts: 1500, arena_rank: 'Gold' },
        { full_name: 'Demo Player 2', arena_pts: 1200, arena_rank: 'Silver' },
        { full_name: 'Demo Player 3', arena_pts: 800, arena_rank: 'Bronze' }
      ]);
    }
  };

  const loadAvailableRooms = async () => {
    try {
      const response = await api.get('/api/arena/rooms');
      setAvailableRooms(response.data);
    } catch (err) {
      console.error('Available rooms loading error:', err);
      // Set fallback data
      setAvailableRooms([]);
    }
  };

  const createRoom = () => {
    if (!socket || !student) return;
    setLoading(true);
    socket.emit('create_room', { studentId: student.id });
  };

  const joinRoom = (code) => {
    if (!socket || !student) return;
    setLoading(true);
    socket.emit('join_room', { roomCode: code, studentId: student.id });
  };

  const startGame = () => {
    if (!socket || !roomCode) return;
    socket.emit('start_game', roomCode);
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Typing logic
  const handleInputChange = (e) => {
    const input = e.target.value;
    setUserInput(input);
    
    if (!startTime) {
      setStartTime(Date.now());
    }

    // Calculate WPM and accuracy
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    const wordsTyped = input.trim().split(' ').length;
    const currentWpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
    setWpm(currentWpm);

    // Update keystrokes for accuracy
    setTotalKeystrokes(prev => prev + 1);
    if (input === stageWords[currentWordIndex]?.slice(0, input.length)) {
      setCorrectKeystrokes(prev => prev + 1);
    }
    setAccuracy(totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100);

    // Check if word is completed
    if (input.endsWith(' ')) {
      const word = input.trim();
      if (word === stageWords[currentWordIndex]) {
        // Word completed correctly
        const nextIndex = currentWordIndex + 1;
        setCurrentWordIndex(nextIndex);
        setUserInput('');
        
        // Send progress to server
        if (socket && roomCode) {
          socket.emit('typing_progress', {
            roomCode,
            stage: currentStage,
            wordsCompleted: nextIndex,
            wpm: currentWpm,
            accuracy: accuracy
          });
        }

        // Check if stage is completed
        if (nextIndex >= stageWords.length) {
          // Stage completed
          if (socket && roomCode) {
            socket.emit('finish_game', { roomCode });
          }
        }
      } else {
        // Word incorrect, clear input
        setUserInput('');
      }
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5" />;
      case 2: return <Medal className="w-5 h-5" />;
      case 3: return <Award className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f4f9] dark:bg-[#0c0e14] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-xl">
              <Sword size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">
                Arena
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Tez yozish bo'yicha musobaqa</p>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-[#161a26] rounded-2xl p-4 border border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-xs font-black text-gray-500 uppercase tracking-wider">PTS</span>
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">{stats.arena_pts}</div>
                <div className="text-xs text-gray-500">{stats.arena_rank}</div>
              </div>
              
              <div className="bg-white dark:bg-[#161a26] rounded-2xl p-4 border border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <Gamepad2 className="w-5 h-5 text-purple-500" />
                  <span className="text-xs font-black text-gray-500 uppercase tracking-wider">O'yinlar</span>
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">{stats.total_games}</div>
                <div className="text-xs text-gray-500">Jami o'yinlar</div>
              </div>
              
              <div className="bg-white dark:bg-[#161a26] rounded-2xl p-4 border border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <Keyboard className="w-5 h-5 text-green-500" />
                  <span className="text-xs font-black text-gray-500 uppercase tracking-wider">WPM</span>
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">{stats.average_wpm}</div>
                <div className="text-xs text-gray-500">O'rtacha tezlik</div>
              </div>
              
              <div className="bg-white dark:bg-[#161a26] rounded-2xl p-4 border border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Aniqlik</span>
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">{stats.average_accuracy}%</div>
                <div className="text-xs text-gray-500">O'rtacha aniqlik</div>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 bg-white dark:bg-[#161a26] rounded-2xl p-2 border border-gray-100 dark:border-white/5">
            <button
              onClick={() => setActiveTab('lobby')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${
                activeTab === 'lobby'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Users size={18} />
              Lobby
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${
                activeTab === 'create'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Plus size={18} />
              Xona yaratish
            </button>
            <button
              onClick={() => setActiveTab('join')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${
                activeTab === 'join'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <ChevronRight size={18} />
              Qo'shilish
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Trophy size={18} />
              Reyting
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'lobby' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Rooms */}
            <div className="bg-white dark:bg-[#161a26] rounded-2xl border border-gray-100 dark:border-white/5">
              <div className="p-6 border-b border-gray-100 dark:border-white/5">
                <h2 className="text-xl font-black text-gray-900 dark:text uppercase tracking-tighter flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  Faol xonalar
                </h2>
              </div>
              <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
                {availableRooms.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    Hozircha faol xonalar yo'q
                  </p>
                ) : (
                  availableRooms.map((room) => (
                    <div
                      key={room._id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => joinRoom(room.room_code)}
                    >
                      <div>
                        <div className="font-black text-gray-900 dark:text-white uppercase">
                          Xona #{room.room_code}
                        </div>
                        <div className="text-sm text-gray-500">
                          {room.players?.length || 0}/7 o'yinchi
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-[#161a26] rounded-2xl border border-gray-100 dark:border-white/5">
              <div className="p-6 border-b border-gray-100 dark:border-white/5">
                <h2 className="text-xl font-black text-gray-900 dark:text uppercase tracking-tighter flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Tezkor statistika
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Jami o'yinlar</span>
                    <span className="font-black text-gray-900 dark:text-white">{stats?.total_games || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Eng yaxshi reyting</span>
                    <span className="font-black text-gray-900 dark:text-white">#{stats?.best_rank || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Yutgan PTS</span>
                    <span className="font-black text-green-600">+{stats?.total_pts_earned || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-[#161a26] rounded-2xl border border-gray-100 dark:border-white/5 p-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-xl mx-auto mb-4">
                  <Plus size={40} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">
                  Yangi xona yaratish
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  7 kishigacha bo'lgan tez yozish musobaqasi yarating
                </p>
              </div>
              
              <button
                onClick={createRoom}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-sm uppercase tracking-wider py-4 rounded-2xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play size={20} />}
                {loading ? 'Yaratilmoqda...' : 'Xona yaratish'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'join' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-[#161a26] rounded-2xl border border-gray-100 dark:border-white/5 p-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-xl mx-auto mb-4">
                  <Users size={40} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">
                  Xonaga qo'shilish
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  4 xonali xona kodini kiriting
                </p>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="1234"
                  maxLength={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-center text-2xl font-black tracking-widest text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button
                  onClick={() => joinRoom(roomCode)}
                  disabled={loading || roomCode.length !== 4}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-sm uppercase tracking-wider py-4 rounded-2xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight size={20} />}
                  {loading ? 'Qo\'shilmoqda...' : 'Qo\'shilish'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="bg-white dark:bg-[#161a26] rounded-2xl border border-gray-100 dark:border-white/5">
            <div className="p-6 border-b border-gray-100 dark:border-white/5">
              <h2 className="text-xl font-black text-gray-900 dark:text uppercase tracking-tighter flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Global reyting
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {leaderboard.map((player, index) => (
                  <div
                    key={player._id}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-500/10 dark:to-orange-500/10' : 'bg-gray-50 dark:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${getRankColor(index + 1)}`}>
                        {getRankIcon(index + 1)}
                      </div>
                      <div>
                        <div className="font-black text-gray-900 dark:text-white uppercase">
                          {player.full_name}
                        </div>
                        <div className="text-sm text-gray-500">{player.arena_rank}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-lg text-gray-900 dark:text-white">{player.arena_pts}</div>
                      <div className="text-xs text-gray-500">PTS</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'room' && roomState && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-[#161a26] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
              {/* Room Header */}
              <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">
                      Xona #{roomCode}
                    </h2>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Users size={16} />
                        {roomState.players.length}/7 o'yinchi
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {roomState.status === 'LOBBY' ? 'Kutilmoqda' : roomState.status === 'PLAYING' ? 'O\'yin davom etmoqda' : 'Tugadi'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyRoomCode}
                      className="px-4 py-2 bg-white/20 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-white/30 transition-colors flex items-center gap-2"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? 'Nusxalandi!' : 'Nusxalash'}
                    </button>
                    {roomState.host === socket?.id && roomState.status === 'LOBBY' && (
                      <button
                        onClick={startGame}
                        disabled={roomState.players.length < 1}
                        className="px-6 py-2 bg-white text-purple-600 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Play size={16} />
                        Boshlash
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Players List */}
              <div className="p-6">
                <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  O'yinchilar
                </h3>
                <div className="space-y-3">
                  {roomState.players.map((player) => (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-4 rounded-xl ${
                        player.id === socket?.id ? 'bg-purple-50 dark:bg-purple-600/20 border-2 border-purple-600' : 'bg-gray-50 dark:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-black">
                          {player.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black text-gray-900 dark:text-white uppercase flex items-center gap-2">
                            {player.name}
                            {player.isHost && <Crown className="w-4 h-4 text-yellow-500" />}
                            {player.id === socket?.id && <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">SIZ</span>}
                          </div>
                          <div className="text-sm text-gray-500">{player.arena_rank} • {player.arena_pts} PTS</div>
                        </div>
                      </div>
                      <div className="text-right">
                        {gameState === 'playing' && (
                          <div>
                            <div className="font-black text-lg text-gray-900 dark:text-white">{player.total_score}</div>
                            <div className="text-xs text-gray-500">Ball</div>
                          </div>
                        )}
                        {player.current_stage > 0 && (
                          <div className="text-sm text-purple-600 font-black">
                            Stage {player.current_stage}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Game Area */}
              {gameState === 'playing' && (
                <div className="p-6 border-t border-gray-100 dark:border-white/5">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-wider">
                        Stage {currentStage}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Keyboard size={16} />
                          {wpm} WPM
                        </span>
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Target size={16} />
                          {accuracy}%
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {stageWords.map((word, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-lg font-mono text-sm ${
                              index < currentWordIndex
                                ? 'bg-green-100 dark:bg-green-600/20 text-green-600 dark:text-green-400'
                                : index === currentWordIndex
                                ? 'bg-purple-100 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 ring-2 ring-purple-600'
                                : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={userInput}
                        onChange={handleInputChange}
                        placeholder="Bu yerga yozing..."
                        className="w-full px-4 py-3 bg-white dark:bg-[#161a26] border border-gray-200 dark:border-white/10 rounded-xl font-mono text-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        autoFocus
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Waiting State */}
              {gameState === 'waiting' && (
                <div className="p-6 border-t border-gray-100 dark:border-white/5 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Boshqa o'yinchilar tugashini kutmoqda...
                  </p>
                </div>
              )}

              {/* Finished State */}
              {gameState === 'finished' && (
                <div className="p-6 border-t border-gray-100 dark:border-white/5">
                  <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4 text-center">
                    🎉 O'yin tugadi!
                  </h3>
                  <div className="space-y-3">
                    {roomState.players
                      .sort((a, b) => b.total_score - a.total_score)
                      .map((player, index) => (
                        <div
                          key={player.id}
                          className={`flex items-center justify-between p-4 rounded-xl ${
                            index === 0 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-500/10 dark:to-orange-500/10' : 'bg-gray-50 dark:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${getRankColor(index + 1)}`}>
                              {getRankIcon(index + 1)}
                            </div>
                            <div>
                              <div className="font-black text-gray-900 dark:text-white uppercase">
                                {player.name}
                              </div>
                              <div className="text-sm text-gray-500">+{player.pts_earned} PTS</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-black text-lg text-gray-900 dark:text-white">{player.total_score}</div>
                            <div className="text-xs text-gray-500">Ball</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentArena;
