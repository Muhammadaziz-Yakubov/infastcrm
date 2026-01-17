import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Modal from '../components/Modal';
import { 
  Users, 
  TrendingUp, 
  Phone, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  Filter,
  Search,
  BarChart3,
  Target,
  UserCheck,
  UserX,
  Clock,
  Instagram,
  MessageCircle,
  Share2,
  Radio,
  Globe
} from 'lucide-react';

export default function Marketing() {
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    group_id: '',
    source: 'Boshqa',
    course_interest: '',
    notes: '',
    assigned_to: '',
    follow_up_date: ''
  });

  const [groups, setGroups] = useState([]);

  const sourceIcons = {
    'Instagram': <Instagram size={16} />,
    'Telegram': <MessageCircle size={16} />,
    'Tanishlar': <Share2 size={16} />,
    'Reklama': <Radio size={16} />,
    'Veb-sayt': <Globe size={16} />,
    'Boshqa': <Users size={16} />
  };

  const statusColors = {
    'LEAD': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'INTERESTED': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    'REGISTERED': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    'CONFIRMED': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
    'CONVERTED': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'LOST': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  };

  useEffect(() => {
    fetchStats();
    fetchLeads();
    fetchSources();
    fetchGroups();
  }, [statusFilter, sourceFilter, searchTerm]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/marketing/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchLeads = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (sourceFilter) params.append('source', sourceFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await api.get(`/marketing/leads?${params}`);
      setLeads(response.data.leads);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchSources = async () => {
    try {
      const response = await api.get('/marketing/sources');
      setSources(response.data);
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLead) {
        await api.put(`/marketing/leads/${editingLead._id}`, formData);
      } else {
        await api.post('/marketing/leads', formData);
      }
      
      fetchLeads();
      fetchStats();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving lead:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      phone: lead.phone,
      group_id: lead.group_id._id || lead.group_id,
      source: lead.source,
      course_interest: lead.course_interest || '',
      notes: lead.notes || '',
      assigned_to: lead.assigned_to?._id || '',
      follow_up_date: lead.follow_up_date ? new Date(lead.follow_up_date).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Leadni o\'chirishni tasdiqlaysizmi?')) return;
    try {
      await api.delete(`/marketing/leads/${id}`);
      fetchLeads();
      fetchStats();
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const handleConvert = async (id) => {
    if (!confirm('Leadni o\'quvchiga aylantirishni tasdiqlaysizmi?')) return;
    try {
      await api.post(`/marketing/leads/${id}/convert`);
      fetchLeads();
      fetchStats();
      alert('Lead muvaffaqiyatli o\'quvchiga aylantirildi!');
    } catch (error) {
      console.error('Error converting lead:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      group_id: '',
      source: 'Boshqa',
      course_interest: '',
      notes: '',
      assigned_to: '',
      follow_up_date: ''
    });
    setEditingLead(null);
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Sizda bu sahifaga kirish huquqi yo'q</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Marketing</h1>
        <p className="text-gray-600 dark:text-gray-400">Leadlar va manbalar boshqaruvi</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Jami Leadlar</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalLeads}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Konversiya</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.conversionRate}%</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Aylantirilgan</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.convertedLeads}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <UserCheck className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Yo'qotilgan</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.lostLeads}</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <UserX className="text-red-600 dark:text-red-400" size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sources Analytics */}
      {sources.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 size={20} />
            Manbalar bo'yicha statistika
          </h2>
          <div className="space-y-3">
            {sources.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-gray-600 rounded-lg">
                    {sourceIcons[source._id] || <Users size={16} />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{source._id}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {source.totalLeads} ta lead
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {source.conversionRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {source.convertedLeads}/{source.totalLeads}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <option value="">Barcha statuslar</option>
            <option value="LEAD">Lead</option>
            <option value="INTERESTED">Qiziqqan</option>
            <option value="REGISTERED">Ro'yxatdan o'tgan</option>
            <option value="CONFIRMED">Tasdiqlangan</option>
            <option value="CONVERTED">Aylantirilgan</option>
            <option value="LOST">Yo'qotilgan</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <option value="">Barcha manbalar</option>
            <option value="Instagram">Instagram</option>
            <option value="Telegram">Telegram</option>
            <option value="Tanishlar">Tanishlar</option>
            <option value="Reklama">Reklama</option>
            <option value="Veb-sayt">Veb-sayt</option>
            <option value="Boshqa">Boshqa</option>
          </select>

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn-primary flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold whitespace-nowrap"
          >
            <Plus size={20} />
            Yangi Lead
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ism
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Telefon
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Manba
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Guruh
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Sana
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                          {lead.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {lead.name}
                        </p>
                        {lead.course_interest && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {lead.course_interest}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                      <Phone size={14} className="mr-2 text-gray-400" />
                      {lead.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                      <div className="mr-2">
                        {sourceIcons[lead.source] || <Users size={14} />}
                      </div>
                      {lead.source}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[lead.lead_status]}`}>
                      {lead.lead_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {lead.group_id?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(lead.createdAt).toLocaleDateString('uz-UZ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {lead.lead_status !== 'CONVERTED' && (
                        <button
                          onClick={() => handleConvert(lead._id)}
                          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                          title="O'quvchiga aylantirish"
                        >
                          <UserCheck size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(lead)}
                        className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                        title="Tahrirlash"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        title="O'chirish"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingLead ? 'Leadni tahrirlash' : 'Yangi Lead qo\'shish'}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ism
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Telefon
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Guruh
              </label>
              <select
                required
                value={formData.group_id}
                onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="">Guruhni tanlang</option>
                {groups.map((group) => (
                  <option key={group._id} value={group._id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Manba
              </label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="Instagram">Instagram</option>
                <option value="Telegram">Telegram</option>
                <option value="Tanishlar">Tanishlar</option>
                <option value="Reklama">Reklama</option>
                <option value="Veb-sayt">Veb-sayt</option>
                <option value="Boshqa">Boshqa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kurs qiziqishi
              </label>
              <input
                type="text"
                value={formData.course_interest}
                onChange={(e) => setFormData({ ...formData, course_interest: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Izohlar
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Follow-up sanasi
              </label>
              <input
                type="date"
                value={formData.follow_up_date}
                onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary px-4 py-3 rounded-xl font-medium"
            >
              {editingLead ? 'Saqlash' : 'Qo\'shish'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
