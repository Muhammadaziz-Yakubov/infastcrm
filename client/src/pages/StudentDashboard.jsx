import { useState, useEffect } from 'react';
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

export default function StudentDashboard() {
  const { tab: urlTab } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { darkMode, toggleDarkMode } = useTheme();
  const { student, studentLogout } = useAuth();
  const navigate = useNavigate();
  const [fullScreen, setFullScreen] = useState(false);

  // Sync activeTab with URL param if present
  useEffect(() => {
    if (urlTab && ['overview', 'tasks', 'classmates', 'market', 'exams', 'rating', 'attendance', 'payments'].includes(urlTab)) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  useEffect(() => {
    const token = localStorage.getItem('studentToken');
    if (!token) {
      navigate('/student-login');
      return;
    }
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/student-auth/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('❌ Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    studentLogout();
    navigate('/student-login');
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Vazifalar', icon: FileCode },
    { id: 'classmates', label: 'Guruhim', icon: Users },
    { id: 'market', label: 'Coin Market', icon: ShoppingBag },
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
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0f111a]">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-600/20 rounded-full"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse italic">InFast yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faff] dark:bg-[#0f111a] flex flex-col md:flex-row h-screen overflow-hidden font-jakarta">

      {/* 🚀 MODERN SIDEBAR */}
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
            <div className="bg-indigo-50/50 dark:bg-white/5 p-5 rounded-3xl group/support relative overflow-hidden">
              <div className="absolute bottom-0 right-0 opacity-10 -rotate-12 transform group-hover:rotate-0 transition-transform duration-700">
                <Star size={64} fill="currentColor" />
              </div>
              <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Muvaffaqiyat kaliti</p>
              <p className="text-[11px] text-gray-500 font-bold leading-relaxed">Bilim olishdan to'xtamang, orzular sari olg'a!</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 py-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest border border-transparent hover:border-red-500/20"
            >
              <LogOut size={18} />
              Chiqish
            </button>
          </div>
        </aside>
      )}

      {/* 🏙 MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* 🌟 PREMIUM HEADER */}
        {!fullScreen && (
          <header className="h-24 bg-white/80 dark:bg-[#161a26]/80 backdrop-blur-3xl border-b border-gray-100 dark:border-white/5 px-6 md:px-12 flex items-center justify-between shrink-0 z-30">
            <div className="flex items-center gap-6">
              <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl md:hidden" onClick={() => navigate('/student')}>
                <LayoutDashboard size={20} className="text-indigo-600" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">
                  {tabs.find(t => t.id === activeTab)?.label || 'Boshqaruv'}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{data?.group?.name || 'Talaba'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-8">
              {/* Notification & Theme Toggle */}
              <div className="flex items-center gap-2 md:gap-3 bg-gray-100 dark:bg-white/5 p-1.5 rounded-2xl border border-gray-200/50 dark:border-white/5">
                <button onClick={toggleDarkMode} className="p-3 rounded-xl bg-white dark:bg-[#161a26] text-gray-500 hover:text-indigo-600 transition-all shadow-sm">
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <div className="relative group">
                  <button className="p-3 rounded-xl hover:bg-white dark:hover:bg-[#161a26] text-gray-400 hover:text-indigo-600 transition-all">
                    <Bell size={18} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-[#161a26]"></span>
                  </button>
                </div>
              </div>

              {/* Profile Shortcut */}
              <Link to="/student/profile" className="flex items-center gap-4 group/p">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black dark:text-white leading-none group-hover/p:text-indigo-600 transition-colors">{student?.full_name || data?.student?.full_name}</p>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">{data?.student?.student_id || 'UID: 0001'}</p>
                </div>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl blur-sm opacity-20 group-hover/p:opacity-50 transition-opacity"></div>
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-xl relative z-10 transform group-hover/p:scale-105 transition-transform">
                    {student?.full_name?.[0] || data?.student?.full_name?.[0] || 'S'}
                  </div>
                </div>
              </Link>
            </div>
          </header>
        )}

        <main className="flex-1 p-4 md:p-12 pb-32 md:pb-12 overflow-y-auto no-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <div className="space-y-12 animate-in fade-in duration-700">

                {/* 🎯 WELCOME CARD & BALANCE */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
                  <div className="lg:col-span-2 relative overflow-hidden rounded-[3.5rem] bg-indigo-600 shadow-2xl group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 opacity-95"></div>
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>

                    {/* Decorative elements */}
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute top-1/2 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[60px]"></div>

                    <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <Sparkles className="text-yellow-400 animate-spin-slow" size={20} />
                          <span className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.4em] italic">Xush kelibsiz, Elite Talaba!</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-tight drop-shadow-2xl">
                          Bilim - Kuchdir!
                        </h2>
                        <p className="text-white/60 font-bold max-w-md text-sm md:text-base leading-relaxed">
                          O'quv jarayonida faol bo'ling va eng yuqori natijalarga erishishda davom eting. Sizning yoshingiz {data?.student?.age || 0}.
                        </p>
                        <div className="flex gap-4 pt-4">
                          <button onClick={() => handleTabChange('tasks')} className="px-8 py-3.5 bg-white text-indigo-600 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
                            Vazifalarni boshlash
                          </button>
                          <button onClick={() => handleTabChange('rating')} className="px-8 py-3.5 bg-black/20 text-white backdrop-blur-md rounded-2xl font-black text-[11px] uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all">
                            Reytingni ko'rish
                          </button>
                        </div>
                      </div>
                      <div className="w-32 h-32 md:w-48 md:h-48 rounded-[3.5rem] bg-white/10 backdrop-blur-3xl border border-white/10 flex items-center justify-center group-hover:rotate-12 transition-transform duration-700 shadow-3xl">
                        <GraduationCap className="text-white" size={80} md:size={120} strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[3.5rem] bg-white dark:bg-[#161a26] p-10 border border-gray-100 dark:border-white/5 shadow-2xl flex flex-col justify-between group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl group-hover:bg-yellow-400/10 transition-colors"></div>
                    <div className="space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-yellow-400/10 flex items-center justify-center text-yellow-500 shadow-inner group-hover:scale-110 transition-transform">
                        <Coins size={36} strokeWidth={2.5} />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 dark:text-white/40 uppercase tracking-[0.3em] italic leading-none">Joriy Balans</p>
                      <h3 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white italic tracking-tighter tabular-nums drop-shadow-sm">
                        {(data?.student?.coin_balance || 0).toLocaleString()}
                      </h3>
                    </div>
                    <button onClick={() => handleTabChange('market')} className="w-full py-5 bg-gray-50 dark:bg-white/5 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-gray-500 hover:text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-3 mt-10">
                      Marketga o'tish <ArrowUpRight size={18} />
                    </button>
                  </div>
                </div>

                {/* 📊 CORE STATS GRID */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                  {[
                    { id: 'rating', label: "Bilim Darajasi", val: `${data?.quizzes?.stats?.avgPercentage || 0}%`, icon: Brain, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-600/10' },
                    { id: 'payments', label: "To'langan Summa", val: `${(data?.totalPaid || 0).toLocaleString()} UZS`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-600/10' },
                    { id: 'attendance', label: "Dars Ishtiroki", val: `${data?.attendance?.stats?.percentage || 0}%`, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-600/10' },
                    { id: 'classmates', label: 'Guruh Holati', val: 'Faol', icon: Users, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-600/10' }
                  ].map((stat, i) => (
                    <div
                      key={i}
                      onClick={() => handleTabChange(stat.id)}
                      className="bg-white dark:bg-[#161a26] p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-full -mr-8 -mt-8"></div>
                      <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl relative z-10 group-hover:scale-110 transition-transform`}>
                        <stat.icon size={28} strokeWidth={2.5} />
                      </div>
                      <div className="relative z-10">
                        <p className="text-[10px] font-black text-gray-400 dark:text-white/40 uppercase tracking-[0.25em] mb-2 italic leading-none">{stat.label}</p>
                        <p className="text-xl md:text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter">{stat.val}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 👥 GROUP & INFO AREA */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Modern Group Card */}
                  <div
                    onClick={() => handleTabChange('classmates')}
                    className="bg-gray-950 dark:bg-[#0c0e14] rounded-[3.5rem] p-10 md:p-14 text-white shadow-3xl shadow-indigo-500/10 relative overflow-hidden group cursor-pointer border border-white/5"
                  >
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full -mr-48 -mt-48 blur-[120px] group-hover:bg-indigo-600/20 transition-all duration-700"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
                      <div className="space-y-8 flex-1">
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-white/5 border border-white/5">
                          <Zap size={14} className="text-indigo-400" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100 italic">Sizning Guruhingiz</span>
                        </div>
                        <h3 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase drop-shadow-2xl">{data?.group?.name}</h3>
                        <div className="flex flex-wrap gap-6 pt-4">
                          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/5 group-hover:bg-white/10 transition-all">
                            <Clock size={20} className="text-indigo-400" />
                            <span className="font-black text-sm uppercase tracking-wider">{data?.group?.time}</span>
                          </div>
                          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/5 group-hover:bg-white/10 transition-all">
                            <Calendar size={20} className="text-indigo-400" />
                            <span className="font-black text-[10px] md:text-sm uppercase tracking-widest">{data?.group?.days?.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-indigo-600 blur-3xl opacity-20 animate-pulse"></div>
                        <div className="w-24 h-24 md:w-40 md:h-40 bg-indigo-600 rounded-[3rem] flex items-center justify-center shadow-3xl relative z-10 group-hover:rotate-12 transition-all duration-700">
                          <Users size={48} md:size={80} strokeWidth={1} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Shortcuts with Glass Design */}
                  <div className="grid grid-cols-2 gap-6 md:gap-8">
                    {[
                      { id: 'tasks', label: "Vazifalar", count: data?.tasks?.pendingCount || 0, icon: FileCode, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
                      { id: 'exams', label: "Imtihonlar", count: data?.exams?.stats?.count || 0, icon: Target, color: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/20' },
                      { id: 'market', label: "Coin Market", count: 'VIP', icon: ShoppingBag, color: 'from-amber-400 to-orange-600', shadow: 'shadow-amber-500/20' },
                      { id: 'rating', label: "Leaderboard", count: '#1', icon: Trophy, color: 'from-purple-500 to-indigo-700', shadow: 'shadow-purple-500/20' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleTabChange(s.id)}
                        className={`bg-white dark:bg-[#161a26] p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl hover:-translate-y-2 transition-all duration-500 group flex flex-col items-center gap-6 relative overflow-hidden`}
                      >
                        <div className={`w-16 h-16 rounded-[1.8rem] bg-gradient-to-br ${s.color} text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                          <s.icon size={32} strokeWidth={2} />
                        </div>
                        <div className="text-center space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 dark:text-white/40 italic">{s.label}</p>
                          <p className="text-xl md:text-2xl font-black text-gray-900 dark:text-white italic tracking-tighter">{s.count}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 🏆 BOTTOM CTA */}
                <button
                  onClick={() => handleTabChange('exams')}
                  className="w-full bg-gradient-to-r from-gray-900 to-indigo-950 p-10 md:p-16 rounded-[4rem] text-white shadow-3xl hover:scale-[1.01] transition-all flex flex-col md:flex-row items-center justify-between group overflow-hidden relative border border-white/5"
                >
                  <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                  <div className="flex flex-col md:flex-row items-center gap-10 relative z-10 text-center md:text-left">
                    <div className="w-20 h-20 md:w-28 md:h-28 bg-white/5 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                      <Target size={40} md:size={56} className="text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter drop-shadow-2xl">Imtihonlar Markazi</h4>
                      <p className="text-sm md:text-lg opacity-40 font-bold uppercase tracking-[0.3em] mt-3 italic">Haqiqiy bilimingizni sinovdan o'tkazing</p>
                    </div>
                  </div>
                  <div className="mt-10 md:mt-0 w-16 h-16 md:w-24 md:h-24 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl group-hover:translate-x-4 transition-all relative z-10">
                    <ArrowRight size={32} md:size={48} strokeWidth={3} className="text-white" />
                  </div>
                </button>
              </div>
            )}

            {activeTab === 'tasks' && <StudentTasksView setFullScreen={setFullScreen} />}
            {activeTab === 'market' && <StudentMarket />}
            {activeTab === 'exams' && <StudentExamsView setFullScreen={setFullScreen} />}
            {activeTab === 'rating' && <StudentRatingView />}
            {activeTab === 'classmates' && <StudentClassmatesView />}

            {/* Other tabs remain similar but with updated styling for container */}
            {activeTab === 'payments' && (
              <div className="space-y-10 animate-in slide-in-from-right duration-700">
                <div className="bg-white dark:bg-[#161a26] p-12 md:p-16 rounded-[4rem] border border-gray-100 dark:border-white/5 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
                  <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                    <div className="w-20 h-20 md:w-28 md:h-28 bg-emerald-100 dark:bg-emerald-600/10 text-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform">
                      <Wallet size={40} md:size={56} />
                    </div>
                    <div className="text-center md:text-left space-y-2">
                      <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter dark:text-white drop-shadow-sm">To'lovlar Markazi</h2>
                      <p className="text-sm md:text-lg font-bold text-gray-400 uppercase tracking-widest italic opacity-60">Sizning moliyaviy muvaffaqiyatingiz</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-6">
                  {data?.payments?.length > 0 ? data.payments.map((p) => (
                    <div key={p._id} className="bg-white dark:bg-[#161a26] p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-xl flex flex-col md:flex-row items-center justify-between group hover:border-emerald-500/30 transition-all duration-500">
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-[#0c0e14] rounded-3xl flex items-center justify-center text-gray-400 group-hover:text-emerald-500 group-hover:scale-110 transition-all shadow-inner">
                          <Wallet size={32} />
                        </div>
                        <div>
                          <p className="text-2xl md:text-4xl font-black dark:text-white tabular-nums italic tracking-tighter">{p.amount.toLocaleString()} UZS</p>
                          <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mt-2 italic">{format(new Date(p.payment_date), 'dd MMMM, yyyy', { locale: uz })}</p>
                        </div>
                      </div>
                      <div className="mt-6 md:mt-0 flex items-center gap-6">
                        <span className="px-6 py-2.5 bg-emerald-100 dark:bg-emerald-600/10 text-emerald-600 rounded-full text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] italic border border-emerald-500/20 shadow-xl shadow-emerald-500/5">CONFIRMED</span>
                        <div className="w-12 h-12 bg-gray-50 dark:bg-[#0c0e14] rounded-2xl flex items-center justify-center text-gray-300 dark:text-gray-700">
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="py-40 text-center bg-white dark:bg-[#161a26] rounded-[4rem] border-4 border-dashed border-gray-100 dark:border-white/5">
                      <Wallet size={80} className="mx-auto text-gray-200 dark:text-white/5 mb-8 animate-bounce-slow" strokeWidth={1} />
                      <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-xs">Hali to'lovlar tarixingiz bo'sh</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-10 animate-in slide-in-from-right duration-700">
                <div className="bg-white dark:bg-[#161a26] p-12 md:p-16 rounded-[4rem] border border-gray-100 dark:border-white/5 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
                  <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                    <div className="w-20 h-20 md:w-28 md:h-28 bg-indigo-100 dark:bg-indigo-600/10 text-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform">
                      <Calendar size={40} md:size={56} />
                    </div>
                    <div className="text-center md:text-left space-y-2">
                      <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter dark:text-white drop-shadow-sm">Davomat Jurnali</h2>
                      <p className="text-sm md:text-lg font-bold text-gray-400 uppercase tracking-widest italic opacity-60">Sizning darslardagi intizomingiz</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                  {data?.attendance?.records?.length > 0 ? data.attendance.records.map((r) => (
                    <div key={r._id} className="bg-white dark:bg-[#161a26] p-10 rounded-[3.5rem] border border-gray-100 dark:border-white/5 shadow-xl group hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden">
                      <div className="flex items-center justify-between mb-10 relative z-10">
                        <div className="flex items-center gap-6">
                          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[2rem] flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform ${r.status === 'PRESENT' ? 'bg-emerald-500 text-white shadow-emerald-500/30' :
                            r.status === 'LATE' ? 'bg-amber-500 text-white shadow-amber-500/30' : 'bg-rose-500 text-white shadow-rose-500/30'
                            }`}>
                            {r.status === 'PRESENT' ? <CheckCircle2 size={32} md:size={48} strokeWidth={2.5} /> :
                              r.status === 'LATE' ? <Clock size={32} md:size={48} strokeWidth={2.5} /> : <XCircle size={32} md:size={48} strokeWidth={2.5} />}
                          </div>
                          <div>
                            <p className="text-lg md:text-2xl font-black dark:text-white uppercase italic tracking-tighter leading-tight">{format(new Date(r.date), 'dd MMMM, yyyy', { locale: uz })}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                              <p className="text-[10px] md:text-[12px] font-black text-gray-400 uppercase tracking-[0.2em]">{format(new Date(r.date), 'EEEE', { locale: uz })}</p>
                            </div>
                          </div>
                        </div>
                        {r.score > 0 && (
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-amber-500/20 flex items-center justify-center text-amber-500 font-black italic text-xl md:text-2xl shadow-2xl bg-amber-50/50 dark:bg-[#0c0e14]">
                            {r.score}
                          </div>
                        )}
                      </div>
                      {r.note && (
                        <div className="p-6 bg-indigo-50/50 dark:bg-[#0c0e14] rounded-3xl border-l-4 border-indigo-500 italic text-sm md:text-base text-indigo-700 dark:text-indigo-300 relative z-10 group-hover:scale-[1.02] transition-transform">
                          💬 <span className="font-bold opacity-60 mr-2 uppercase text-[10px] tracking-widest italic">Ustoz izohi:</span> "{r.note}"
                        </div>
                      )}

                      {/* Background Decoration */}
                      <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all"></div>
                    </div>
                  )) : (
                    <div className="col-span-full py-40 text-center bg-white dark:bg-[#161a26] rounded-[4rem] border-4 border-dashed border-gray-100 dark:border-white/5">
                      <Calendar size={80} className="mx-auto text-gray-200 dark:text-white/5 mb-8 animate-bounce-slow" strokeWidth={1} />
                      <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-xs">Davomat ma'lumotlari mavjud emas</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* 📱 MOBILE NAVIGATION - ELITE DOCK */}
        {!fullScreen && (
          <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 w-[94%] max-w-sm z-50">
            <nav className="bg-[#161a26]/90 dark:bg-[#0c0e14]/90 backdrop-blur-2xl border border-white/10 dark:border-white/5 h-22 rounded-[3rem] shadow-[0_25px_60px_rgba(0,0,0,0.4)] flex justify-around items-center px-6 py-2">
              {[
                { id: 'overview', icon: LayoutDashboard, label: 'Bosh' },
                { id: 'tasks', icon: FileCode, label: 'Vazifa' },
                { id: 'market', icon: ShoppingBag, label: 'Market' },
                { id: 'rating', icon: Trophy, label: 'Reyting' },
                { id: 'profile', icon: UserCircle, label: 'Men' }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex flex-col items-center justify-center flex-1 h-full gap-2 transition-all relative ${isActive ? 'text-indigo-400' : 'text-gray-500'}`}
                  >
                    <div className={`p-3.5 rounded-2xl transition-all duration-700 relative overflow-hidden ${isActive
                      ? 'bg-indigo-600 text-white shadow-[0_10px_25px_rgba(79,70,229,0.5)] scale-110 -translate-y-4'
                      : 'hover:bg-white/5'}`}>
                      <Icon size={24} strokeWidth={isActive ? 3 : 2} />
                      {isActive && <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-[0.15em] transition-all italic leading-none ${isActive ? 'opacity-100 mt-[-8px]' : 'opacity-40 scale-90'}`}>
                      {tab.label}
                    </span>
                    {isActive && (
                      <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-slow { animation: bounce-slow 4s infinite ease-in-out; }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
