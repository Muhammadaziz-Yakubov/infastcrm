import { useState, useEffect } from 'react';
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
  ChevronRight,
  LayoutDashboard,
  ShieldCheck
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
  const { studentLogout } = useAuth();
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
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0F172A]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex">
      
      {/* 1. DESKTOP SIDEBAR (Faqat kompyuter uchun) */}
      <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-[#1E293B] border-r border-slate-200 dark:border-slate-800 sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight dark:text-white">Student UI</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all font-medium"
          >
            <LogOut size={20} />
            Chiqish
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 md:h-20 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-sm md:text-lg font-bold truncate dark:text-white">
              Salom, {data.student.full_name.split(' ')[0]} 👋
            </h1>
            <p className="text-[10px] md:text-xs text-slate-500">{data.group.name}</p>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={toggleDarkMode} className="p-2 md:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right">
                <p className="text-sm font-bold dark:text-white leading-none">{data.student.full_name}</p>
                <p className="text-[10px] text-emerald-500 font-bold mt-1 uppercase tracking-tighter">{data.student.status}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                {data.student.full_name[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {[
              { label: 'Kurs', val: data.group.course || 'Kurs nomi', icon: BookOpen, col: 'blue' },
              { label: 'Davomat', val: `${data.attendance.stats.percentage}%`, icon: TrendingUp, col: 'emerald' },
              { label: 'To\'lov', val: `${data.totalPaid.toLocaleString()} so'm`, icon: Wallet, col: 'purple' },
              { label: 'Keyingi to\'lov', val: data.student.next_payment_date ? format(new Date(data.student.next_payment_date), 'dd.MM') : '--', icon: Clock, col: 'amber' }
            ].map((stat, i) => (
              <div key={i} className="p-4 md:p-6 rounded-[2rem] bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className={`w-10 h-10 rounded-xl bg-${stat.col}-500/10 text-${stat.col}-500 flex items-center justify-center mb-4`}>
                  <stat.icon size={22} />
                </div>
                <p className="text-[10px] md:text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">{stat.label}</p>
                <p className="text-sm md:text-xl font-black dark:text-white truncate">{stat.val}</p>
              </div>
            ))}
          </div>

          {/* Dynamic Content Card */}
          <div className="bg-white dark:bg-[#1E293B] rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 md:p-10">
              
              {activeTab === 'overview' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white"><BookOpen size={20} className="text-indigo-500"/> Guruh Ma'lumotlari</h3>
                         <div className="space-y-3">
                           {[
                             { label: 'Nomi', val: data.group.name },
                             { label: 'Dars vaqti', val: data.group.time },
                             { label: 'Kunlar', val: data.group.days?.join(', ') }
                           ].map((x, i) => (
                             <div key={i} className="flex justify-between p-4 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-100 dark:border-slate-800">
                               <span className="text-slate-500 text-sm">{x.label}</span>
                               <span className="font-bold text-sm dark:text-white">{x.val}</span>
                             </div>
                           ))}
                         </div>
                      </div>
                      <div className="space-y-4">
                         <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white"><User size={20} className="text-indigo-500"/> Shaxsiy Ma'lumotlar</h3>
                         <div className="space-y-3">
                            <div className="flex justify-between p-4 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-100 dark:border-slate-800">
                               <span className="text-slate-500 text-sm">Telefon</span>
                               <span className="font-bold text-sm dark:text-white">{data.student.phone}</span>
                            </div>
                            <div className="flex justify-between p-4 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-100 dark:border-slate-800">
                               <span className="text-slate-500 text-sm">Status</span>
                               <span className="text-xs font-black uppercase text-emerald-500">{data.student.status}</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Attendance Stat Card */}
                   <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-500/20">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                          <p className="text-indigo-100 text-sm font-medium">Umumiy davomat</p>
                          <h4 className="text-4xl font-black mt-1">Sizda yaxshi natija!</h4>
                        </div>
                        <div className="flex gap-8">
                           <div className="text-center">
                             <p className="text-2xl font-black">{data.attendance.stats.present}</p>
                             <p className="text-[10px] text-indigo-100 uppercase tracking-tighter">Kelgan</p>
                           </div>
                           <div className="text-center text-rose-300">
                             <p className="text-2xl font-black">{data.attendance.stats.absent}</p>
                             <p className="text-[10px] uppercase tracking-tighter">Yo'q</p>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h2 className="text-xl font-bold mb-6 dark:text-white">To'lovlar tarixi</h2>
                  <div className="space-y-3">
                    {data.payments.map((p) => (
                      <div key={p._id} className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-[#0F172A] rounded-2xl border border-slate-100 dark:border-slate-800 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><Wallet size={22} /></div>
                          <div>
                            <p className="font-bold dark:text-white">{p.amount.toLocaleString()} so'm</p>
                            <p className="text-xs text-slate-500">{format(new Date(p.payment_date), 'dd MMMM yyyy', {locale: uz})}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-black px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-500 rounded-full uppercase">To'langan</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'attendance' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h2 className="text-xl font-bold mb-6 dark:text-white">Darslarga qatnashish</h2>
                  <div className="grid gap-3">
                    {data.attendance.records.map((r) => (
                      <div key={r._id} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-[#0F172A] rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${r.status === 'PRESENT' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {r.status === 'PRESENT' ? <CheckCircle2 size={20}/> : <XCircle size={20}/>}
                          </div>
                          <div>
                            <p className="font-bold dark:text-white">{format(new Date(r.date), 'dd.MM.yyyy')}</p>
                            <p className="text-xs text-slate-500 capitalize">{format(new Date(r.date), 'EEEE', {locale: uz})}</p>
                          </div>
                        </div>
                        {r.score && <div className="text-sm font-black px-4 py-1.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20">{r.score} ball</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(activeTab === 'tasks' || activeTab === 'rating') && (
                <div className="py-20 text-center space-y-6">
                  <div className={`w-24 h-24 mx-auto rounded-[2.5rem] flex items-center justify-center ${activeTab === 'tasks' ? 'bg-orange-500/10 text-orange-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {activeTab === 'tasks' ? <FileCode size={48}/> : <Trophy size={48}/>}
                  </div>
                  <div className="max-w-xs mx-auto">
                    <h3 className="text-xl font-bold dark:text-white">{activeTab === 'tasks' ? 'Vazifalar bo\'limi' : 'Reyting jadvali'}</h3>
                    <p className="text-sm text-slate-500 mt-2">Ushbu ma'lumotlarni ko'rish uchun maxsus bo'limga o'ting</p>
                  </div>
                  <Link 
                    to={activeTab === 'tasks' ? "/student/tasks" : "/student/rating"}
                    className={`inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-white font-bold transition-transform hover:scale-105 active:scale-95 ${activeTab === 'tasks' ? 'bg-orange-500' : 'bg-yellow-500'}`}
                  >
                    O'tish <ChevronRight size={18}/>
                  </Link>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION (Faqat telefon uchun) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}
              >
                <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}