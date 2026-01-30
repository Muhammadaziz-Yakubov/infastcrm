import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {
  Sword,
  Users,
  Trophy,
  Activity,
  Clock,
  TrendingUp,
  Gamepad2,
  Keyboard,
  Target,
  Award,
  Crown,
  Eye,
  BarChart3,
  Calendar,
  Filter,
  RefreshCw,
  Loader2,
  Zap,
  Flame,
  Star,
  Medal
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';

const AdminArena = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [activeRooms, setActiveRooms] = useState([]);
  const [recentGames, setRecentGames] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState('7d');

  // Initialize socket connection for admin monitoring
  useEffect(() => {
    const newSocket = io(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/admin-arena`, {
      transports: ['polling']
    });
    
    setSocket(newSocket);

    newSocket.on('rooms_update', (rooms) => {
      setActiveRooms(rooms);
    });

    return () => newSocket.close();
  }, []);

  // Load initial data
  useEffect(() => {
    loadStats();
    loadRecentGames();
    loadTopPlayers();
    loadAnalytics();
  }, [period]);

  const loadStats = async () => {
    try {
      const response = await api.get('/admin/arena/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Stats loading error:', err);
      // Set fallback data
      setStats({
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
        message: 'Using offline mode - connect to server for live data'
      });
    }
  };

  const loadRecentGames = async () => {
    try {
      const response = await api.get('/admin/arena/recent-games?limit=20');
      setRecentGames(response.data.games);
    } catch (err) {
      console.error('Recent games loading error:', err);
      // Set fallback data
      setRecentGames([]);
    }
  };

  const loadTopPlayers = async () => {
    try {
      const response = await api.get('/admin/arena/top-players?limit=50');
      setTopPlayers(response.data);
    } catch (err) {
      console.error('Top players loading error:', err);
      // Set fallback data
      setTopPlayers([
        { full_name: 'Demo Player 1', phone: '+998901234567', arena_pts: 1500, arena_rank: 'Gold', games_played: 25 },
        { full_name: 'Demo Player 2', phone: '+998907654321', arena_pts: 1200, arena_rank: 'Silver', games_played: 18 }
      ]);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await api.get(`/admin/arena/analytics?period=${period}`);
      setAnalytics(response.data);
    } catch (err) {
      console.error('Analytics loading error:', err);
      // Set fallback data
      setAnalytics({
        daily_stats: [],
        hourly_distribution: [],
        game_type_stats: { TYPING: 0, QUIZ: 0 },
        rank_distribution: {},
        message: 'Using offline mode - connect to server for live data'
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([
      loadStats(),
      loadRecentGames(),
      loadTopPlayers(),
      loadAnalytics()
    ]);
    setRefreshing(false);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'LOBBY': return 'bg-blue-100 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400';
      case 'PLAYING': return 'bg-green-100 text-green-600 dark:bg-green-600/20 dark:text-green-400';
      case 'FINISHED': return 'bg-gray-100 text-gray-600 dark:bg-gray-600/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f4f9] dark:bg-[#0c0e14]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600 dark:text-gray-400">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f4f9] dark:bg-[#0c0e14] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-xl">
                <Sword size={32} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">
                  Arena Admin
                </h1>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Real-time monitoring</p>
              </div>
            </div>
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="px-4 py-2 bg-white dark:bg-[#161a26] border border-gray-100 dark:border-white/5 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Yangilanmoqda...' : 'Yangilash'}
            </button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-[#161a26] rounded-2xl p-4 border border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Faol</span>
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">{stats.rooms.active}</div>
                <div className="text-xs text-gray-500">Faol xonalar</div>
              </div>
              
              <div className="bg-white dark:bg-[#161a26] rounded-2xl p-4 border border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <Gamepad2 className="w-5 h-5 text-green-500" />
                  <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Bugun</span>
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">{stats.games.today}</div>
                <div className="text-xs text-gray-500">Bugungi o'yinlar</div>
              </div>
              
              <div className="bg-white dark:bg-[#161a26] rounded-2xl p-4 border border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Aktiv</span>
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">{stats.players.active}</div>
                <div className="text-xs text-gray-500">Aktiv o'yinchilar</div>
              </div>
              
              <div className="bg-white dark:bg-[#161a26] rounded-2xl p-4 border border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Jami</span>
                </div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">{stats.games.total}</div>
                <div className="text-xs text-gray-500">Jami o'yinlar</div>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 bg-white dark:bg-[#161a26] rounded-2xl p-2 border border-gray-100 dark:border-white/5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${
                activeTab === 'overview'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Eye size={18} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('rooms')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${
                activeTab === 'rooms'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Users size={18} />
              Xonalar
            </button>
            <button
              onClick={() => setActiveTab('games')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${
                activeTab === 'games'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Gamepad2 size={18} />
              O'yinlar
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${
                activeTab === 'players'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Trophy size={18} />
              O'yinchilar
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${
                activeTab === 'analytics'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 size={18} />
              Analitika
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Rooms */}
            <div className="bg-white dark:bg-[#161a26] rounded-2xl border border-gray-100 dark:border-white/5">
              <div className="p-6 border-b border-gray-100 dark:border-white/5">
                <h2 className="text-xl font-black text-gray-900 dark:text uppercase tracking-tighter flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Faol xonalar
                </h2>
              </div>
              <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
                {activeRooms.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    Hozircha faol xonalar yo'q
                  </p>
                ) : (
                  activeRooms.map((room) => (
                    <div key={room.id} className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-black text-gray-900 dark:text-white uppercase">
                          Xona #{room.id}
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-xs font-black ${getStatusColor(room.status)}`}>
                          {room.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>{room.players.length}/7 o'yinchi</span>
                        {room.current_stage > 0 && <span>Stage {room.current_stage}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-[#161a26] rounded-2xl border border-gray-100 dark:border-white/5">
              <div className="p-6 border-b border-gray-100 dark:border-white/5">
                <h2 className="text-xl font-black text-gray-900 dark:text uppercase tracking-tighter flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  So'nggi faoliyat
                </h2>
              </div>
              <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
                {recentGames.slice(0, 10).map((game) => (
                  <div key={game._id} className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-black text-gray-900 dark:text-white uppercase">
                        {game.student_id?.full_name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        #{game.rank_in_game} o'rin
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {game.total_score} ball
                      </span>
                      <span className="text-green-600 font-black">
                        +{game.pts_earned} PTS
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {format(new Date(game.played_at), 'HH:mm, dd MMM', { locale: uz })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="bg-white dark:bg-[#161a26] rounded-2xl border border-gray-100 dark:border-white/5">
            <div className="p-6 border-b border-gray-100 dark:border-white/5">
              <h2 className="text-xl font-black text-gray-900 dark:text uppercase tracking-tighter flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Barcha xonalar
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Xona</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">O'yinchilar</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Egasi</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Yaratilgan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {activeRooms.map((room) => (
                    <tr key={room.id}>
                      <td className="px-6 py-4 font-black text-gray-900 dark:text-white">
                        #{room.id}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-black ${getStatusColor(room.status)}`}>
                          {room.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {room.players.length}/7
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {room.players.find(p => p.isHost)?.name || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {room.started_at ? format(new Date(room.started_at), 'HH:mm', { locale: uz }) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'games' && (
          <div className="bg-white dark:bg-[#161a26] rounded-2xl border border-gray-100 dark:border-white/5">
            <div className="p-6 border-b border-gray-100 dark:border-white/5">
              <h2 className="text-xl font-black text-gray-900 dark:text uppercase tracking-tighter flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-green-500" />
                So'nggi o'yinlar
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">O'yinchi</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Ball</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">WPM</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Aniqlik</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">O'rin</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">PTS</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Vaqt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {recentGames.map((game) => (
                    <tr key={game._id}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-black text-gray-900 dark:text-white">
                            {game.student_id?.full_name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {game.student_id?.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-gray-900 dark:text-white">
                        {game.total_score}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {game.overall_wpm}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {game.overall_accuracy}%
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(game.rank_in_game)}
                          <span className={`font-black ${getRankColor(game.rank_in_game)}`}>
                            #{game.rank_in_game}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-green-600">
                        +{game.pts_earned}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {format(new Date(game.played_at), 'HH:mm, dd MMM', { locale: uz })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'players' && (
          <div className="bg-white dark:bg-[#161a26] rounded-2xl border border-gray-100 dark:border-white/5">
            <div className="p-6 border-b border-gray-100 dark:border-white/5">
              <h2 className="text-xl font-black text-gray-900 dark:text uppercase tracking-tighter flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Top o'yinchilar
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">O'yinchi</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">PTS</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">O'yinlar</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">O'rtacha ball</th>
                    <th className="px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Telefon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {topPlayers.map((player, index) => (
                    <tr key={player._id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${getRankColor(index + 1)}`}>
                            {getRankIcon(index + 1)}
                          </div>
                          <div>
                            <div className="font-black text-gray-900 dark:text-white uppercase">
                              {player.full_name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Level {player.gamification?.level || 1}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-lg text-gray-900 dark:text-white">
                        {player.arena_pts}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 rounded-lg text-xs font-black">
                          {player.arena_rank}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {player.total_games}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {Math.round(player.average_score)}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {player.phone}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            {/* Period Selector */}
            <div className="flex gap-2 bg-white dark:bg-[#161a26] rounded-2xl p-2 border border-gray-100 dark:border-white/5 w-fit">
              {['7d', '30d', '90d'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${
                    period === p
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {p === '7d' ? '7 kun' : p === '30d' ? '30 kun' : '90 kun'}
                </button>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Games Over Time */}
              <div className="bg-white dark:bg-[#161a26] rounded-2xl border border-gray-100 dark:border-white/5 p-6">
                <h3 className="text-lg font-black text-gray-900 dark:text uppercase tracking-tighter mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  O'yinlar dinamikasi
                </h3>
                <div className="space-y-2">
                  {analytics.games_over_time.slice(-7).map((item) => (
                    <div key={item._id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item._id}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.min((item.count / Math.max(...analytics.games_over_time.map(g => g.count))) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-black text-gray-900 dark:text-white w-8 text-right">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WPM Over Time */}
              <div className="bg-white dark:bg-[#161a26] rounded-2xl border border-gray-100 dark:border-white/5 p-6">
                <h3 className="text-lg font-black text-gray-900 dark:text uppercase tracking-tighter mb-4 flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-green-500" />
                  WPM dinamikasi
                </h3>
                <div className="space-y-2">
                  {analytics.wpm_over_time.slice(-7).map((item) => (
                    <div key={item._id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item._id}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${Math.min((item.avg_wpm / 100) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-black text-gray-900 dark:text-white w-12 text-right">
                          {Math.round(item.avg_wpm)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rank Distribution */}
              <div className="bg-white dark:bg-[#161a26] rounded-2xl border border-gray-100 dark:border-white/5 p-6">
                <h3 className="text-lg font-black text-gray-900 dark:text uppercase tracking-tighter mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  O'rinlarni taqsimoti
                </h3>
                <div className="space-y-2">
                  {analytics.rank_distribution.map((item) => (
                    <div key={item._id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getRankIcon(item._id)}
                        <span className="text-sm font-black text-gray-900 dark:text-white">
                          {item._id}-o'rin
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-yellow-600 h-2 rounded-full"
                            style={{ width: `${Math.min((item.count / Math.max(...analytics.rank_distribution.map(r => r.count))) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-black text-gray-900 dark:text-white w-8 text-right">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PTS Distribution */}
              <div className="bg-white dark:bg-[#161a26] rounded-2xl border border-gray-100 dark:border-white/5 p-6">
                <h3 className="text-lg font-black text-gray-900 dark:text uppercase tracking-tighter mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-500" />
                  PTS taqsimoti
                </h3>
                <div className="space-y-2">
                  {stats.pts_distribution?.map((item) => (
                    <div key={item._id} className="flex items-center justify-between">
                      <span className="text-sm font-black text-gray-900 dark:text-white">
                        {item._id}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${Math.min((item.count / Math.max(...stats.pts_distribution.map(p => p.count))) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-black text-gray-900 dark:text-white w-8 text-right">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminArena;
