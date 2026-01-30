import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Trophy, 
  Star, 
  Medal,
  Crown,
  Users,
  TrendingUp,
  Search,
  Plus,
  Zap,
  Shield,
  Award,
  Moon,
  Sun,
  Filter,
  ChevronDown,
  MoreVertical,
  Edit,
  Trash2,
  Power,
  X
} from 'lucide-react';
import api from '../utils/api';

export default function Rating() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPowerModal, setShowAddPowerModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const [powerForm, setPowerForm] = useState({
    student_id: '',
    power: 0,
    reason: ''
  });

  useEffect(() => {
    fetchRatings();
    fetchStudents();
  }, []);

  const fetchRatings = async () => {
    try {
      const response = await api.get('/public/ratings');
      setRatings(response.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleAddPower = async (e) => {
    e.preventDefault();
    try {
      await api.post('/rating/add-power', powerForm);
      
      setShowAddPowerModal(false);
      setPowerForm({ student_id: '', power: 0, reason: '' });
      fetchRatings();
      alert('Power muvaffaqiyatli qo\'shildi!');
    } catch (error) {
      alert(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-emerald-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-red-500';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="text-yellow-400" size={28} />;
    if (rank === 2) return <Medal className="text-gray-400" size={24} />;
    if (rank === 3) return <Medal className="text-amber-600" size={24} />;
    return <span className="text-gray-400 font-bold">{rank}</span>;
  };

  const getRankStyle = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 shadow-lg shadow-yellow-500/30';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 shadow-lg shadow-gray-400/30';
    if (rank === 3) return 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30';
    return 'bg-gray-100 dark:bg-gray-700';
  };

  const getTop3 = () => {
    return ratings.slice(0, 3);
  };

  const getRestRatings = () => {
    return ratings.slice(3);
  };

  const filteredRatings = ratings.filter(rating => 
    rating.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rating.group_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const top3 = getTop3();
  const restRatings = getRestRatings();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Trophy className="text-white" size={24} />
              </div>
              <h1 className="font-bold text-gray-900 dark:text-white">Reyting</h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Filter size={20} className="text-gray-600 dark:text-gray-300" />
              </button>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
              </button>

              <button
                onClick={() => setShowAddPowerModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Zap size={20} />
                Power Qo'shish
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Qidiruv
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ism yoki guruh nomi..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 Podium */}
        {top3.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* 2nd Place */}
            <div className="flex flex-col items-center mt-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center mb-3 shadow-lg shadow-gray-400/30">
                <Medal className="text-white" size={28} />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate max-w-[150px]">
                  {top3[1]?.full_name}
                </h3>
                <p className="text-sm text-gray-500 truncate max-w-[150px]">
                  {top3[1]?.group_name}
                </p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="text-gray-400 fill-gray-400" size={16} />
                  <span className="font-bold text-gray-600 dark:text-gray-300">
                    {Math.round(top3[1]?.percentage)}
                  </span>
                </div>
              </div>
              <div className="w-full h-24 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-lg mt-4"></div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center animate-fade-in-up">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center mb-3 shadow-lg shadow-yellow-500/30">
                  <Crown className="text-white" size={36} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Star className="text-white fill-white" size={16} />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate max-w-[150px]">
                  {top3[0]?.full_name}
                </h3>
                <p className="text-sm text-gray-500 truncate max-w-[150px]">
                  {top3[0]?.group_name}
                </p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="text-yellow-500 fill-yellow-500" size={18} />
                  <span className="font-bold text-xl text-yellow-600">
                    {Math.round(top3[0]?.percentage)}
                  </span>
                </div>
              </div>
              <div className="w-full h-32 bg-gradient-to-b from-yellow-400 to-amber-500 rounded-t-lg mt-4"></div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center mt-12 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/30">
                <Medal className="text-white" size={24} />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate max-w-[150px]">
                  {top3[2]?.full_name}
                </h3>
                <p className="text-sm text-gray-500 truncate max-w-[150px]">
                  {top3[2]?.group_name}
                </p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="text-amber-500 fill-amber-500" size={16} />
                  <span className="font-bold text-gray-600 dark:text-gray-300">
                    {Math.round(top3[2]?.percentage)}
                  </span>
                </div>
              </div>
              <div className="w-full h-16 bg-gradient-to-b from-amber-500 to-orange-600 rounded-t-lg mt-4"></div>
            </div>
          </div>
        )}

        {/* Rest of Ratings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    O'rin
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    O'quvchi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Guruh
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ball
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Foiz
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRatings.map((rating, index) => (
                  <tr key={rating.student_id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getRankStyle(rating.rank)}`}>
                        {getRankIcon(rating.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {rating.full_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {rating.group_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-bold ${getScoreColor(Math.round(rating.percentage))}`}>
                        {Math.round(rating.percentage)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              rating.percentage >= 70 ? 'bg-emerald-500' :
                              rating.percentage >= 40 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(rating.percentage, 100)}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${getScoreColor(Math.round(rating.percentage))}`}>
                          {Math.round(rating.percentage)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedStudent(rating);
                            setPowerForm({ ...powerForm, student_id: rating.student_id });
                            setShowAddPowerModal(true);
                          }}
                          className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                          title="Power qo'shish"
                        >
                          <Zap size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Power Modal */}
      {showAddPowerModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Power Qo'shish
              </h3>
              <button
                onClick={() => setShowAddPowerModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            
            <form onSubmit={handleAddPower} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  O'quvchi
                </label>
                <select
                  value={powerForm.student_id}
                  onChange={(e) => setPowerForm({ ...powerForm, student_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Power miqdori
                </label>
                <input
                  type="number"
                  value={powerForm.power}
                  onChange={(e) => setPowerForm({ ...powerForm, power: e.target.value ? parseInt(e.target.value) : 0 })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Power miqdorini kiriting"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Sabab
                </label>
                <textarea
                  value={powerForm.reason}
                  onChange={(e) => setPowerForm({ ...powerForm, reason: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="3"
                  placeholder="Power qo'shish sababi..."
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Qo'shish
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPowerModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
