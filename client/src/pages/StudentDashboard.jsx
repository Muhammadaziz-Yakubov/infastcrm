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
  ShoppingBag
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleTabChange = (tabId) => {
    if (tabId === 'profile') {
      navigate('/student/profile');
    } else {
      setActiveTab(tabId);
      navigate(`/student/${tabId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row h-screen overflow-hidden font-jakarta">

      {/* DESKTOP SIDEBAR */}
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
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${isActive
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30'
                    : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10'
                    }`}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
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

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* Header */}
        {!fullScreen && (
          <header className="h-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border-b border-gray-100 dark:border-gray-700 px-6 md:px-10 flex items-center justify-between shrink-0 z-30">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
                  {tabs.find(t => t.id === activeTab)?.label || 'Boshqaruv Paneli'}
                </h1>
                <p className="text-[10px] md:text-xs font-bold text-indigo-500 uppercase tracking-widest">{data?.group?.name || 'O\'quvchi'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={toggleDarkMode} className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-400 hover:text-indigo-600 transition-colors">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <Link to="/student/profile" className="flex items-center gap-3 pl-4 md:border-l border-gray-100 dark:border-gray-700 transition-transform hover:scale-105">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black dark:text-white leading-none truncate max-w-[150px]">{student?.full_name || data?.student?.full_name}</p>
                  <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider mt-1">Online</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg">
                  {student?.full_name?.[0] || data?.student?.full_name?.[0] || 'S'}
                </div>
              </Link>
            </div>
          </header>
        )}

        <main className="flex-1 p-4 md:p-10 pb-32 md:pb-10 overflow-y-auto no-scrollbar bg-gray-50/50 dark:bg-gray-900/50">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                  {[
                    { id: 'rating', label: "Reyting", val: `${data?.quizzes?.stats?.avgPercentage || 0}%`, icon: Brain, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
                    { id: 'payments', label: "To'lov", val: `${(data?.totalPaid || 0).toLocaleString()}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
                    { id: 'attendance', label: "Davomati", val: `${data?.attendance?.stats?.percentage || 0}%`, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
                    { id: 'classmates', label: 'Guruh', val: 'Faol', icon: Users, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' }
                  ].map((stat, i) => (
                    <div
                      key={i}
                      onClick={() => handleTabChange(stat.id)}
                      className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/20 hover:-translate-y-1 transition-all cursor-pointer group"
                    >
                      <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                        <stat.icon size={24} />
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                      <p className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">{stat.val}</p>
                    </div>
                  ))}
                </div>

                {/* Group Card */}
                <div
                  onClick={() => handleTabChange('classmates')}
                  className="bg-gray-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group cursor-pointer"
                >
                  <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-6">
                      <span className="px-4 py-1.5 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-400 border border-white/5 italic">Sizning Guruhingiz</span>
                      <h3 className="text-3xl md:text-5xl font-black tracking-tighter italic uppercase">{data?.group?.name}</h3>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/5">
                          <Clock size={16} className="text-indigo-400" />
                          <span className="font-bold">{data?.group?.time}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/5">
                          <Calendar size={16} className="text-indigo-400" />
                          <span className="font-bold">{data?.group?.days?.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-20 h-20 md:w-32 md:h-32 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform">
                      <Users size={40} md:size={64} />
                    </div>
                  </div>
                </div>

                {/* Shortcuts Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: 'payments', label: "To'lovlar", icon: Wallet, color: 'text-emerald-500' },
                    { id: 'attendance', label: 'Davomat', icon: Calendar, color: 'text-indigo-500' },
                    { id: 'market', label: 'Market', icon: ShoppingBag, color: 'text-amber-500' },
                    { id: 'classmates', label: 'Guruh', icon: Users, color: 'text-purple-500' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleTabChange(s.id)}
                      className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-center gap-4"
                    >
                      <div className={`w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-900 ${s.color} flex items-center justify-center group-hover:scale-110 transition-all`}>
                        <s.icon size={24} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">{s.label}</span>
                    </button>
                  ))}

                  <button
                    onClick={() => handleTabChange('exams')}
                    className="col-span-2 md:col-span-4 bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 rounded-[2.5rem] text-white shadow-2xl hover:scale-[1.01] transition-all flex items-center justify-between group overflow-hidden relative"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                        <Target size={32} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xl font-black italic uppercase tracking-tighter">Imtihonlar Markazi</h4>
                        <p className="text-xs opacity-70 font-bold uppercase tracking-widest mt-1 italic">Bilimingizni sinash vaqti keldi</p>
                      </div>
                    </div>
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && <StudentTasksView setFullScreen={setFullScreen} />}
            {activeTab === 'market' && <StudentMarket />}
            {activeTab === 'exams' && <StudentExamsView setFullScreen={setFullScreen} />}
            {activeTab === 'rating' && <StudentRatingView />}
            {activeTab === 'classmates' && <StudentClassmatesView />}

            {activeTab === 'payments' && (
              <div className="space-y-8 animate-in slide-in-from-right duration-500">
                <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center">
                      <Wallet size={32} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black italic uppercase tracking-tighter dark:text-white">To'lovlar Tarixi</h2>
                      <p className="text-sm font-medium text-gray-400">Amalga oshirilgan to'lovlar jamlamasi</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4">
                  {data?.payments?.length > 0 ? data.payments.map((p) => (
                    <div key={p._id} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-emerald-500 transition-colors">
                          <Wallet size={24} />
                        </div>
                        <div>
                          <p className="text-xl font-black dark:text-white tabular-nums">{p.amount.toLocaleString()} so'm</p>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{format(new Date(p.payment_date), 'dd MMMM, yyyy', { locale: uz })}</p>
                        </div>
                      </div>
                      <span className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">To'langan</span>
                    </div>
                  )) : (
                    <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-700">
                      <Wallet size={48} className="mx-auto text-gray-200 mb-4" />
                      <p className="text-gray-400 font-black">Hali to'lovlar mavjud emas</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-8 animate-in slide-in-from-right duration-500">
                <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center">
                      <Calendar size={32} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black italic uppercase tracking-tighter dark:text-white">Davomat Jurnali</h2>
                      <p className="text-sm font-medium text-gray-400">Darslardagi ishtirok va baholar</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data?.attendance?.records?.length > 0 ? data.attendance.records.map((r) => (
                    <div key={r._id} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl group hover:border-indigo-500/30 transition-all">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${r.status === 'PRESENT' ? 'bg-emerald-500 text-white' :
                              r.status === 'LATE' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                            }`}>
                            {r.status === 'PRESENT' ? <CheckCircle2 size={28} /> :
                              r.status === 'LATE' ? <Clock size={28} /> : <XCircle size={28} />}
                          </div>
                          <div>
                            <p className="text-lg font-black dark:text-white uppercase italic">{format(new Date(r.date), 'dd MMMM, yyyy', { locale: uz })}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{format(new Date(r.date), 'EEEE', { locale: uz })}</p>
                          </div>
                        </div>
                        {r.score > 0 && (
                          <div className="w-14 h-14 rounded-full border-4 border-amber-500/20 flex items-center justify-center text-amber-600 font-black italic text-lg shadow-xl bg-amber-50 dark:bg-amber-900/10">
                            {r.score}
                          </div>
                        )}
                      </div>
                      {r.note && (
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border-l-4 border-indigo-500 italic text-sm text-indigo-700 dark:text-indigo-300">
                          💬 Ustoz: "{r.note}"
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="col-span-full py-20 text-center bg-white dark:bg-gray-800 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-700">
                      <Calendar size={48} className="mx-auto text-gray-200 mb-4" />
                      <p className="text-gray-400 font-black">Davomat ma'lumotlari hozircha yo'q</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* MOBILE NAVIGATION - Floating Dock */}
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
                    onClick={() => handleTabChange(tab.id)}
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
                      <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-indigo-600 animate-pulse"></div>
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
