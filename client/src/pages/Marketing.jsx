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
  Search,
  BarChart3,
  Target,
  UserCheck,
  UserX,
  Instagram,
  MessageCircle,
  Share2,
  Radio,
  Globe,
  MoreVertical,
  ChevronRight,
  Filter,
  Clock,
  Layout
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
  const [groups, setGroups] = useState([]);
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

  const sourceIcons = {
    'Instagram': <Instagram size={16} />,
    'Telegram': <MessageCircle size={16} />,
    'Tanishlar': <Share2 size={16} />,
    'Reklama': <Radio size={16} />,
    'Veb-sayt': <Globe size={16} />,
    'Boshqa': <Users size={16} />
  };

  const statusColors = {
    'LEAD': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400',
    'INTERESTED': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400',
    'REGISTERED': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-400',
    'CONFIRMED': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-400',
    'CONVERTED': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400',
    'LOST': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400'
  };

  useEffect(() => {
    fetchAllData();
  }, [statusFilter, sourceFilter, searchTerm]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchLeads(),
        fetchSources(),
        fetchGroups()
      ]);
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

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
      const dataToSend = { ...formData };
      if (!dataToSend.assigned_to) delete dataToSend.assigned_to;
      if (!dataToSend.follow_up_date) delete dataToSend.follow_up_date;

      if (editingLead) {
        await api.put(`/marketing/leads/${editingLead._id}`, dataToSend);
      } else {
        await api.post('/marketing/leads', dataToSend);
      }
      
      fetchAllData();
      setShowModal(false);
      resetForm();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Xatolik yuz berdi';
      alert(`Xatolik: ${errorMessage}`);
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      phone: lead.phone,
      group_id: lead.group_id?._id || lead.group_id || '',
      source: lead.source,
      course_interest: lead.course_interest || '',
      notes: lead.notes || '',
      assigned_to: lead.assigned_to?._id || '',
      follow_up_date: lead.follow_up_date ? new Date(lead.follow_up_date).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Leadni o\'chirishni tasdiqlaysizmi?')) return;
    try {
      await api.delete(`/marketing/leads/${id}`);
      fetchLeads();
      fetchStats();
    } catch (error) {
      alert('O\'chirishda xatolik yuz berdi');
    }
  };

  const handleConvert = async (id) => {
    if (!window.confirm('Leadni o\'quvchiga aylantirishni tasdiqlaysizmi?')) return;
    try {
      await api.post(`/marketing/leads/${id}/convert`);
      fetchAllData();
      alert('Lead muvaffaqiyatli o\'quvchiga aylantirildi!');
    } catch (error) {
      alert(error.response?.data?.message || 'Aylantirishda xatolik yuz berdi');
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-3xl">
          <UserX size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 dark:text-white font-bold text-xl">Kirish taqiqlangan</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Sizda marketing bo'limini ko'rish huquqi yo'q.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto pb-24 md:pb-10 bg-gray-50 dark:bg-[#0f172a] min-h-screen">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">Marketing</h1>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Layout size={16} />
            <p className="text-sm font-medium">Boshqaruv paneli / Leadlar</p>
          </div>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="group relative flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl shadow-indigo-500/30 transition-all active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 group-hover:translate-x-full transition-transform duration-500"></div>
          <Plus size={22} className="relative z-10" />
          <span className="relative z-10">Yangi Lead Qo'shish</span>
        </button>
      </div>

      {/* 2. STATS GRID */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-10">
          {[
            { label: 'Jami Leadlar', val: stats.totalLeads, icon: Users, col: 'blue', desc: 'Umumiy oqim' },
            { label: 'Konversiya', val: `${stats.conversionRate}%`, icon: TrendingUp, col: 'green', desc: 'Samaradorlik' },
            { label: 'O\'quvchilar', val: stats.convertedLeads, icon: UserCheck, col: 'emerald', desc: 'Aylantirildi' },
            { label: 'Boy berildi', val: stats.lostLeads, icon: UserX, col: 'red', desc: 'Rad etilganlar' },
            { label: 'Top Manba', val: stats.topSource || 'N/A', icon: Target, col: 'purple', sub: `${stats.topSourceLeads} lead`, desc: 'Eng yaxshi natija' }
          ].map((item, i) => (
            <div key={i} className="group bg-white dark:bg-gray-800 p-5 md:p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className={`w-12 h-12 rounded-2xl bg-${item.col}-500/10 text-${item.col}-600 dark:text-${item.col}-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <item.icon size={24} />
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">{item.label}</p>
              <h3 className="text-2xl md:text-3xl font-black dark:text-white mt-2 mb-1">{item.val}</h3>
              <p className="text-[10px] text-gray-400 font-medium">{item.desc} {item.sub && `• ${item.sub}`}</p>
            </div>
          ))}
        </div>
      )}

      {/* 3. ANALYTICS & FILTERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Progress Charts */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black flex items-center gap-3 dark:text-white">
              <BarChart3 size={24} className="text-indigo-500" /> 
              Manbalar tahlili
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-5">
              {sources.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform">
                      {sourceIcons[s._id] || <Users size={18}/>}
                    </div>
                    <div>
                      <p className="text-sm font-black dark:text-white">{s._id}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{s.totalLeads} ta murojaat</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">{s.conversionRate.toFixed(1)}%</p>
                    <p className="text-[10px] text-gray-400 font-bold">KONVERSIYA</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col justify-center space-y-6">
              {sources.map((s, i) => {
                const perc = stats && stats.totalLeads > 0 ? (s.totalLeads / stats.totalLeads * 100) : 0;
                return (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black text-gray-600 dark:text-gray-300 uppercase tracking-tighter">{s._id}</span>
                      <span className="text-xs font-black text-indigo-500">{perc.toFixed(0)}%</span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden p-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out" 
                        style={{width: `${perc}%`}}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Advanced Filters */}
        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-500/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white/20 rounded-2xl">
                <Filter size={24} />
              </div>
              <h3 className="text-xl font-black">Aqlli Filtr</h3>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-200 ml-1">Qidiruv</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="Ism yoki telefon..." 
                    className="w-full bg-indigo-500/40 border-2 border-indigo-400/30 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold placeholder:text-indigo-300 focus:outline-none focus:border-white/50 focus:bg-indigo-500/60 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-200 ml-1">Status bo'yicha</label>
                <select 
                  className="w-full bg-indigo-500/40 border-2 border-indigo-400/30 rounded-2xl py-4 px-4 text-sm font-bold focus:outline-none focus:border-white/50 focus:bg-indigo-500/60 transition-all appearance-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="" className="text-gray-900">Barcha Statuslar</option>
                  {Object.keys(statusColors).map(s => <option key={s} value={s} className="text-gray-900">{s}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-200 ml-1">Manba bo'yicha</label>
                <select 
                  className="w-full bg-indigo-500/40 border-2 border-indigo-400/30 rounded-2xl py-4 px-4 text-sm font-bold focus:outline-none focus:border-white/50 focus:bg-indigo-500/60 transition-all appearance-none"
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                >
                  <option value="" className="text-gray-900">Barcha Manbalar</option>
                  {Object.keys(sourceIcons).map(s => <option key={s} value={s} className="text-gray-900">{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          <button 
            onClick={() => {setSearchTerm(''); setStatusFilter(''); setSourceFilter('');}}
            className="mt-8 w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 active:scale-95 transition-all"
          >
            Filtrlarni tozalash
          </button>
        </div>
      </div>

      {/* 4. LEADS LIST */}
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-900/40 border-b border-gray-100 dark:border-gray-700">
                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Mijoz ma'lumotlari</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Muloqot manbasi</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Joriy Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Sana</th>
                <th className="px-8 py-6 text-right text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {leads.length > 0 ? leads.map((lead) => (
                <tr key={lead._id} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">
                        {lead.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{lead.name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                          <Phone size={10} /> {lead.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-xl w-fit text-xs font-black dark:text-gray-300">
                      <span className="text-indigo-500">{sourceIcons[lead.source]}</span>
                      {lead.source}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black border-2 uppercase tracking-tighter ${statusColors[lead.lead_status]}`}>
                      {lead.lead_status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <Clock size={14} />
                      {new Date(lead.createdAt).toLocaleDateString('uz-UZ')}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {lead.lead_status !== 'CONVERTED' && (
                        <button onClick={() => handleConvert(lead._id)} className="p-2.5 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-colors" title="Aylantirish">
                          <UserCheck size={20}/>
                        </button>
                      )}
                      <button onClick={() => handleEdit(lead)} className="p-2.5 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-colors" title="Tahrirlash">
                        <Edit size={20}/>
                      </button>
                      <button onClick={() => handleDelete(lead._id)} className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors" title="O'chirish">
                        <Trash2 size={20}/>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <Search size={48} className="text-gray-200 mb-4" />
                      <p className="text-gray-400 font-bold">Hech qanday lead topilmadi</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
          {leads.map((lead) => (
            <div key={lead._id} className="p-6 space-y-5 active:bg-gray-50 dark:active:bg-gray-900/50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 font-black text-xl">
                    {lead.name[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 dark:text-white leading-tight">{lead.name}</h4>
                    <p className="text-sm text-gray-400 font-bold mt-1">{lead.phone}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black border-2 uppercase ${statusColors[lead.lead_status]}`}>
                  {lead.lead_status}
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs font-black text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-xl">
                  {sourceIcons[lead.source]} {lead.source}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleConvert(lead._id)} className="p-3 text-emerald-500"><UserCheck size={20}/></button>
                  <button onClick={() => handleEdit(lead)} className="p-3 text-indigo-500"><Edit size={20}/></button>
                  <button onClick={() => handleDelete(lead._id)} className="p-3 text-rose-500"><Trash2 size={20}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. MODAL FORM */}
      <Modal 
        isOpen={showModal} 
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingLead ? 'Lead Ma\'lumotlarini Yangilash' : 'Yangi Lead Ro\'yxatga Olish'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">To'liq ismi *</label>
              <input 
                type="text" required
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold dark:text-white transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Telefon raqami *</label>
              <input 
                type="tel" required
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold dark:text-white transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Qiziqayotgan guruhi</label>
              <select 
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold dark:text-white transition-all appearance-none"
                value={formData.group_id}
                onChange={(e) => setFormData({...formData, group_id: e.target.value})}
              >
                <option value="">Tanlang...</option>
                {groups.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Kelish manbasi</label>
              <select 
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold dark:text-white transition-all appearance-none"
                value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
              >
                {Object.keys(sourceIcons).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400 ml-1">Qo'shimcha izohlar</label>
            <textarea 
              rows="3"
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold dark:text-white transition-all resize-none"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            ></textarea>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
            >
              Bekor qilish
            </button>
            <button 
              type="submit"
              className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 active:scale-95 transition-all"
            >
              {editingLead ? 'Saqlash' : 'Qo\'shish'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}