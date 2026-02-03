import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  LogOut,
  Activity,
  Moon,
  Sun,
  Wallet,
  FileCode,
  Trophy,
  LayoutDashboard,
  UserCircle,
  Users,
  Brain,
  Target,
  ChevronRight,
  ArrowRight,
  Bell,
  ShoppingBag,
  Zap,
  Star,
  Sparkles,
  Search,
  Settings,
  MoreVertical,
  ArrowUpRight,
  Coins
} from 'lucide-react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

// Sub-components
import StudentTasksView from '../components/StudentTasksView';
import StudentExamsView from '../components/StudentExamsView';
import StudentRatingView from '../components/StudentRatingView';
import StudentClassmatesView from '../components/StudentClassmatesView';
import StudentMarket from './StudentMarket';
import StudentEvents from './StudentEvents';

export default function StudentDashboard() {
  const { tab: urlTab } = useParams();
=======
import { useNavigate, Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Calendar, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  LogOut,
  User,
  BookOpen,
  TrendingUp,
  Moon,
  Sun,
  History,
  Wallet,
  FileCode,
  Trophy,
  Star,
  ChevronRight
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { uz } from 'date-fns/locale';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

export default function StudentDashboard() {
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { darkMode, toggleDarkMode } = useTheme();
<<<<<<< HEAD
  const { student, studentLogout } = useAuth();
  const navigate = useNavigate();
  const [fullScreen, setFullScreen] = useState(false);
  const [dashboardCache, setDashboardCache] = useState(null);

  // Cache for dashboard data
  const CACHE_KEY = 'student_dashboard_cache';
  const CACHE_DURATION = 30 * 1000; // 30 seconds (down from 5 min)

  // Sync activeTab with URL param if present
  useEffect(() => {
    if (urlTab && ['overview', 'tasks', 'classmates', 'market', 'events', 'exams', 'rating', 'attendance', 'payments'].includes(urlTab)) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);
=======
  const navigate = useNavigate();
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88

  useEffect(() => {
    const token = localStorage.getItem('studentToken');
    if (!token) {
      navigate('/student-login');
      return;
    }
    fetchDashboard();
<<<<<<< HEAD
  }, []);

  const fetchDashboard = async (retryCount = 0) => {
    // Check cache first
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cacheTimestamp = localStorage.getItem(`${CACHE_KEY}_timestamp`);

    if (cachedData && cacheTimestamp) {
      const cacheAge = Date.now() - parseInt(cacheTimestamp);
      if (cacheAge < CACHE_DURATION) {
        setData(JSON.parse(cachedData));
        setLoading(false);
        return;
      }
    }

    try {
      const response = await api.get('/student-auth/dashboard');
      const dashboardData = response.data;

      // Cache the data
      localStorage.setItem(CACHE_KEY, JSON.stringify(dashboardData));
      localStorage.setItem(`${CACHE_KEY}_timestamp`, Date.now().toString());

      setData(dashboardData);
    } catch (error) {
      console.error('❌ Error fetching dashboard:', error);

      // Check if it's an authentication error
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('🔒 Authentication failed, redirecting to login...');
        // Clear invalid tokens
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentData');
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(`${CACHE_KEY}_timestamp`);
        navigate('/student-login');
        return;
      }

      // Retry once if it's a timeout error
      if (retryCount === 0 && error.code === 'ECONNABORTED') {
        console.log('🔄 Retrying dashboard fetch...');
        return fetchDashboard(1);
      }

      // Set default data to prevent UI issues
      setData({
        student: null,
        group: null,
        payments: [],
        totalPaid: 0,
        attendance: { records: [], stats: { total: 0, present: 0, absent: 0, late: 0, percentage: 0 } },
        quizzes: { lastResults: [], stats: { total: 0, avgPercentage: 0 } },
        tasks: { pendingCount: 0, submittedCount: 0, gradedCount: 0, totalCount: 0 },
        exams: { stats: { count: 0, avgScore: 0 } }
      });
=======
  }, [navigate]);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const response = await api.get('/student-auth/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
<<<<<<< HEAD
    studentLogout();
    navigate('/student-login');
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Vazifalar', icon: FileCode },
    { id: 'classmates', label: 'Guruhim', icon: Users },
    { id: 'market', label: 'Coin Market', icon: ShoppingBag },
    { id: 'events', label: 'Tadbirlar', icon: Calendar },
    { id: 'exams', label: 'Imtihonlar', icon: Target },
    { id: 'rating', label: 'Reyting', icon: Trophy },
    { id: 'attendance', label: 'Davomat', icon: Calendar },
    { id: 'payments', label: "To'lovlar", icon: Wallet },
    { id: 'profile', label: 'Profil', icon: UserCircle },
  ];

  const handleTabChange = (tabId) => {
    if (tabId === 'profile') {
      navigate('/student/profile');
    } else {
      setActiveTab(tabId);
      navigate(`/student/${tabId}`);
=======
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentData');
    navigate('/student-login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'from-emerald-400 to-green-500';
      case 'DEBTOR': return 'from-red-400 to-rose-500';
      case 'STOPPED': return 'from-gray-400 to-gray-500';
      case 'LEAD': return 'from-amber-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ACTIVE': return 'Faol';
      case 'DEBTOR': return 'Qarzdor';
      case 'STOPPED': return 'To\'xtatilgan';
      case 'LEAD': return 'Nabor';
      default: return status;
    }
  };

  const getAttendanceIcon = (status) => {
    switch (status) {
      case 'PRESENT': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'ABSENT': return <XCircle className="text-red-500" size={18} />;
      case 'LATE': return <AlertCircle className="text-amber-500" size={18} />;
      default: return null;
    }
  };

  const getAttendanceLabel = (status) => {
    switch (status) {
      case 'PRESENT': return 'Keldi';
      case 'ABSENT': return 'Kelmadi';
      case 'LATE': return 'Kechikdi';
      default: return status;
    }
  };

  const getPaymentTypeLabel = (type) => {
    switch (type) {
      case 'CASH': return 'Naqd';
      case 'CARD': return 'Karta';
      case 'CLICK': return 'Click';
      case 'PAYME': return 'Payme';
      default: return type;
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    }
  };

  if (loading) {
    return (
<<<<<<< HEAD
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0f111a]">
        <div className="relative scale-75 md:scale-100">
          <div className="w-20 h-20 border-4 border-indigo-600/20 rounded-full"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-gray-400 font-black uppercase tracking-widest text-[10px] animate-pulse italic">InFast yuklanmoqda...</p>
=======
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Yuklanmoqda...</p>
        </div>
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
      </div>
    );
  }

<<<<<<< HEAD
  // Show error state if no student data
  if (!student && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0f111a]">
        <div className="text-center space-y-4">
          <p className="text-gray-500 dark:text-gray-400">Siz tizimga kirmadingiz</p>
          <button
            onClick={() => navigate('/student-login')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Login ga qaytish
=======
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Ma'lumotlar topilmadi</p>
          <button onClick={handleLogout} className="mt-4 btn-primary px-6 py-2 rounded-lg">
            Qayta kirish
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
          </button>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  return (
    <div className="min-h-screen bg-[#f1f4f9] dark:bg-[#0c0e14] flex flex-col md:flex-row h-screen overflow-hidden font-jakarta">

      {/* 🚀 DESKTOP SIDEBAR - Hidden on mobile */}
      {!fullScreen && (
        <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-[#161a26] border-r border-gray-100 dark:border-white/5 h-screen z-40 relative group/sidebar">
          <div className="p-10 flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-600 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white shadow-xl relative z-10 transform group-hover:rotate-12 transition-transform duration-500">
                <GraduationCap size={28} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black tracking-tighter dark:text-white block leading-none italic uppercase">InFast</span>
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1 block">Elite Academy</span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar pt-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-wider transition-all duration-300 relative group/btn ${isActive
                    ? 'bg-indigo-600 text-white shadow-[0_15px_30px_rgba(79,70,229,0.3)]'
                    : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-600/10'
                    }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 3 : 2} className={`transition-transform duration-500 ${isActive ? 'rotate-[-5deg] scale-110' : 'group-hover/btn:rotate-12'}`} />
                  {tab.label}
                  {isActive && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>}
                </button>
              );
            })}
          </nav>

          <div className="p-6 border-t border-gray-50 dark:border-white/5 space-y-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 py-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest"
            >
              <LogOut size={18} />
              Chiqish
            </button>
          </div>
        </aside>
      )}

      {/* 🏙 MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* 🌟 COMPACT HEADER - Mobile Optimized */}
        {!fullScreen && (
          <header className="h-16 md:h-24 bg-white/90 dark:bg-[#161a26]/90 backdrop-blur-2xl border-b border-gray-100 dark:border-white/5 px-4 md:px-12 flex items-center justify-between shrink-0 z-30">
            <div className="flex items-center gap-3 md:gap-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 md:hidden shrink-0">
                <GraduationCap size={22} />
              </div>
              <div>
                <h1 className="text-lg md:text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter truncate max-w-[120px] md:max-w-none">
                  {tabs.find(t => t.id === activeTab)?.label || 'Boshqaruv'}
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[8px] md:text-[10px] font-black text-indigo-500 uppercase tracking-widest">{data?.group?.name || 'Talaba'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-8">
              <button
                onClick={toggleDarkMode}
                className="p-2.5 md:p-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-indigo-600 transition-all border border-transparent dark:border-white/5"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <Link to="/student/profile" className="flex items-center gap-3 group/p">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black dark:text-white leading-none group-hover/p:text-indigo-600 transition-colors">{student?.full_name || data?.student?.full_name}</p>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1 italic">Student ID: 00{data?.student?._id?.slice(-3) || '01'}</p>
                </div>
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm md:text-xl shadow-lg relative transform group-hover/p:scale-105 transition-all">
                  <div className="absolute inset-0 bg-white/20 rounded-xl md:rounded-2xl opacity-0 group-hover/p:opacity-100 transition-opacity"></div>
                  {student?.full_name?.[0] || data?.student?.full_name?.[0] || 'S'}
                </div>
              </Link>
            </div>
          </header>
        )}

        <main className="flex-1 p-3 md:p-12 pb-32 md:pb-12 overflow-y-auto no-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-4 md:space-y-12">

            {activeTab === 'overview' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-4 md:space-y-12">

                {/* 🎯 WELCOME & BALANCE - Unified for mobile */}
                <div className="flex flex-col gap-4">
                  {/* Welcome Card - High Impact, Small footprint on mobile */}
                  <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3.5rem] bg-indigo-600 shadow-xl group p-6 md:p-14">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-950 opacity-95"></div>
                    <div className="absolute -top-10 -right-10 w-32 h-32 md:w-64 md:h-64 bg-white/5 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex items-center justify-between gap-6">
                      <div className="space-y-4 md:space-y-6">
                        <div className="flex items-center gap-2">
                          <Sparkles className="text-yellow-400" size={14} />
                          <span className="text-[8px] md:text-[10px] font-black text-indigo-100 uppercase tracking-widest italic opacity-60">Xush kelibsiz, Elite Talaba!</span>
                        </div>
                        <h2 className="text-2xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-tight drop-shadow-xl max-w-[200px] md:max-w-none">
                          Bilim - Eng katta Boylikdir!
                        </h2>
                        <div className="flex gap-2 pt-2 md:pt-4">
                          <button onClick={() => handleTabChange('tasks')} className="px-4 md:px-8 py-2.5 md:py-3.5 bg-white text-indigo-600 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[11px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                            Vazifalar
                          </button>
                          <button onClick={() => handleTabChange('rating')} className="px-4 md:px-8 py-2.5 md:py-3.5 bg-white/10 text-white backdrop-blur-md rounded-xl md:rounded-2xl font-black text-[9px] md:text-[11px] uppercase tracking-widest border border-white/10 transition-all">
                            Reyting
                          </button>
                        </div>
                      </div>
                      <div className="w-20 h-20 md:w-48 md:h-48 rounded-2xl md:rounded-[3.5rem] bg-white/10 backdrop-blur-3xl border border-white/10 flex items-center justify-center shrink-0 shadow-2xl rotate-6">
                        <GraduationCap className="text-white" size={40} md:size={100} strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>

                  {/* Coin Card - Big Bold Focal Point */}
                  <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3.5rem] bg-white dark:bg-[#1c2130] p-6 md:p-14 border border-gray-100 dark:border-white/5 shadow-xl group">
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-400/10 rounded-full blur-2xl"></div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1 md:gap-3">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-yellow-400/10 flex items-center justify-center text-yellow-500 mb-2">
                          <Coins size={28} md:size={36} strokeWidth={2.5} />
                        </div>
                        <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">SIZNING COINLARINGIZ</p>
                        <h3 className="text-4xl md:text-8xl font-black text-gray-900 dark:text-white italic tracking-tighter tabular-nums drop-shadow-sm leading-none">
                          {(data?.student?.coin_balance || 0).toLocaleString()}
                        </h3>
                      </div>
                      <button onClick={() => handleTabChange('market')} className="w-full md:w-auto px-8 md:px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] md:text-[12px] uppercase tracking-widest shadow-xl shadow-indigo-600/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                        MARKETGA O'TISH <ArrowUpRight size={18} />
                      </button>
=======
  const tabs = [
    { id: 'overview', label: 'Umumiy', icon: User },
    { id: 'payments', label: 'To\'lovlar', icon: Wallet },
    { id: 'attendance', label: 'Davomat', icon: Calendar },
    { id: 'tasks', label: 'Vazifalar', icon: FileCode },
    { id: 'rating', label: 'Reyting', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/20 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-lg">
                <GraduationCap className="text-white" size={24} />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 dark:text-white">
                  {data.student.full_name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {data.group.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getStatusColor(data.student.status)}`}>
                {getStatusLabel(data.student.status)}
              </span>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Chiqish</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="stats-card p-6 rounded-2xl shadow-lg card-hover animate-fade-in-up">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                <BookOpen className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Kurs</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{data.group.course || 'Noma\'lum'}</p>
              </div>
            </div>
          </div>

          <div className="stats-card p-6 rounded-2xl shadow-lg card-hover animate-fade-in-up delay-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Davomat</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{data.attendance.stats.percentage}%</p>
              </div>
            </div>
          </div>

          <div className="stats-card p-6 rounded-2xl shadow-lg card-hover animate-fade-in-up delay-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Wallet className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Jami to'langan</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{data.totalPaid.toLocaleString()} so'm</p>
              </div>
            </div>
          </div>

          <div className="stats-card p-6 rounded-2xl shadow-lg card-hover animate-fade-in-up delay-300">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                data.student.next_payment_date && new Date(data.student.next_payment_date) < new Date()
                  ? 'bg-gradient-to-br from-red-400 to-rose-500'
                  : 'bg-gradient-to-br from-cyan-400 to-blue-500'
              }`}>
                <Clock className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Keyingi to'lov</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {data.student.next_payment_date 
                    ? format(new Date(data.student.next_payment_date), 'dd.MM.yyyy')
                    : 'Belgilanmagan'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 animate-fade-in-up">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Guruh ma'lumotlari
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <BookOpen className="text-indigo-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Guruh nomi</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{data.group.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <Calendar className="text-emerald-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Dars kunlari</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {data.group.days?.join(', ') || 'Belgilanmagan'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <Clock className="text-amber-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Dars vaqti</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {data.group.time || 'Belgilanmagan'}
                      </p>
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
                    </div>
                  </div>
                </div>

<<<<<<< HEAD
                {/* 📊 STATS GRID - 2x2 on small mobile */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                  {[
                    { id: 'rating', label: "Bilim", val: `${data?.quizzes?.stats?.avgPercentage || 0}%`, icon: Brain, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
                    { id: 'payments', label: "To'lov", val: `${(data?.totalPaid || 0).toLocaleString()} UZS`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                    { id: 'attendance', label: "Dars", val: `${data?.attendance?.stats?.percentage || 0}%`, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-500/10' },
                    { id: 'classmates', label: 'Guruh', val: 'Faol', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10' }
                  ].map((stat, i) => (
                    <div
                      key={i}
                      onClick={() => handleTabChange(stat.id)}
                      className="bg-white dark:bg-[#161a26] p-5 md:p-10 rounded-3xl md:rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-md flex flex-col items-center justify-center text-center gap-3 md:gap-6 hover:-translate-y-1 transition-all"
                    >
                      <div className={`w-10 h-10 md:w-16 md:h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                        <stat.icon size={20} md:size={28} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-[7px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-xs md:text-2xl font-black text-gray-900 dark:text-white italic tracking-tighter truncate w-full max-w-[80px] md:max-w-none">{stat.val}</p>
=======
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <User className="text-purple-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Telefon</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{data.student.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <History className="text-cyan-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Qo'shilgan sana</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {data.student.joined_date 
                          ? format(new Date(data.student.joined_date), 'dd.MM.yyyy')
                          : 'Noma\'lum'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <CreditCard className="text-rose-500" size={20} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Oxirgi to'lov</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {data.student.last_payment_date 
                          ? format(new Date(data.student.last_payment_date), 'dd.MM.yyyy')
                          : 'Hali to\'lov qilinmagan'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance Summary */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Davomat statistikasi</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{data.attendance.stats.present}</p>
                    <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">Kelgan</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">{data.attendance.stats.absent}</p>
                    <p className="text-sm text-red-600/80 dark:text-red-400/80">Kelmagan</p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{data.attendance.stats.late}</p>
                    <p className="text-sm text-amber-600/80 dark:text-amber-400/80">Kechikkan</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                To'lovlar tarixi
              </h2>
              
              {data.payments.length === 0 ? (
                <div className="text-center py-12">
                  <Wallet className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                  <p className="text-gray-500 dark:text-gray-400">Hali to'lovlar mavjud emas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.payments.map((payment, index) => (
                    <div 
                      key={payment._id} 
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl table-row-hover"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                          <CreditCard className="text-white" size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {payment.amount.toLocaleString()} so'm
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {getPaymentTypeLabel(payment.payment_type)} • {format(new Date(payment.payment_date), 'dd.MM.yyyy')}
                          </p>
                        </div>
                      </div>
                      {payment.note && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
                          {payment.note}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Davomat tarixi
              </h2>
              
              {data.attendance.records.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                  <p className="text-gray-500 dark:text-gray-400">Hali davomat yozuvlari mavjud emas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.attendance.records.map((record, index) => (
                    <div 
                      key={record._id} 
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl table-row-hover"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          record.status === 'PRESENT' 
                            ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                            : record.status === 'LATE'
                            ? 'bg-amber-100 dark:bg-amber-900/30'
                            : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          {getAttendanceIcon(record.status)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {format(new Date(record.date), 'dd MMMM yyyy', { locale: uz })}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(record.date), 'EEEE', { locale: uz })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {record.score !== null && (
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                            record.score >= 70 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                            record.score >= 40 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {record.score} ball
                          </span>
                        )}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          record.status === 'PRESENT' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : record.status === 'LATE'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {getAttendanceLabel(record.status)}
                        </span>
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
                      </div>
                    </div>
                  ))}
                </div>
<<<<<<< HEAD

                {/* 👥 GROUP & INFO AREA */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-10">
                  {/* Compact Group Card */}
                  <div
                    onClick={() => handleTabChange('classmates')}
                    className="bg-gray-900 p-6 md:p-14 rounded-[2rem] md:rounded-[4rem] text-white shadow-xl relative overflow-hidden group cursor-pointer border border-white/5"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 md:w-[400px] md:h-[400px] bg-indigo-600/10 rounded-full blur-[80px] md:blur-[120px]"></div>
                    <div className="relative z-10 flex items-center justify-between gap-6">
                      <div className="space-y-4 md:space-y-8 flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/5">
                          <Zap size={10} className="text-indigo-400" />
                          <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest text-indigo-100 italic">GURUHINGIZ</span>
                        </div>
                        <h3 className="text-xl md:text-6xl font-black tracking-tighter italic uppercase truncate max-w-[150px] md:max-w-none">{data?.group?.name}</h3>
                        <div className="flex flex-wrap gap-2 md:gap-6">
                          <div className="flex items-center gap-2 md:gap-4 bg-white/5 px-3 md:px-6 py-2 md:py-4 rounded-xl md:rounded-3xl border border-white/5">
                            <Clock size={14} md:size={20} className="text-indigo-400" />
                            <span className="font-black text-[9px] md:text-sm uppercase tracking-wider">{data?.group?.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-16 h-16 md:w-32 md:h-32 bg-indigo-600 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center shadow-xl rotate-3 shrink-0">
                        <Users size={32} md:size={64} strokeWidth={1} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- OTHER TABS RENDER LOGIC --- */}
            {activeTab === 'events' && <StudentEvents />}
            {activeTab === 'tasks' && <StudentTasksView tasksData={data?.tasks} />}
            {activeTab === 'market' && <StudentMarket coinBalance={data?.student?.coin_balance} />}
            {activeTab === 'rating' && <StudentRatingView ratingData={data?.quizzes} />}
            {activeTab === 'classmates' && <StudentClassmatesView />}
            {activeTab === 'exams' && <StudentExamsView />}
          </div>
        </main>

        {/* 📱 MOBILE DOCK - Solid & Clickable */}
        {!fullScreen && (
          <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-50">
            <nav className="bg-[#161a26]/95 backdrop-blur-3xl border border-white/5 h-18 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex justify-around items-center px-4 py-2">
              {[
                { id: 'overview', icon: LayoutDashboard, label: 'Asosiy' },
                { id: 'tasks', icon: FileCode, label: 'Vazifa' },
                { id: 'market', icon: ShoppingBag, label: 'Market' },
                { id: 'rating', icon: Trophy, label: 'Reyting' },
                { id: 'events', icon: Calendar, label: 'Tadbirlar' },
                { id: 'profile', icon: UserCircle, label: 'Profil' }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${isActive ? 'text-indigo-400' : 'text-gray-500'}`}
                  >
                    <div className={`p-2.5 rounded-xl transition-all duration-300 ${isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/50 scale-110 -translate-y-3'
                      : 'hover:bg-white/5'}`}>
                      <Icon size={20} strokeWidth={isActive ? 3 : 2} />
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-widest transition-all ${isActive ? 'opacity-100' : 'opacity-40 scale-90'}`}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
      `}</style>
    </div>
  );
}
=======
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Vazifalar
                </h2>
                <Link
                  to="/student/tasks"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  <FileCode size={18} />
                  Barcha vazifalar
                  <ChevronRight size={18} />
                </Link>
              </div>
              
              <div className="text-center py-12 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl">
                <FileCode className="mx-auto text-orange-400 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Kod yozish vaqti!
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Vazifalarni bajarib, ball to'plang va reytingda yuqoriga ko'taring
                </p>
                <Link
                  to="/student/tasks"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Vazifalarni ko'rish
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'rating' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Reyting
                </h2>
                <Link
                  to="/student/rating"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  <Trophy size={18} />
                  To'liq reyting
                  <ChevronRight size={18} />
                </Link>
              </div>

              <div className="text-center py-12 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl">
                <Trophy className="mx-auto text-yellow-500 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Reytingni ko'ring!
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  O'quv markazdagi barcha o'quvchilar orasidagi o'rningizni bilib oling
                </p>
                <Link
                  to="/student/rating"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  <Star className="fill-white" size={18} />
                  Reytingni ko'rish
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
