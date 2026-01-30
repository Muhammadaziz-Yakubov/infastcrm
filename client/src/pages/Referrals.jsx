import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trash2, 
  Eye, 
  Filter,
  Search,
  Plus,
  Award,
  Target,
  BarChart3,
  Moon,
  Sun,
  ChevronDown,
  MoreVertical,
  Edit,
  Play,
  Check,
  X,
  AlertCircle,
  Star,
  Phone,
  Mail,
  MapPin,
  DollarSign
} from 'lucide-react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';

const Referrals = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [referrals, setReferrals] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const [formData, setFormData] = useState({
    referrer_id: '',
    friend_id: '',
    notes: ''
  });

  useEffect(() => {
    fetchReferrals();
    fetchStudents();
    fetchStatistics();
  }, [filterStatus, searchTerm]);

  const fetchReferrals = async () => {
    try {
      let url = '/referrals/all';
      const params = new URLSearchParams();
      
      if (filterStatus) params.append('status', filterStatus);
      if (searchTerm) params.append('search', searchTerm);
      
      if (params.toString()) url += '?' + params.toString();
      
      const response = await api.get(url);
      setReferrals(response.data.referrals);
      setLoading(false);
    } catch (error) {
      console.error('Referrallarni yuklashda xatolik:', error);
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Talabalarni yuklashda xatolik:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/referrals/statistics');
      setStatistics(response.data);
    } catch (error) {
      console.error('Statistikani yuklashda xatolik:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/referrals/create', formData);
      
      setShowAddModal(false);
      setFormData({ referrer_id: '', friend_id: '', notes: '' });
      fetchReferrals();
      fetchStatistics();
      alert('Referral muvaffaqiyatli yaratildi!');
    } catch (error) {
      alert(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleStart = async (id) => {
    if (!confirm('Taklif jarayonini boshlaysizmi?')) return;
    
    try {
      await api.post(`/referrals/start/${id}`);
      fetchReferrals();
      fetchStatistics();
      alert('Taklif jarayoni boshlandi!');
    } catch (error) {
      alert(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleComplete = async (id) => {
    if (!confirm('Taklif muvaffaqiyatli tugatilsin va 1000 coin berilsinmi?')) return;
    
    try {
      await api.post(`/referrals/complete/${id}`);
      fetchReferrals();
      fetchStatistics();
      alert('Taklif tugatildi va 1000 coin berildi!');
    } catch (error) {
      alert(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Rad etish sababini kiriting:');
    if (!reason) return;
    
    try {
      await api.post(`/referrals/reject/${id}`, { reason });
      fetchReferrals();
      fetchStatistics();
      alert('Taklif rad etildi!');
    } catch (error) {
      alert(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleApprove = async (id) => {
    if (!confirm('Referralni tasdiqlaysizmi?')) return;
    
    try {
      await api.post(`/referrals/approve/${id}`);
      fetchReferrals();
      fetchStatistics();
      alert('Referral tasdiqlandi!');
    } catch (error) {
      alert(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleCancel = async (id) => {
    const reason = prompt('Bekor qilish sababini kiriting:');
    if (!reason) return;
    
    try {
      await api.post(`/referrals/cancel/${id}`, { reason });
      fetchReferrals();
      fetchStatistics();
      alert('Referral bekor qilindi!');
    } catch (error) {
      alert(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu referrallarni butunlay o\'chirmoqchimisiz? Bu amal ortga qaytarilmaydi!')) return;
    
    try {
      await api.delete(`/referrals/${id}`);
      fetchReferrals();
      fetchStatistics();
      alert('Referral muvaffaqiyatli o\'chirildi!');
    } catch (error) {
      alert(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: {
        bg: darkMode ? 'bg-yellow-900/30 text-yellow-300 border-yellow-700' : 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        label: 'Boshlandi'
      },
      ACTIVE: {
        bg: darkMode ? 'bg-blue-900/30 text-blue-300 border-blue-700' : 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Play,
        label: 'Jarayonda'
      },
      COMPLETED: {
        bg: darkMode ? 'bg-green-900/30 text-green-300 border-green-700' : 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        label: 'Tayyor'
      },
      CANCELLED: {
        bg: darkMode ? 'bg-red-900/30 text-red-300 border-red-700' : 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
        label: 'Rad etildi'
      }
    };
    
    const badge = badges[status] || badges.PENDING;
    const Icon = badge.icon;
    
    return (
      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${badge.bg}`}>
        <Icon size={12} />
        {badge.label}
      </div>
    );
  };

  const filteredReferrals = referrals.filter(referral => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      referral.referrer_id?.full_name?.toLowerCase().includes(searchLower) ||
      referral.referrer_id?.phone?.includes(searchLower) ||
      referral.friend_id?.full_name?.toLowerCase().includes(searchLower) ||
      referral.friend_id?.phone?.includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Users className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Takliflar
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
              >
                <Filter size={20} />
              </button>
              
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Yangi Referral
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Jami Takliflar</p>
                  <p className={`text-3xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {statistics.totalReferrals}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                  <Users className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Boshlanganlar</p>
                  <p className={`text-3xl font-bold mt-1 text-yellow-500`}>
                    {statistics.pendingReferrals}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'}`}>
                  <Clock className={`w-6 h-6 text-yellow-500`} />
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Jarayonda</p>
                  <p className={`text-3xl font-bold mt-1 text-blue-500`}>
                    {statistics.activeReferrals}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                  <Play className={`w-6 h-6 text-blue-500`} />
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tayyor</p>
                  <p className={`text-3xl font-bold mt-1 text-green-500`}>
                    {statistics.completedReferrals}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
                  <CheckCircle className={`w-6 h-6 text-green-500`} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 mb-6`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Status bo'yicha filtr
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">Hammasi</option>
                  <option value="PENDING">Boshlanganlar</option>
                  <option value="ACTIVE">Jarayonda</option>
                  <option value="COMPLETED">Tayyor</option>
                  <option value="CANCELLED">Rad etilgan</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Qidiruv
                </label>
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ism yoki telefon raqami..."
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Referrals Table */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? 'bg-gray-900' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Taklif qilgan
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Do'st
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Status
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Chegirma
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Sana
                  </th>
                  <th className={`px-6 py-4 text-right text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredReferrals.map((referral) => (
                  <tr key={referral._id} className={`hover:${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} transition-colors`}>
                    <td className="px-6 py-4">
                      <div>
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {referral.referrer_id?.full_name}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-1`}>
                          <Phone size={14} />
                          {referral.referrer_id?.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {referral.friend_id?.full_name}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-1`}>
                          <Phone size={14} />
                          {referral.friend_id?.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(referral.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {referral.discount_percent}%
                      </div>
                      {referral.discount_active && (
                        <span className="text-xs text-green-500">Aktiv</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(referral.createdAt).toLocaleDateString('uz-UZ')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedReferral(referral);
                            setShowDetailsModal(true);
                          }}
                          className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
                        >
                          <Eye size={16} />
                        </button>

                        {referral.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleStart(referral._id)}
                              className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            >
                              <Play size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(referral._id)}
                              className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        
                        {referral.status === 'ACTIVE' && (
                          <>
                            <button
                              onClick={() => handleComplete(referral._id)}
                              className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(referral._id)}
                              className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        
                        {(referral.status === 'COMPLETED' || referral.status === 'CANCELLED') && (
                          <button
                            onClick={() => handleDelete(referral._id)}
                            className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Referrers */}
        {statistics?.topReferrers && statistics.topReferrers.length > 0 && (
          <div className={`mt-8 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Top Referrerlar
              </h2>
            </div>
            <div className="space-y-4">
              {statistics.topReferrers.map((referrer, index) => (
                <div key={referrer._id} className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${index === 0 ? 'bg-yellow-500 text-white' : index === 1 ? 'bg-gray-400 text-white' : index === 2 ? 'bg-orange-600 text-white' : darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                      #{index + 1}
                    </div>
                    <div>
                      <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {referrer.full_name}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-1`}>
                        <Phone size={14} />
                        {referrer.phone}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {referrer.referralCount} referral
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {referrer.totalDiscountGiven?.toLocaleString()} so'm chegirma
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border p-8 w-full max-w-md`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Yangi Referral Qo'shish
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Taklif qilgan talaba
                </label>
                <select
                  value={formData.referrer_id}
                  onChange={(e) => setFormData({ ...formData, referrer_id: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  required
                >
                  <option value="">Tanlang</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.full_name} - {student.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Do'st (yangi talaba)
                </label>
                <select
                  value={formData.friend_id}
                  onChange={(e) => setFormData({ ...formData, friend_id: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  required
                >
                  <option value="">Tanlang</option>
                  {students
                    .filter(s => s._id !== formData.referrer_id)
                    .map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.full_name} - {student.phone}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Izoh (ixtiyoriy)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  rows="3"
                  placeholder="Qo'shimcha izoh..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Saqlash
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedReferral && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl border p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Referral Tafsilotlari
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Taklif qilgan</label>
                  <div className={`mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedReferral.referrer_id?.full_name}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-1 mt-1`}>
                    <Phone size={14} />
                    {selectedReferral.referrer_id?.phone}
                  </div>
                </div>

                <div>
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Do'st</label>
                  <div className={`mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedReferral.friend_id?.full_name}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-1 mt-1`}>
                    <Phone size={14} />
                    {selectedReferral.friend_id?.phone}
                  </div>
                </div>
              </div>

              <div>
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</label>
                <div className="mt-1">
                  {getStatusBadge(selectedReferral.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Chegirma foizi</label>
                  <div className={`mt-1 text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedReferral.discount_percent}%
                  </div>
                </div>

                <div>
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Yaratilgan sana</label>
                  <div className={`mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {new Date(selectedReferral.createdAt).toLocaleDateString('uz-UZ', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              {selectedReferral.notes && (
                <div>
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Izohlar</label>
                  <div className={`mt-1 p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                    {selectedReferral.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Referrals;
