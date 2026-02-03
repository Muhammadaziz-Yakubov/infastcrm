import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Referrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  
  const [formData, setFormData] = useState({
    referrer_id: '',
    friend_id: '',
    notes: ''
  });

  useEffect(() => {
    fetchReferrals();
    fetchStudents();
    fetchStatistics();
  }, [filterStatus]);

  const fetchReferrals = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = filterStatus 
        ? `${API_URL}/api/referrals/all?status=${filterStatus}`
        : `${API_URL}/api/referrals/all`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReferrals(response.data.referrals);
      setLoading(false);
    } catch (error) {
      console.error('Referrallarni yuklashda xatolik:', error);
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Talabalarni yuklashda xatolik:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/referrals/statistics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatistics(response.data);
    } catch (error) {
      console.error('Statistikani yuklashda xatolik:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/referrals/create`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowAddModal(false);
      setFormData({ referrer_id: '', friend_id: '', notes: '' });
      fetchReferrals();
      fetchStatistics();
      alert('Referral muvaffaqiyatli yaratildi!');
    } catch (error) {
      alert(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleApprove = async (id) => {
    if (!confirm('Referralni tasdiqlaysizmi?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/referrals/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
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
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/referrals/cancel/${id}`, { reason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchReferrals();
      fetchStatistics();
      alert('Referral bekor qilindi!');
    } catch (error) {
      alert(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      ACTIVE: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      PENDING: 'Kutilmoqda',
      ACTIVE: 'Aktiv',
      COMPLETED: 'Yakunlangan',
      CANCELLED: 'Bekor qilingan'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Referral Tizimi</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Yangi Referral
          </button>
        </div>

        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-gray-500 text-sm">Jami Referrallar</div>
              <div className="text-3xl font-bold text-gray-800">{statistics.totalReferrals}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-gray-500 text-sm">Kutilmoqda</div>
              <div className="text-3xl font-bold text-yellow-600">{statistics.pendingReferrals}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-gray-500 text-sm">Aktiv</div>
              <div className="text-3xl font-bold text-blue-600">{statistics.activeReferrals}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-gray-500 text-sm">Yakunlangan</div>
              <div className="text-3xl font-bold text-green-600">{statistics.completedReferrals}</div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('')}
              className={`px-4 py-2 rounded ${!filterStatus ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Hammasi
            </button>
            <button
              onClick={() => setFilterStatus('PENDING')}
              className={`px-4 py-2 rounded ${filterStatus === 'PENDING' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
            >
              Kutilmoqda
            </button>
            <button
              onClick={() => setFilterStatus('ACTIVE')}
              className={`px-4 py-2 rounded ${filterStatus === 'ACTIVE' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Aktiv
            </button>
            <button
              onClick={() => setFilterStatus('COMPLETED')}
              className={`px-4 py-2 rounded ${filterStatus === 'COMPLETED' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            >
              Yakunlangan
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taklif qilgan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Do'st</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chegirma</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sana</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amallar</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {referrals.map((referral) => (
                <tr key={referral._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {referral.referrer_id?.full_name}
                    </div>
                    <div className="text-sm text-gray-500">{referral.referrer_id?.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {referral.friend_id?.full_name}
                    </div>
                    <div className="text-sm text-gray-500">{referral.friend_id?.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(referral.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{referral.discount_percent}%</div>
                    {referral.discount_active && (
                      <span className="text-xs text-green-600">Aktiv</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(referral.createdAt).toLocaleDateString('uz-UZ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {referral.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(referral._id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Tasdiqlash
                        </button>
                        <button
                          onClick={() => handleCancel(referral._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Bekor qilish
                        </button>
                      </div>
                    )}
                    {referral.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleCancel(referral._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Bekor qilish
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {statistics?.topReferrers && statistics.topReferrers.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Top Referrerlar</h2>
            <div className="space-y-3">
              {statistics.topReferrers.map((referrer, index) => (
                <div key={referrer._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                    <div>
                      <div className="font-medium">{referrer.full_name}</div>
                      <div className="text-sm text-gray-500">{referrer.phone}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{referrer.referralCount} referral</div>
                    <div className="text-sm text-gray-500">
                      {referrer.totalDiscountGiven?.toLocaleString()} so'm chegirma
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Yangi Referral Qo'shish</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taklif qilgan talaba
                </label>
                <select
                  value={formData.referrer_id}
                  onChange={(e) => setFormData({ ...formData, referrer_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Do'st (yangi talaba)
                </label>
                <select
                  value={formData.friend_id}
                  onChange={(e) => setFormData({ ...formData, friend_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Izoh (ixtiyoriy)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Saqlash
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
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
};

export default Referrals;
