import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  ShoppingBag
} from 'lucide-react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

// Sub-components for Integrated View
import StudentTasksView from '../components/StudentTasksView';
import StudentExamsView from '../components/StudentExamsView';
import StudentRatingView from '../components/StudentRatingView';
import StudentClassmatesView from '../components/StudentClassmatesView';
import StudentMarket from './StudentMarket';

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { darkMode, toggleDarkMode } = useTheme();
  const { student, studentLogout } = useAuth();
  const navigate = useNavigate();
  const [fullScreen, setFullScreen] = useState(false);

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
      const token = localStorage.getItem('studentToken');
      if (!token) {
        handleLogout();
        return;
      }

      const response = await api.get('/student-auth/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
    } catch (error) {
      console.error('❌ Error fetching dashboard:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    studentLogout();
    navigate('/student-login');
  };

  const tabs = [
    { id: 'overview', label: 'Umumiy', icon: LayoutDashboard },
    { id: 'tasks', label: 'Vazifalar', icon: FileCode },
    { id: 'classmates', label: 'Guruh', icon: Users },
    { id: 'market', label: 'Market', icon: ShoppingBag },
    { id: 'exams', label: 'Imtihonlar', icon: Target },
    { id: 'rating', label: 'Reyting', icon: Trophy },
    { id: 'attendance', label: 'Davomat', icon: Calendar },
    { id: 'payments', label: "To'lovlar", icon: Wallet },
    { id: 'profile', label: 'Profil', icon: UserCircle },
  ];


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const visibleTabs = tabs.filter(t => !t.hidden);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row h-screen overflow-hidden font-jakarta">

      {/* DESKTOP SIDEBAR - Premium Look */}
      {!fullScreen && (
        <aside className="hidden md:flex flex-col w-80 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 h-screen shadow-2xl z-40 relative">
          <div className="p-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
              <GraduationCap size={28} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight dark:text-white block leading-none">InFast</span>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">IT-Academy</span>
            </div>
          </div>

          <nav className="flex-1 px-6 space-y-2 overflow-y-auto pt-4">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'profile') navigate('/student/profile');
                    else setActiveTab(tab.id);
                  }}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${isActive
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30'
                    : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10'
                    }`}
                >
                  <div className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600'}`}>
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="p-6 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all font-bold"
            >
              <LogOut size={22} />
              Chiqish
            </button>
          </div>
        </aside>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* Top Header - Glassmorphism */}
        {!fullScreen && (
          <header className="h-22 bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border-b border-gray-100 dark:border-gray-700 px-6 md:px-10 flex items-center justify-between shrink-0 z-30">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('overview')}
                className="md:hidden w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600"
              >
                <LayoutDashboard size={20} />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
                  {activeTab === 'overview' ? 'Dashboard' : visibleTabs.find(t => t.id === activeTab)?.label || 'Batafsil'}
                </h1>
                <p className="text-[10px] md:text-xs font-bold text-indigo-500 uppercase tracking-widest">{data?.group?.name || 'InFast Talabasi'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="hidden md:flex p-3 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-400 hover:text-indigo-600 transition-colors">
                <Bell size={20} />
              </button>
              <button onClick={toggleDarkMode} className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-400 hover:text-indigo-600 transition-colors">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <Link to="/student/profile" className="flex items-center gap-3 pl-4 md:border-l border-gray-100 dark:border-gray-700 transition-transform hover:scale-105">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black dark:text-white leading-none truncate max-w-[150px]">{student?.full_name || data?.student?.full_name}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">Online</p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-0.5 shadow-lg shadow-indigo-500/20">
                  <div className="w-full h-full rounded-[0.9rem] bg-white dark:bg-gray-800 overflow-hidden flex items-center justify-center">
                    {(student?.profile_image || data?.student?.profile_image) ? (
                      <img
                        src={student?.profile_image || data?.student?.profile_image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-black text-indigo-600">{(student?.full_name?.[0] || data?.student?.full_name?.[0] || 'U').toUpperCase()}</span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </header>
        )}

        {/* Scrollable Dashboard Content */}
        <main className="flex-1 p-4 md:p-10 pb-32 md:pb-10 overflow-y-auto overflow-x-hidden no-scrollbar bg-gray-50/50 dark:bg-gray-900/50">

          <div className="max-w-7xl mx-auto animate-fade-in">
            {activeTab === 'overview' && (
              <div className="space-y-6 md:space-y-10">
                {/* Welcome Mobile */}
                <div className="md:hidden bg-indigo-600 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-2xl shadow-indigo-600/30">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                  <h2 className="text-xl font-black mb-1">Salom, {data?.student?.full_name?.split(' ')[0]}! 👋</h2>
                  <p className="text-indigo-100 text-[10px] font-medium uppercase tracking-wider">Bugun yangi marralarni zabt etish vaqti.</p>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                  {[
                    { id: 'rating', label: "Reyting", val: `${data?.quizzes?.stats?.avgPercentage || 0}%`, icon: Brain, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
                    { id: 'payments', label: "To'lov", val: `${(data?.totalPaid || 0).toLocaleString()}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
                    { id: 'attendance', label: "Davomati", val: `${data?.attendance?.stats?.percentage || 0}%`, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
                    { id: 'classmates', label: 'Guruh', val: 'Faol', icon: Users, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' }
                  ].map((stat, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveTab(stat.id)}
                      className="bg-white dark:bg-gray-800 p-4 md:p-8 rounded-[1.8rem] md:rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/20 dark:shadow-none hover:-translate-y-1 transition-all group cursor-pointer"
                    >
                      <div className={`w-10 h-10 md:w-14 md:h-14 ${stat.bg} ${stat.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                        <stat.icon size={20} md:size={28} />
                      </div>
                      <p className="text-[8px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 md:mb-2">{stat.label}</p>
                      <p className="text-sm md:text-2xl font-black text-gray-900 dark:text-white truncate">{stat.val}</p>
                    </div>
                  ))}
                </div>

                {/* Group Card - Clickable to Classmates */}
                <div
                  onClick={() => setActiveTab('classmates')}
                  className="bg-gray-900 dark:bg-indigo-950 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 text-white shadow-2xl relative overflow-hidden group cursor-pointer hover:scale-[1.01] active:scale-[0.98] transition-all"
                >
                  {/* Background Glow */}
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:bg-indigo-600/30 transition-colors"></div>

                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10">
                    <div className="space-y-4 md:space-y-6 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-indigo-400 border border-white/5">Guruh</span>
                        {data?.group?.status && <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">{data.group.status}</span>}
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-5xl font-black mb-2 md:mb-3 tracking-tighter">{data?.group?.name}</h3>
                        <p className="text-gray-400 text-sm md:text-xl font-medium max-w-xl">{data?.group?.course || "IT bo'yicha zamonaviy bilimlar markazi"}</p>
                      </div>
                      <div className="flex flex-wrap gap-3 md:gap-4 pt-2">
                        <div className="flex items-center gap-2 md:gap-3 bg-white/5 px-4 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl border border-white/5">
                          <Clock size={16} className="text-indigo-500" />
                          <span className="font-bold text-xs md:text-base">{data?.group?.time}</span>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 bg-white/5 px-4 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl border border-white/5">
                          <Calendar size={16} className="text-indigo-500" />
                          <span className="font-bold text-xs md:text-base">{data?.group?.days?.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 md:gap-6 shrink-0 mt-4 md:mt-0">
                      <div className="w-16 h-16 md:w-32 md:h-32 rounded-[1.5rem] md:rounded-[2.5rem] bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-600/50 group-hover:rotate-12 transition-transform">
                        <Users size={32} md:size={64} className="text-white" />
                      </div>
                      <button className="flex items-center gap-2 text-indigo-400 font-black uppercase tracking-widest text-[9px] md:text-xs group-hover:gap-4 transition-all">
                        Guruhdoshlar <ArrowRight size={14} md:size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Interactive Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {/* Recent Tasks Preview */}
                  <div className="bg-white dark:bg-gray-800 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden relative">
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                      <h3 className="text-lg md:text-xl font-black dark:text-white tracking-tight">So{"'"}nggi Vazifalar</h3>
                      <button onClick={() => setActiveTab('tasks')} className="text-indigo-600 text-[9px] font-black uppercase tracking-wider hover:underline">Hammasi</button>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                      {(data?.recentTasks || []).length > 0 ? data.recentTasks.map((t, idx) => (
                        <div key={idx} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-gray-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors group cursor-pointer" onClick={() => setActiveTab('tasks')}>
                          <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-indigo-600 shadow-sm border border-gray-100 dark:border-gray-700">
                            <FileCode size={18} md:size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 dark:text-white truncate text-xs md:text-sm">{t.title}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter mt-1">{t.deadline ? format(new Date(t.deadline), 'dd MMM') : "Muddatsiz"}</p>
                          </div>
                          <ChevronRight size={14} md:size={16} className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
                        </div>
                      )) : (
                        <p className="text-center py-6 md:py-10 text-gray-400 text-xs italic">Yangi vazifalar yo{"'"}q</p>
                      )}
                    </div>
                  </div>

                  {/* Quick Shortcuts */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button onClick={() => setActiveTab('payments')} className="bg-white dark:bg-gray-800 rounded-[2rem] p-4 md:p-6 border border-gray-100 dark:border-gray-700 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center justify-center text-center gap-2 md:gap-3 group">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <Wallet size={20} md:size={24} />
                      </div>
                      <p className="font-black text-[10px] md:text-xs dark:text-white uppercase tracking-widest">To'lovlar</p>
                    </button>
                    <button onClick={() => setActiveTab('attendance')} className="bg-white dark:bg-gray-800 rounded-[2rem] p-4 md:p-6 border border-gray-100 dark:border-gray-700 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center justify-center text-center gap-2 md:gap-3 group">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <Calendar size={20} md:size={24} />
                      </div>
                      <p className="font-black text-[10px] md:text-xs dark:text-white uppercase tracking-widest">Davomat</p>
                    </button>
                    <button onClick={() => setActiveTab('market')} className="bg-white dark:bg-gray-800 rounded-[2rem] p-4 md:p-6 border border-gray-100 dark:border-gray-700 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center justify-center text-center gap-2 md:gap-3 group">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <ShoppingBag size={20} md:size={24} />
                      </div>
                      <p className="font-black text-[10px] md:text-xs dark:text-white uppercase tracking-widest">Market</p>
                    </button>
                    <button onClick={() => setActiveTab('classmates')} className="bg-white dark:bg-gray-800 rounded-[2rem] p-4 md:p-6 border border-gray-100 dark:border-gray-700 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center justify-center text-center gap-2 md:gap-3 group">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <Users size={20} md:size={24} />
                      </div>
                      <p className="font-black text-[10px] md:text-xs dark:text-white uppercase tracking-widest">Guruh</p>
                    </button>

                    <button onClick={() => setActiveTab('exams')} className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-white shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center justify-center text-center gap-3 md:gap-4 col-span-2 md:col-span-4 group">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Target size={24} md:size={32} />
                      </div>
                      <div>
                        <p className="font-black text-sm md:text-lg italic uppercase tracking-tighter">Imtihonlar Markazi</p>
                        <p className="text-[8px] md:text-[10px] opacity-70 font-bold uppercase tracking-widest italic mt-1">Bilimingizni sinash vaqti</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && <StudentTasksView setFullScreen={setFullScreen} />}
            {activeTab === 'market' && <StudentMarket />}
            {activeTab === 'exams' && <StudentExamsView setFullScreen={setFullScreen} />}
            {activeTab === 'rating' && <StudentRatingView />}
            {activeTab === 'classmates' && <StudentClassmatesView />}

            {activeTab === 'payments' && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                    <Wallet size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black dark:text-white">To{"'"}lovlar Tarixi</h2>
                    <p className="text-sm text-gray-500 font-medium">Barcha amalga oshirilgan to{"'"}lovlar jamlamasi</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {data?.payments?.length > 0 ? data.payments.map((p) => (
                    <div key={p._id} className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-lg border border-gray-50 dark:border-gray-700/50 hover:border-emerald-500/30 transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-400 group-hover:text-emerald-500 transition-colors flex items-center justify-center font-black">
                          <Wallet size={22} />
                        </div>
                        <div>
                          <p className="text-xl font-black text-gray-900 dark:text-white">{p.amount.toLocaleString()} so{"'"}m</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar size={12} className="text-gray-300" />
                            <p className="text-xs font-bold text-gray-400">{format(new Date(p.payment_date), 'dd MMMM, yyyy', { locale: uz })}</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-5 py-2.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                        To'langan
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700">
                      <Wallet size={48} className="mx-auto text-gray-200 mb-4" />
                      <p className="text-gray-400 font-bold text-lg">Hozircha to{"'"}lovlar tarixi mavjud emas</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-20">
                <div className="flex items-center gap-6 bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-gray-100 dark:border-gray-700 shadow-2xl shadow-indigo-500/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-[2rem] bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center shadow-inner">
                    <Calendar size={32} md:size={40} />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black dark:text-white tracking-tight uppercase italic">Davomat Jurnali</h2>
                    <p className="text-sm md:text-lg text-gray-500 font-medium">O'quv jarayonidagi ishtirok va baholar tahlili</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {data?.attendance?.records?.length > 0 ? data.attendance.records.map((r) => (
                    <div key={r._id} className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-6 md:p-8 shadow-xl border border-gray-50 dark:border-gray-700/50 flex flex-col gap-4 group hover:border-indigo-500/30 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${r.status === 'PRESENT' ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
                            r.status === 'LATE' ? 'bg-amber-500 text-white shadow-amber-500/20' :
                              'bg-rose-500 text-white shadow-rose-500/20'
                            }`}>
                            {r.status === 'PRESENT' ? <CheckCircle2 size={24} md:size={28} /> :
                              r.status === 'LATE' ? <Clock size={24} md:size={28} /> :
                                <XCircle size={24} md:size={28} />}
                          </div>
                          <div>
                            <p className="text-lg md:text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
                              {format(new Date(r.date), 'dd MMMM, yyyy', { locale: uz })}
                            </p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">{format(new Date(r.date), 'EEEE', { locale: uz })}</p>
                          </div>
                        </div>

                        {(r.score > 0) && (
                          <div className="flex flex-col items-center">
                            <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest mb-1 italic">Dars Balli</span>
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-amber-500/20 flex items-center justify-center font-black text-amber-600 dark:text-amber-400 text-lg md:text-xl italic shadow-2xl shadow-amber-500/10 bg-amber-50 dark:bg-amber-900/10">
                              {r.score}
                            </div>
                          </div>
                        )}
                      </div>

                      {r.note && (
                        <div className="mt-2 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border-l-4 border-indigo-500">
                          <p className="text-xs md:text-sm font-bold text-indigo-700 dark:text-indigo-300 italic">
                            💬 Ustoz izohi: "{r.note}"
                          </p>
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="col-span-full text-center py-20 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700">
                      <Calendar size={48} className="mx-auto text-gray-200 mb-4" />
                      <p className="text-gray-400 font-bold text-lg">Davomat ma'lumotlari hali kiritilmagan</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* MOBILE BOTTOM NAVIGATION - Elite Floating Dock */}
        {!fullScreen && (
          <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-lg z-50">
            <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 h-20 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex justify-around items-center px-4">
              {[
                { id: 'overview', icon: LayoutDashboard, label: 'Asosiy' },
                { id: 'tasks', icon: FileCode, label: 'Vazifalar' },
                { id: 'rating', icon: Trophy, label: 'Reyting' },
                { id: 'profile', icon: UserCircle, label: 'Profil' }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (tab.id === 'profile') navigate('/student/profile');
                      else setActiveTab(tab.id);
                    }}
                    className={`flex flex-col items-center justify-center flex-1 h-full gap-1.5 transition-all relative ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}
                  >
                    <div className={`p-2.5 rounded-2xl transition-all duration-500 ${isActive
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/40 scale-110 -translate-y-1'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                      <Icon size={22} strokeWidth={isActive ? 3 : 2} />
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-[0.15em] transition-all ${isActive ? 'opacity-100 scale-100' : 'opacity-60 scale-95'}`}>
                      {tab.label}
                    </span>
                    {isActive && (
                      <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-indigo-600"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
