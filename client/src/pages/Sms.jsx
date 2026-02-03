import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Modal from '../components/Modal';
import { 
  MessageSquare, 
  Send, 
  Users, 
  UserX,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wallet,
  RefreshCw,
  ChevronDown,
  Phone,
  Layout
} from 'lucide-react';

export default function Sms() {
  const [balance, setBalance] = useState(null);
  const [logs, setLogs] = useState([]);
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('test'); // test, students, group, all, debtors
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [message, setMessage] = useState('');
  const [testPhone, setTestPhone] = useState('');
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const statusColors = {
    'SUCCESS': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400',
    'FAILED': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400',
    'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400'
  };

  const statusIcons = {
    'SUCCESS': <CheckCircle size={14} />,
    'FAILED': <XCircle size={14} />,
    'PENDING': <AlertCircle size={14} />
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchLogs();
    }
  }, [statusFilter]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchBalance(),
        fetchLogs(),
        fetchStudents(),
        fetchGroups()
      ]);
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    try {
      const response = await api.get('/sms/balance');
      setBalance(response.data);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      params.append('limit', '100');
      
      const response = await api.get(`/sms/logs?${params}`);
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
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

  const fetchGroups = async () => {
    try {
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setMessage('');
    setTestPhone('');
    setSelectedStudents([]);
    setSelectedGroup('');
    
    if (type === 'debtors') {
      setMessage('Hurmatli {full_name}! Sizning qarzingiz {debt} so\'m. To\'lov qiling bo\'lmasa darsga kiritilmaysiz. InFast IT-Academy');
    }
    
    setShowModal(true);
  };

  const handleSend = async () => {
    if (!message.trim()) {
      alert('Xabar matnini kiriting!');
      return;
    }

    setSending(true);
    try {
      let response;
      
      switch (modalType) {
        case 'test':
          if (!testPhone.trim()) {
            alert('Telefon raqamini kiriting!');
            setSending(false);
            return;
          }
          response = await api.post('/sms/send/test', { phone: testPhone, message });
          break;
          
        case 'students':
          if (selectedStudents.length === 0) {
            alert('Kamida bitta o\'quvchi tanlang!');
            setSending(false);
            return;
          }
          response = await api.post('/sms/send/students', { student_ids: selectedStudents, message });
          break;
          
        case 'group':
          if (!selectedGroup) {
            alert('Guruhni tanlang!');
            setSending(false);
            return;
          }
          response = await api.post('/sms/send/group', { group_id: selectedGroup, message });
          break;
          
        case 'all':
          response = await api.post('/sms/send/all-groups', { message });
          break;
          
        case 'debtors':
          response = await api.post('/sms/send/debtors', { message });
          break;
          
        default:
          break;
      }

      if (response?.data) {
        const { sent, failed, targets } = response.data;
        alert(`SMS yuborildi!\nJami: ${targets || 1}\nMuvaffaqiyatli: ${sent || (response.data.success ? 1 : 0)}\nXato: ${failed || 0}`);
        setShowModal(false);
        fetchLogs();
        fetchBalance();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'SMS yuborishda xatolik yuz berdi');
    } finally {
      setSending(false);
    }
  };

  const toggleStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const filteredStudents = students.filter(s => 
    s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone?.includes(searchTerm)
  );

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-3xl">
          <UserX size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 dark:text-white font-bold text-xl">Kirish taqiqlangan</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Sizda SMS bo'limini ko'rish huquqi yo'q.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto pb-24 md:pb-10 bg-gray-50 dark:bg-[#0f172a] min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">SMS Xabarnoma</h1>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Layout size={16} />
            <p className="text-sm font-medium">Boshqaruv paneli / SMS</p>
          </div>
        </div>
        <button
          onClick={fetchAllData}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Yangilash
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center mb-5">
            <Wallet size={24} />
          </div>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Balans</p>
          <h3 className="text-2xl md:text-3xl font-black dark:text-white mt-2">
            {balance?.data?.balance ? `${Number(balance.data.balance).toLocaleString()} so'm` : 'Yuklanmoqda...'}
          </h3>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
            <MessageSquare size={24} />
          </div>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Jami SMS</p>
          <h3 className="text-2xl md:text-3xl font-black dark:text-white mt-2">{logs.length}</h3>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
            <CheckCircle size={24} />
          </div>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Muvaffaqiyatli</p>
          <h3 className="text-2xl md:text-3xl font-black dark:text-white mt-2">
            {logs.filter(l => l.status === 'SUCCESS').length}
          </h3>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mb-5">
            <XCircle size={24} />
          </div>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Xato</p>
          <h3 className="text-2xl md:text-3xl font-black dark:text-white mt-2">
            {logs.filter(l => l.status === 'FAILED').length}
          </h3>
        </div>
      </div>

      {/* SEND BUTTONS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <button
          onClick={() => openModal('test')}
          className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Phone size={24} />
          </div>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Test SMS</span>
        </button>

        <button
          onClick={() => openModal('students')}
          className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users size={24} />
          </div>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Tanlangan</span>
        </button>

        <button
          onClick={() => openModal('group')}
          className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users size={24} />
          </div>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Guruhga</span>
        </button>

        <button
          onClick={() => openModal('all')}
          className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-lg transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Send size={24} />
          </div>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Hammaga</span>
        </button>

        <button
          onClick={() => openModal('debtors')}
          className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 hover:shadow-lg transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <AlertCircle size={24} />
          </div>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Qarzdorlar</span>
        </button>
      </div>

      {/* LOGS FILTER */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Filter size={18} />
          <span className="text-sm font-bold">Filtr:</span>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold dark:text-white"
        >
          <option value="">Barchasi</option>
          <option value="SUCCESS">Muvaffaqiyatli</option>
          <option value="FAILED">Xato</option>
          <option value="PENDING">Kutilmoqda</option>
        </select>
      </div>

      {/* LOGS TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-900/40 border-b border-gray-100 dark:border-gray-700">
                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Qabul qiluvchi</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Xabar</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Turi</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Xato</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Sana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {logs.length > 0 ? logs.map((log) => (
                <tr key={log._id} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">
                        {log.student_id?.full_name?.[0]?.toUpperCase() || 'T'}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 dark:text-white">{log.student_id?.full_name || 'Test'}</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                          <Phone size={10} /> {log.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate" title={log.message}>
                      {log.message}
                    </p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300">
                      {log.type || 'MANUAL'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase ${statusColors[log.status]}`}>
                      {statusIcons[log.status]}
                      {log.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    {log.provider_error ? (
                      <p className="text-xs text-red-500 font-bold max-w-[200px] truncate" title={log.provider_error}>
                        {log.provider_error}
                      </p>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <Clock size={14} />
                      {new Date(log.createdAt).toLocaleString('uz-UZ')}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <MessageSquare size={48} className="text-gray-200 dark:text-gray-700 mb-4" />
                      <p className="text-gray-400 font-bold">Hech qanday SMS topilmadi</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
          {logs.map((log) => (
            <div key={log._id} className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 font-black">
                    {log.student_id?.full_name?.[0] || 'T'}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 dark:text-white">{log.student_id?.full_name || 'Test'}</h4>
                    <p className="text-sm text-gray-400 font-bold">{log.phone}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black uppercase ${statusColors[log.status]}`}>
                  {statusIcons[log.status]}
                  {log.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{log.message}</p>
              {log.provider_error && (
                <p className="text-xs text-red-500 font-bold">{log.provider_error}</p>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock size={12} />
                {new Date(log.createdAt).toLocaleString('uz-UZ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalType === 'test' ? 'Test SMS yuborish' :
          modalType === 'students' ? 'Tanlangan o\'quvchilarga SMS' :
          modalType === 'group' ? 'Guruhga SMS yuborish' :
          modalType === 'all' ? 'Barcha o\'quvchilarga SMS' :
          'Qarzdorlarga SMS yuborish'
        }
        size="lg"
      >
        <div className="space-y-6">
          {/* Test SMS - Phone input */}
          {modalType === 'test' && (
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Telefon raqami *</label>
              <input
                type="tel"
                placeholder="998901234567"
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold dark:text-white transition-all"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
              />
            </div>
          )}

          {/* Students selection */}
          {modalType === 'students' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="O'quvchi qidirish..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-xl font-bold dark:text-white transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2 border border-gray-100 dark:border-gray-700 rounded-xl p-3">
                {filteredStudents.map((student) => (
                  <label
                    key={student._id}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      selectedStudents.includes(student._id)
                        ? 'bg-indigo-100 dark:bg-indigo-900/40'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student._id)}
                      onChange={() => toggleStudent(student._id)}
                      className="w-5 h-5 rounded-lg border-2 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{student.full_name}</p>
                      <p className="text-xs text-gray-400">{student.phone}</p>
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tanlangan: <span className="font-bold text-indigo-600">{selectedStudents.length}</span> ta o'quvchi
              </p>
            </div>
          )}

          {/* Group selection */}
          {modalType === 'group' && (
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Guruhni tanlang *</label>
              <select
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold dark:text-white transition-all appearance-none"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                <option value="">Tanlang...</option>
                {groups.map((g) => (
                  <option key={g._id} value={g._id}>{g.name} ({g.course_id?.name})</option>
                ))}
              </select>
            </div>
          )}

          {/* Debtors info */}
          {modalType === 'debtors' && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                <strong>Eslatma:</strong> Xabarda <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">{'{full_name}'}</code> va <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">{'{debt}'}</code> o'zgaruvchilaridan foydalanishingiz mumkin.
              </p>
            </div>
          )}

          {/* Message textarea */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400 ml-1">Xabar matni *</label>
            <textarea
              rows="4"
              placeholder="SMS xabarini yozing..."
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl font-bold dark:text-white transition-all resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <p className="text-xs text-gray-400 ml-1">{message.length} belgi</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
            >
              Bekor qilish
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Yuborilmoqda...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Yuborish
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
