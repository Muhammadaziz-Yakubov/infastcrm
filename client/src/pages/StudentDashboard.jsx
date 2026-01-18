import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  LogOut,
  User,
  BookOpen,
  TrendingUp,
  Moon,
  Sun,
  Wallet,
  FileCode,
  Trophy,
  ChevronRight,
  LayoutDashboard,
  UserCircle,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { darkMode, toggleDarkMode } = useTheme();
  const { student, studentLogout } = useAuth();
  const navigate = useNavigate();

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
      console.log('📊 Fetching dashboard...');

      // Double check token exists before making request
      const token = localStorage.getItem('studentToken');
      console.log('📊 Token check for dashboard:', !!token);

      if (!token) {
        console.log('🚫 No token found, logging out');
        handleLogout();
        return;
      }

      // Manual token attach if interceptor fails
      const response = await api.get('/student-auth/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('📊 Dashboard data received');
      setData(response.data);
    } catch (error) {
      console.error('❌ Error fetching dashboard:', error);
      if (error.response?.status === 401) {
        console.log('🚪 401 Unauthorized, logging out');
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
    { id: 'payments', label: 'To\'lovlar', icon: Wallet },
    { id: 'attendance', label: 'Davomat', icon: Calendar },
    { id: 'tasks', label: 'Vazifalar', icon: FileCode },
    { id: 'rating', label: 'Reyting', icon: Trophy },
    { id: 'profile', label: 'Profil', icon: UserCircle },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col md:flex-row">

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 sticky top-0 h-screen shadow-xl">
        <div className="p-6 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
            <GraduationCap size={26} />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Student</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'profile') {
                    console.log('StudentDashboard: Profile tab clicked');
                    const token = localStorage.getItem('studentToken');
                    const studentData = localStorage.getItem('studentData');
                    console.log('StudentDashboard: Profile check - token:', !!token, 'studentData:', !!studentData, 'context student:', !!student);

                    if (token && student) {
                      console.log('StudentDashboard: Navigating to profile');
                      navigate('/student/profile');
                    } else {
                      console.log('StudentDashboard: Missing auth, redirecting to login');
                      navigate('/student-login');
                    }
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all ${isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400'
                  }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all font-semibold"
          >
            <LogOut size={20} />
            Chiqish
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header */}
        <header className="h-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              InFast IT-Academy
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{data?.group?.name}</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleDarkMode} className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/student/profile" className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="text-right">
                <p className="text-sm font-bold dark:text-white leading-none">{student?.full_name || data?.student?.full_name}</p>
                <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold mt-0.5 uppercase">{student?.status || data?.student?.status}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/30 hover:scale-105 transition-all cursor-pointer overflow-hidden">
                {(student?.profile_image || data?.student?.profile_image) ? (
                  <img
                    src={student?.profile_image || data?.student?.profile_image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (student?.full_name?.[0] || data?.student?.full_name?.[0] || 'U').toUpperCase()
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
          {/* Mobile App Style - Welcome Header */}
          <div className="md:hidden mb-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white mb-3">
                <GraduationCap size={32} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Salom, {data?.student?.full_name?.split(' ')[0]}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Bugun ham yaxshi kun bo'lsin 🎉</p>
            </div>
          </div>

          {/* Stats Grid - Mobile App Style */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            {[
              { label: 'Davomat', val: `${data?.attendance?.stats?.percentage || 0}%`, icon: TrendingUp, color: 'from-emerald-500 to-teal-500', bgColor: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20' },
              { label: 'To\'lov', val: `${(data?.totalPaid || 0).toLocaleString()} so'm`, icon: Wallet, color: 'from-purple-500 to-pink-500', bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20' },
              { label: 'Keyingi to\'lov', val: data?.student?.next_payment_date ? format(new Date(data.student.next_payment_date), 'dd.MM') : '--', icon: Clock, color: 'from-amber-500 to-orange-500', bgColor: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20' },
              { label: 'Guruh', val: data?.group?.name || 'N/A', icon: Users, color: 'from-blue-500 to-cyan-500', bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20' }
            ].map((stat, i) => (
              <div key={i} className="group p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} className="text-white" />
                </div>
                <p className="text-[10px] md:text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold mb-1 md:mb-2">{stat.label}</p>
                <p className="text-lg md:text-xl font-black dark:text-white truncate">{stat.val}</p>
              </div>
            ))}
          </div>

          {/* Group Card - Mobile App Style */}
          <Link
            to="/student/classmates"
            className="block mb-6 md:mb-8 group"
          >
            <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 transition-all hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/10 bg-[length:20px_20px] opacity-20"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">{data?.group?.name}</h3>
                  <p className="text-orange-100 text-sm mb-3">{data?.group?.course}</p>
                  <div className="flex items-center gap-2 text-orange-100">
                    <Users size={16} />
                    <span className="text-sm">Guruhdoshlar bilan bog'lanish</span>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users size={32} className="text-white" />
                </div>
              </div>
            </div>
          </Link>

          {/* Mobile App Style Content Cards */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              {/* Quick Actions Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Link to="/student/tasks" className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-200 dark:border-gray-700 group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <FileCode size={24} className="text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Vazifalar</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Uy vazifalarini bajarish</p>
                </Link>

                <Link to="/student/rating" className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-200 dark:border-gray-700 group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Trophy size={24} className="text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Reyting</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Natijalarni ko'rish</p>
                </Link>
              </div>

              {/* Recent Activity Card */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl mb-6">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                      <TrendingUp size={22} className="text-white" />
                    </div>
                    So'nggi faoliyat
                  </h3>

                  {/* Attendance Stats */}
                  <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg shadow-orange-500/30 mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/10 bg-[length:20px_20px] opacity-20"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold">Davomat statistikasi</h4>
                        <TrendingUp size={20} />
                      </div>
                      <div className="flex gap-6">
                        <div className="text-center">
                          <p className="text-2xl font-black">{data?.attendance?.stats?.present || 0}</p>
                          <p className="text-xs text-orange-100 uppercase tracking-wider mt-1">Kelgan</p>
                        </div>
                        <div className="text-center text-orange-200">
                          <p className="text-2xl font-black">{data?.attendance?.stats?.absent || 0}</p>
                          <p className="text-xs uppercase tracking-wider mt-1">Yo'q</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-black">{data?.attendance?.stats?.percentage || 0}%</p>
                          <p className="text-xs text-orange-100 uppercase tracking-wider mt-1">Foiz</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Group Info */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3">Guruh ma'lumotlari</h4>
                    {[
                      { label: 'Guruh nomi', val: data?.group?.name, icon: Users },
                      { label: 'Dars vaqti', val: data?.group?.time, icon: Clock },
                      { label: 'Kunlar', val: data?.group?.days?.join(', '), icon: Calendar }
                    ].map((x, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                          <x.icon size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{x.label}</p>
                          <p className="font-bold text-gray-900 dark:text-white">{x.val || 'N/A'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Wallet size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold dark:text-white">To'lovlar</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">To'lovlar tarixi</p>
                </div>
              </div>

              <div className="space-y-4">
                {data?.payments?.length > 0 ? data.payments.map((p) => (
                  <div key={p._id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                          <Wallet size={22} className="text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-lg">{p.amount.toLocaleString()} so'm</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{format(new Date(p.payment_date), 'dd MMMM yyyy', { locale: uz })}</p>
                        </div>
                      </div>
                      <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full uppercase">
                        To'langan
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-lg">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Wallet size={32} className="text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">To'lovlar yo'q</h3>
                    <p className="text-gray-600 dark:text-gray-400">Hozircha to'lovlar tarixi mavjud emas</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                  <Calendar size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold dark:text-white">Davomat</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Darslarga qatnashish</p>
                </div>
              </div>

              <div className="space-y-4">
                {data?.attendance?.records?.length > 0 ? data.attendance.records.map((r) => (
                  <div key={r._id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${r.status === 'PRESENT'
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                            : 'bg-gradient-to-br from-red-500 to-pink-500'
                          }`}>
                          {r.status === 'PRESENT' ? <CheckCircle2 size={22} className="text-white" /> : <XCircle size={22} className="text-white" />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{format(new Date(r.date), 'dd.MM.yyyy')}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{format(new Date(r.date), 'EEEE', { locale: uz })}</p>
                        </div>
                      </div>
                      {r.score && (
                        <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-xl shadow-lg">
                          {r.score}
                        </div>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-lg">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <Calendar size={32} className="text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Davomat ma'lumotlari yo'q</h3>
                    <p className="text-gray-600 dark:text-gray-400">Hozircha davomat ma'lumotlari mavjud emas</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {(activeTab === 'tasks' || activeTab === 'rating') && (
            <div className="py-8 md:py-16 text-center space-y-6">
              <div className={`w-24 h-24 md:w-28 md:h-28 mx-auto rounded-3xl flex items-center justify-center shadow-2xl ${activeTab === 'tasks'
                  ? 'bg-gradient-to-br from-orange-500 to-amber-500'
                  : 'bg-gradient-to-br from-yellow-500 to-orange-500'
                }`}>
                {activeTab === 'tasks' ? <FileCode size={48} className="text-white" /> : <Trophy size={48} className="text-white" />}
              </div>
              <div className="max-w-sm mx-auto">
                <h3 className="text-xl md:text-2xl font-bold dark:text-white mb-2">
                  {activeTab === 'tasks' ? 'Vazifalar bo\'limi' : 'Reyting jadvali'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Ushbu ma'lumotlarni ko'rish uchun maxsus bo'limga o'ting</p>
              </div>
              <Link
                to={activeTab === 'tasks' ? "/student/tasks" : "/student/rating"}
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold transition-transform hover:scale-105 active:scale-95 shadow-xl ${activeTab === 'tasks'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-orange-500/30'
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-yellow-500/30'
                  }`}
              >
                O'tish <ChevronRight size={18} />
              </Link>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION - iOS Style */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 px-4 pb-safe z-50 shadow-2xl">
        <div className="flex justify-around items-center h-20">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'profile') {
                    console.log('StudentDashboard: Profile tab clicked');
                    const token = localStorage.getItem('studentToken');
                    const studentData = localStorage.getItem('studentData');
                    console.log('StudentDashboard: Profile check - token:', !!token, 'studentData:', !!studentData, 'context student:', !!student);

                    if (token && student) {
                      console.log('StudentDashboard: Navigating to profile');
                      navigate('/student/profile');
                    } else {
                      console.log('StudentDashboard: Missing auth, redirecting to login');
                      navigate('/student-login');
                    }
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={`flex flex-col items-center justify-center w-full h-full gap-1.5 transition-all duration-300 relative ${isActive
                    ? 'text-orange-600 dark:text-orange-400 scale-110'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive
                    ? 'bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30'
                    : ''
                  }`}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-semibold transition-all duration-300 ${isActive ? 'scale-110' : ''
                  }`}>{tab.label.split(' ')[0]}</span>
                {isActive && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-sm"></div>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
