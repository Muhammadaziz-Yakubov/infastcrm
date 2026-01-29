import { useState, useEffect } from 'react';
import api from '../utils/api';
import Modal from '../components/Modal';
import {
  Coins,
  Plus,
  Minus,
  Search,
  Users,
  History,
  Trash2,
  Filter,
  Award,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';

export default function AdminCoins() {
  const [activeTab, setActiveTab] = useState('balances');
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [showDeductModal, setShowDeductModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [awardType, setAwardType] = useState('students');

  const [formData, setFormData] = useState({
    amount: '',
    reason: '',
    group_id: ''
  });

  useEffect(() => {
    fetchGroups();
    if (activeTab === 'balances') {
      fetchBalances();
    } else {
      fetchHistory();
    }
  }, [activeTab, selectedGroup]);

  const fetchGroups = async () => {
    try {
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchBalances = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedGroup) params.group_id = selectedGroup;
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/coins/balances', { params });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching balances:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (selectedGroup) params.group_id = selectedGroup;

      const response = await api.get('/coins/history', { params });
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAward = async (e) => {
    e.preventDefault();
    try {
      if (awardType === 'students' && selectedStudents.length === 0) {
        alert('Kamida bitta o\'quvchi tanlang');
        return;
      }
      if (awardType === 'group' && !formData.group_id) {
        alert('Guruh tanlang');
        return;
      }

      const endpoint = awardType === 'group' ? '/coins/award-group' : '/coins/award';
      const data = awardType === 'group'
        ? { group_id: formData.group_id, amount: parseInt(formData.amount), reason: formData.reason }
        : { student_ids: selectedStudents, amount: parseInt(formData.amount), reason: formData.reason };

      await api.post(endpoint, data);

      setShowAwardModal(false);
      setFormData({ amount: '', reason: '', group_id: '' });
      setSelectedStudents([]);
      fetchBalances();
      alert('Tangalar muvaffaqiyatli berildi!');
    } catch (error) {
      console.error('Error awarding coins:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const handleDeduct = async (e) => {
    e.preventDefault();
    try {
      if (awardType === 'students' && selectedStudents.length === 0) {
        alert('Kamida bitta o\'quvchi tanlang');
        return;
      }
      if (awardType === 'group' && !formData.group_id) {
        alert('Guruh tanlang');
        return;
      }

      const endpoint = awardType === 'group' ? '/coins/deduct-group' : '/coins/deduct';
      const data = awardType === 'group'
        ? { group_id: formData.group_id, amount: parseInt(formData.amount), reason: formData.reason }
        : { student_ids: selectedStudents, amount: parseInt(formData.amount), reason: formData.reason };

      await api.post(endpoint, data);

      setShowDeductModal(false);
      setFormData({ amount: '', reason: '', group_id: '' });
      setSelectedStudents([]);
      fetchBalances();
      alert('Tangalar muvaffaqiyatli ayrildi!');
    } catch (error) {
      console.error('Error deducting coins:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const handleDeleteHistory = async (historyId) => {
    if (!confirm('Bu yozuvni o\'chirmoqchimisiz? O\'quvchi balansiga teskari ta\'sir qiladi.')) return;

    try {
      await api.delete(`/coins/history/${historyId}`);
      fetchHistory();
      alert('Yozuv o\'chirildi');
    } catch (error) {
      console.error('Error deleting history:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s._id));
    }
  };

  const filteredStudents = students.filter(student =>
    student.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getReasonTypeLabel = (type) => {
    const labels = {
      'ATTENDANCE_PRESENT': 'Darsga keldi',
      'ATTENDANCE_ABSENT': 'Darsga kelmadi',
      'HOMEWORK_SUBMITTED': 'Vazifa topshirdi',
      'HOMEWORK_NOT_SUBMITTED': 'Vazifa topshirmadi',
      'QUIZ_COMPLETED': 'Quiz bajarildi',
      'QUIZ_NOT_COMPLETED': 'Quiz bajarilmadi',
      'ADMIN_MANUAL': 'Admin tomonidan',
      'MARKET_PURCHASE': 'Mahsulot sotib oldi',
      'ORDER_CANCELLED': 'Buyurtma bekor qilindi'
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Coins className="w-8 h-8 text-yellow-500" />
          Tangalar Boshqaruvi
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowAwardModal(true); setAwardType('students'); }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Tanga Berish
          </button>
          <button
            onClick={() => { setShowDeductModal(true); setAwardType('students'); }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Minus className="w-4 h-4" />
            Tanga Ayirish
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('balances')}
          className={`pb-2 px-4 font-medium ${activeTab === 'balances'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Balanslar
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2 px-4 font-medium ${activeTab === 'history'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
        >
          <History className="w-4 h-4 inline mr-2" />
          Tarix
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="O'quvchi qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">Barcha guruhlar</option>
          {groups.map(group => (
            <option key={group._id} value={group._id}>{group.name}</option>
          ))}
        </select>
        <button
          onClick={() => activeTab === 'balances' ? fetchBalances() : fetchHistory()}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : activeTab === 'balances' ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={selectAllStudents}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">O'quvchi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Guruh</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Balans</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.map(student => (
                <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student._id)}
                      onChange={() => toggleStudentSelection(student._id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                    {student.full_name}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {student.group_id?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold ${student.coin_balance > 0
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                      <Coins className="w-4 h-4" />
                      {student.coin_balance || 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              O'quvchilar topilmadi
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Sana</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">O'quvchi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Sabab</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Turi</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Miqdor</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Balans</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {history.map(item => (
                <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                    {format(new Date(item.createdAt), 'dd.MM.yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {item.student_id?.full_name || '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                    {item.reason}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {getReasonTypeLabel(item.reason_type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center gap-1 font-bold ${item.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {item.amount > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {item.amount > 0 ? '+' : ''}{item.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-300">
                    {item.balance_after}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDeleteHistory(item._id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {history.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Tarix topilmadi
            </div>
          )}
        </div>
      )}

      {/* Award Modal */}
      <Modal isOpen={showAwardModal} onClose={() => setShowAwardModal(false)} title="Tanga Berish">
        <form onSubmit={handleAward} className="space-y-4">
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setAwardType('students')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium ${awardType === 'students'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              Tanlangan o'quvchilar
            </button>
            <button
              type="button"
              onClick={() => setAwardType('group')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium ${awardType === 'group'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              Butun guruh
            </button>
          </div>

          {awardType === 'students' ? (
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Tanlangan o'quvchilar: <strong>{selectedStudents.length}</strong>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Jadvaldan o'quvchilarni tanlang
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Guruh
              </label>
              <select
                value={formData.group_id}
                onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              >
                <option value="">Guruh tanlang</option>
                {groups.map(group => (
                  <option key={group._id} value={group._id}>{group.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Miqdor
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="100"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sabab
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Tanga berish sababi..."
              rows={3}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAwardModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Berish
            </button>
          </div>
        </form>
      </Modal>

      {/* Deduct Modal */}
      <Modal isOpen={showDeductModal} onClose={() => setShowDeductModal(false)} title="Tanga Ayirish">
        <form onSubmit={handleDeduct} className="space-y-4">
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setAwardType('students')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium ${awardType === 'students'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              Tanlangan o'quvchilar
            </button>
            <button
              type="button"
              onClick={() => setAwardType('group')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium ${awardType === 'group'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
            >
              Butun guruh
            </button>
          </div>

          {awardType === 'students' ? (
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Tanlangan o'quvchilar: <strong>{selectedStudents.length}</strong>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Jadvaldan o'quvchilarni tanlang
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Guruh
              </label>
              <select
                value={formData.group_id}
                onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              >
                <option value="">Guruh tanlang</option>
                {groups.map(group => (
                  <option key={group._id} value={group._id}>{group.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Miqdor
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="100"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sabab
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Tanga ayirish sababi..."
              rows={3}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowDeductModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Ayirish
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
