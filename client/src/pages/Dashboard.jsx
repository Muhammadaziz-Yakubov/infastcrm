import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
<<<<<<< HEAD
import {
  Users,
  Calendar,
  AlertCircle,
  Wallet,
=======
import { 
  Users, 
  Calendar, 
  AlertCircle, 
  Wallet, 
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
  UserCheck,
  UserPlus,
  Clock,
  TrendingUp,
  ArrowRight,
<<<<<<< HEAD
  Sparkles,
  Bell,
  Target,
  BookOpen,
  CreditCard,
  ClipboardCheck,
  Trophy,
  FileText,
  Activity,
  DollarSign,
  GraduationCap,
  Users2,
  CalendarDays
=======
  Sparkles
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
} from 'lucide-react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboard();
<<<<<<< HEAD
  }, [user]);
=======
  }, [user, navigate]);
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Ma'lumotlar topilmadi</p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Faol guruhlar',
      value: data.activeGroupsCount,
      icon: Users,
      gradient: 'from-emerald-400 to-green-500',
      link: '/groups?status=ACTIVE'
    },
    {
      title: 'Nabor guruhlar',
      value: data.naborGroupsCount,
      icon: UserPlus,
      gradient: 'from-amber-400 to-orange-500',
      link: '/groups?status=NABOR'
    },
    {
      title: 'Faol o\'quvchilar',
      value: data.activeStudentsCount,
      icon: UserCheck,
      gradient: 'from-cyan-400 to-blue-500',
      link: '/students?status=ACTIVE'
    },
    {
      title: 'Oylik tushum',
      value: `${data.monthlyRevenue.toLocaleString()}`,
      subtitle: "so'm",
      icon: Wallet,
      gradient: 'from-indigo-400 to-purple-500',
      link: '/payments'
    },
    {
      title: 'Bugungi darslar',
      value: data.todaysGroups,
      icon: Calendar,
      gradient: 'from-pink-400 to-rose-500',
      link: '/attendance'
    },
    {
<<<<<<< HEAD
      title: 'To\'lov yaqinlashgan',
      value: data.paymentsDueSoonCount || 0,
      icon: Bell,
      gradient: 'from-yellow-400 to-amber-500',
      link: '/students?payment_filter=PAYMENT_DUE',
      alert: (data.paymentsDueSoonCount || 0) > 0
    },
    {
=======
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
      title: 'Qarzdorlar',
      value: data.debtorsCount,
      icon: AlertCircle,
      gradient: 'from-red-400 to-rose-500',
      link: '/students?status=DEBTOR',
      alert: data.debtorsCount > 0
    }
  ];

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <Sparkles className="text-white" size={24} />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {format(new Date(), "d MMMM yyyy, EEEE", { locale: uz })}
            </p>
          </div>
          <div className="flex items-center gap-3 px-6 py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl">
              <TrendingUp className="text-white" size={20} />
            </div>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Bu oy</span>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {data.monthlyRevenue.toLocaleString()} so'm
              </div>
            </div>
          </div>
=======
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
            <Sparkles className="text-amber-400" size={24} />
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            {format(new Date(), "d MMMM yyyy, EEEE", { locale: uz })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow">
          <TrendingUp className="text-emerald-500" size={20} />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Bu oy: <strong className="text-emerald-600 dark:text-emerald-400">{data.monthlyRevenue.toLocaleString()} so'm</strong>
          </span>
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
        </div>
      </div>

      {/* Stats Grid */}
<<<<<<< HEAD
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className={`group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${stat.alert ? 'ring-2 ring-red-200 dark:ring-red-800' : ''
              }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-90`}></div>
            <div className="relative p-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <stat.icon size={24} />
                </div>
                {stat.alert && (
                  <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">{stat.title}</p>
                <div className="text-4xl font-bold">{stat.value}</div>
                {stat.subtitle && (
                  <p className="text-white/70 text-sm">{stat.subtitle}</p>
                )}
              </div>
              <div className="flex items-center gap-2 mt-4 text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                <span>Batafsil</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Activity className="text-indigo-600 dark:text-indigo-400" />
          Tezkor amallar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/groups"
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700 transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl">
                <Users className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Guruhlar</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Boshqarish va tahrirlash</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-medium group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
              <span>Ochish</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/students"
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700 transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
                <GraduationCap className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">O'quvchilar</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Qo'shish va boshqarish</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-medium group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
              <span>Ochish</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/payments"
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700 transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                <CreditCard className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">To'lovlar</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Kuzatish va boshqarish</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-medium group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
              <span>Ochish</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/exams"
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700 transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <FileText className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Imtihonlar</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Yaratish va nazor qilish</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-medium group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
              <span>Ochish</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/events"
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700 transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                <CalendarDays className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Tadbirlar</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tashkil etish va boshqarish</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-medium group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
              <span>Ochish</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Clock className="text-indigo-600 dark:text-indigo-400" />
          So'nggi faoliyat
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center py-12">
            <Activity className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Tez orinda so'nggi faoliyat yo'q</h3>
            <p className="text-gray-500 dark:text-gray-400">Barcha amallar va yangiliklar bu yerda ko'rinadi</p>
          </div>
        </div>
      </div>
=======
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              to={stat.link}
              className={`stats-card p-6 rounded-2xl shadow-lg card-hover animate-fade-in-up ${stat.alert ? 'ring-2 ring-red-400 ring-offset-2 dark:ring-offset-gray-900' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                    {stat.subtitle && (
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                        {stat.subtitle}
                      </span>
                    )}
                  </p>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="text-white" size={28} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Payments Due */}
        {data.paymentsDueTodayList && data.paymentsDueTodayList.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-fade-in-up delay-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Clock className="text-white" size={20} />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Bugun to'lov qiladiganlar
                  </h2>
                </div>
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium">
                  {data.paymentsDueTodayList.length}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              {data.paymentsDueTodayList.map((student) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl table-row-hover"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {student.full_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {student.group_id?.name} • {student.phone}
                    </p>
                  </div>
                  <Link
                    to={`/payments?student_id=${student._id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
                  >
                    To'lov
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Debtors */}
        {data.debtorsList && data.debtorsList.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-fade-in-up delay-400">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center">
                    <AlertCircle className="text-white" size={20} />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Qarzdorlar
                  </h2>
                </div>
                <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
                  {data.debtorsList.length}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              {data.debtorsList.slice(0, 5).map((student) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-xl table-row-hover"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {student.full_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {student.group_id?.name} • {student.phone}
                    </p>
                    {student.next_payment_date && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                        To'lov: {format(new Date(student.next_payment_date), 'dd.MM.yyyy')}
                      </p>
                    )}
                  </div>
                  <Link
                    to={`/payments?student_id=${student._id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-400 to-rose-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
                  >
                    To'lov
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ))}
              {data.debtorsList.length > 5 && (
                <Link
                  to="/students?status=DEBTOR"
                  className="block text-center py-3 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Barchasini ko'rish ({data.debtorsList.length})
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Today's Groups */}
      {data.todaysGroupsList && data.todaysGroupsList.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-fade-in-up delay-500">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                <Calendar className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Bugungi darslar
              </h2>
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.todaysGroupsList.map((group) => (
              <Link
                key={group._id}
                to={`/attendance?group_id=${group._id}&date=${format(new Date(), 'yyyy-MM-dd')}`}
                className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
              >
                <p className="font-semibold text-gray-900 dark:text-white mb-1">
                  {group.name}
                </p>
                <p className="text-sm text-indigo-600 dark:text-indigo-400">
                  {group.time || 'Vaqt belgilanmagan'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    </div>
  );
}
