import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Modal from '../components/Modal';
import {
  Plus,
  Edit,
  Trash2,
  X,
  CreditCard,
=======
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  CreditCard, 
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
  Search,
  Filter,
  User,
  Phone,
  Calendar,
  Eye,
  EyeOff,
  Key,
<<<<<<< HEAD
  UserCheck,
  Bell,
  AlertCircle,
  Wallet,
  Banknote,
  MessageSquare,
  FileText,
  Target,
  BookOpen,
  CalendarCheck
=======
  UserCheck
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
} from 'lucide-react';
import { format } from 'date-fns';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
<<<<<<< HEAD
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');
  const groupFilter = searchParams.get('group_id');
  const paymentFilter = searchParams.get('payment_filter');
  const { user, loading: authLoading } = useAuth();
=======
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');
  const groupFilter = searchParams.get('group_id');
  const { user } = useAuth();
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
  const isAdmin = user?.role === 'ADMIN';

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    parent_phone: '',
    group_id: '',
    status: 'ACTIVE',
    joined_date: format(new Date(), 'yyyy-MM-dd'),
    login: '',
<<<<<<< HEAD
    password: '',
    lead_source: 'Boshqa',
    // Payment fields
    first_payment_amount: '',
    first_payment_date: format(new Date(), 'yyyy-MM-dd'),
    first_payment_type: 'CASH',
    require_first_payment: true
  });

  const studentIdParam = searchParams.get('student_id');

  useEffect(() => {
    // Wait for auth to complete
    if (authLoading) return;

    // If user exists (admin or manager), fetch data
    if (user) {
      fetchGroups();
      fetchStudents();
    } else {
      // No user - stop loading
      setLoading(false);
    }
  }, [statusFilter, groupFilter, paymentFilter, authLoading, user]);

  // Handle student_id param to open modal automatically
  useEffect(() => {
    if (studentIdParam && students.length > 0) {
      const student = students.find(s => s._id === studentIdParam);
      if (student) {
        handleEdit(student);
      }
    }
  }, [studentIdParam, students]);

=======
    password: ''
  });

  useEffect(() => {
    fetchGroups();
    fetchStudents();
  }, [statusFilter, groupFilter]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Restore scroll position when modal closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [showModal]);
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88

  const fetchGroups = async () => {
    try {
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (groupFilter) params.group_id = groupFilter;
<<<<<<< HEAD
      if (paymentFilter) params.payment_filter = paymentFilter;

      const response = await api.get('/students', { params });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error.response?.data?.message || error.message);
=======
      
      const response = await api.get('/students', { params });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      // Only send password if it's provided
      if (!dataToSend.password) {
        delete dataToSend.password;
      }
<<<<<<< HEAD

      if (editingStudent) {
        await api.put(`/students/${editingStudent._id}`, dataToSend);
      } else {
        // Create student
        const studentResponse = await api.post('/students', dataToSend);
        const newStudent = studentResponse.data;

        // If first payment is required, create payment
        if (dataToSend.require_first_payment && dataToSend.first_payment_amount) {
          const paymentData = {
            student_id: newStudent._id,
            amount: parseFloat(dataToSend.first_payment_amount),
            payment_date: dataToSend.first_payment_date,
            payment_type: dataToSend.first_payment_type,
            note: 'Birinchi oy to\'lovi (o\'quvchi qo\'shilganda)'
          };

          await api.post('/payments', paymentData);
        } else {
          // If no payment made, set next payment date to today (so they appear in "To'lov yaqin" list)
          const updateData = {
            next_payment_date: new Date().toISOString().split('T')[0], // Today
            status: 'DEBTOR' // Mark as debtor since they didn't pay
          };

          await api.put(`/students/${newStudent._id}`, updateData);
        }
      }

=======
      
      if (editingStudent) {
        await api.put(`/students/${editingStudent._id}`, dataToSend);
      } else {
        await api.post('/students', dataToSend);
      }
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
      setShowModal(false);
      setEditingStudent(null);
      resetForm();
      fetchStudents();
    } catch (error) {
<<<<<<< HEAD
      console.error('Error saving student:', error.response?.data?.message || error.message);
      const errorMessage = error.response?.data?.message || 'Xatolik yuz berdi';
      alert(`Xatolik: ${errorMessage}`);
=======
      console.error('Error saving student:', error);
      alert(error.response?.data?.message || 'Xatolik yuz berdi');
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      full_name: student.full_name,
      phone: student.phone,
      parent_phone: student.parent_phone || '',
      group_id: student.group_id._id || student.group_id,
      status: student.status,
      joined_date: student.joined_date ? format(new Date(student.joined_date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      login: student.login || '',
<<<<<<< HEAD
      password: '',
      lead_source: student.lead_source || 'Boshqa'
=======
      password: ''
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('O\'quvchini o\'chirishni tasdiqlaysizmi?')) return;
    try {
      await api.delete(`/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      alert(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

<<<<<<< HEAD
  const handleShowMessageModal = async () => {
    if (!groupFilter) {
      alert('Iltimos, avval guruhni tanlang');
      return;
    }

    try {
      const groupResponse = await api.get(`/groups/${groupFilter}`);
      setSelectedGroup(groupResponse.data);
      setShowMessageModal(true);
    } catch (error) {
      console.error('Error fetching group:', error);
      alert('Guruh ma\'lumotlarini olishda xatolik');
    }
  };

  const handleSendMessage = async (messageType) => {
    if (!selectedGroup) return;

    try {
      const today = new Date().toISOString().split('T')[0];

      if (messageType === 'attendance') {
        await api.post(`/groups/${selectedGroup._id}/send-attendance`, {
          date: today
        });
        alert('Davomat xabari yuborildi!');
      } else if (messageType === 'scores') {
        await api.post(`/groups/${selectedGroup._id}/send-scores`, {
          date: today
        });
        alert('Ballar xabari yuborildi!');
      }

      setShowMessageModal(false);
      setSelectedGroup(null);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Xabar yuborishda xatolik yuz berdi');
    }
  };

=======
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
  const resetForm = () => {
    setFormData({
      full_name: '',
      phone: '',
      parent_phone: '',
      group_id: '',
      status: 'ACTIVE',
      joined_date: format(new Date(), 'yyyy-MM-dd'),
      login: '',
<<<<<<< HEAD
      password: '',
      lead_source: 'Boshqa',
      // Payment fields
      first_payment_amount: '',
      first_payment_date: format(new Date(), 'yyyy-MM-dd'),
      first_payment_type: 'CASH',
      require_first_payment: true
=======
      password: ''
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    });
    setShowPassword(false);
  };

<<<<<<< HEAD
  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    resetForm();
  };

=======
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
  const getStatusGradient = (status) => {
    switch (status) {
      case 'ACTIVE': return 'from-emerald-400 to-green-500';
      case 'DEBTOR': return 'from-red-400 to-rose-500';
      case 'STOPPED': return 'from-gray-400 to-gray-500';
      case 'LEAD': return 'from-amber-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ACTIVE': return 'Faol';
      case 'DEBTOR': return 'Qarzdor';
      case 'STOPPED': return 'To\'xtatilgan';
      case 'LEAD': return 'Nabor';
      default: return status;
    }
  };

  const filteredStudents = students.filter(student =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone.includes(searchTerm)
  );

<<<<<<< HEAD
  // Show loading state
  if (authLoading || loading) {
=======
  if (loading) {
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">O'quvchilar</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Jami: {students.length} ta o'quvchi
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-1 lg:w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {isAdmin && (
<<<<<<< HEAD
            <>
              <button
                onClick={() => {
                  setEditingStudent(null);
                  resetForm();
                  setShowModal(true);
                }}
                className="btn-primary flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold whitespace-nowrap"
              >
                <Plus size={20} />
                Yangi o'quvchi
              </button>

              {groupFilter && (
                <button
                  onClick={handleShowMessageModal}
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-semibold whitespace-nowrap hover:from-green-500 hover:to-emerald-600 transition-all"
                >
                  <MessageSquare size={20} />
                  Guruhga xabar
                </button>
              )}
            </>
=======
            <button
              onClick={() => {
                setEditingStudent(null);
                resetForm();
                setShowModal(true);
              }}
              className="btn-primary flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold whitespace-nowrap"
            >
              <Plus size={20} />
              Yangi o'quvchi
            </button>
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
          )}
        </div>
      </div>

<<<<<<< HEAD
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Link
          to="/students"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${!statusFilter && !paymentFilter
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
        >
          <UserCheck size={18} />
          Barchasi
        </Link>
        <Link
          to="/students?status=ACTIVE"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${statusFilter === 'ACTIVE'
            ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-lg'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
        >
          <UserCheck size={18} />
          Faol
        </Link>
        <Link
          to="/students?payment_filter=PAYMENT_DUE"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${paymentFilter === 'PAYMENT_DUE'
            ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
        >
          <Bell size={18} />
          To'lov yaqin (3 kun)
        </Link>
        <Link
          to="/students?status=DEBTOR"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${statusFilter === 'DEBTOR'
            ? 'bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-lg'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
        >
          <AlertCircle size={18} />
          Qarzdorlar
        </Link>
        <Link
          to="/students?status=LEAD"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${statusFilter === 'LEAD'
            ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
        >
          <User size={18} />
          Nabor
        </Link>
        <Link
          to="/students?status=STOPPED"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${statusFilter === 'STOPPED'
            ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
        >
          <X size={18} />
          To'xtatilgan
        </Link>
      </div>

=======
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
      {/* Students Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  O'quvchi
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Telefon
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Guruh
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Holati
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Keyingi to'lov
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Login
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredStudents.map((student, index) => (
<<<<<<< HEAD
                <tr
                  key={student._id}
                  className="table-row-hover cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => navigate(`/payments?student_id=${student._id}`)}
=======
                <tr 
                  key={student._id} 
                  className="table-row-hover"
                  style={{ animationDelay: `${index * 50}ms` }}
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getStatusGradient(student.status)} flex items-center justify-center`}>
                        <UserCheck className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{student.full_name}</p>
                        {student.parent_phone && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">Ota-ona: {student.parent_phone}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                    {student.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg text-sm font-medium">
                      {student.group_id?.name || 'Noma\'lum'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getStatusGradient(student.status)}`}>
                      {getStatusLabel(student.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
<<<<<<< HEAD
                    {student.next_payment_date
=======
                    {student.next_payment_date 
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
                      ? format(new Date(student.next_payment_date), 'dd.MM.yyyy')
                      : '-'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.login ? (
                      <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm">
                        {student.login}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
<<<<<<< HEAD
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Navigate to admin student profile page
                          navigate(`/students?student_id=${student._id}`);
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Profil"
                      >
                        <User size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Navigate to admin tasks page filtered by student
                          navigate(`/tasks?student_id=${student._id}`);
                        }}
                        className="p-2 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                        title="Vazifalar"
                      >
                        <BookOpen size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Navigate to attendance page with group filter
                          navigate(`/attendance?group_id=${student.group_id?._id || student.group_id}`);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Davomat"
                      >
                        <CalendarCheck size={18} />
                      </button>
                      <Link
                        to={`/payments?student_id=${student._id}`}
                        onClick={(e) => e.stopPropagation()}
=======
                      <Link
                        to={`/payments?student_id=${student._id}`}
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="To'lov qo'shish"
                      >
                        <CreditCard size={18} />
                      </Link>
                      {isAdmin && (
                        <>
                          <button
<<<<<<< HEAD
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(student);
                            }}
=======
                            onClick={() => handleEdit(student)}
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
                            className="p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
<<<<<<< HEAD
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(student._id);
                            }}
=======
                            onClick={() => handleDelete(student._id)}
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
                            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
            <p className="text-gray-500 dark:text-gray-400">O'quvchilar topilmadi</p>
          </div>
        )}
      </div>

      {/* Modal */}
<<<<<<< HEAD
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingStudent ? "O'quvchini tahrirlash" : "Yangi o'quvchi"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To'liq ism *
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                placeholder="Ism Familiya"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Telefon *
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  placeholder="+998901234567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ota-ona telefoni
              </label>
              <input
                type="tel"
                value={formData.parent_phone}
                onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                placeholder="+998901234567"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Guruh *
            </label>
            <select
              value={formData.group_id}
              onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
            >
              <option value="">Guruhni tanlang</option>
              {groups.map(group => (
                <option key={group._id} value={group._id}>
                  {group.name} ({group.status})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Holati
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
              >
                <option value="LEAD">Nabor</option>
                <option value="ACTIVE">Faol</option>
                <option value="DEBTOR">Qarzdor</option>
                <option value="STOPPED">To'xtatilgan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Manba
              </label>
              <select
                value={formData.lead_source}
                onChange={(e) => setFormData({ ...formData, lead_source: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
              >
                <option value="Instagram">Instagram</option>
                <option value="Telegram">Telegram</option>
                <option value="Tanishlar">Tanishlar</option>
                <option value="Reklama">Reklama</option>
                <option value="Veb-sayt">Veb-sayt</option>
                <option value="Boshqa">Boshqa</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Qo'shilgan sana
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={formData.joined_date}
                onChange={(e) => setFormData({ ...formData, joined_date: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
              />
            </div>
          </div>

          {/* Payment section - only for new students */}
          {!editingStudent && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Wallet size={16} className="text-green-500" />
                Birinchi oy to'lovi
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="require_first_payment"
                    checked={formData.require_first_payment}
                    onChange={(e) => setFormData({ ...formData, require_first_payment: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="require_first_payment" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Birinchi oy to'lovini qilish kerak
                  </label>
                </div>

                {formData.require_first_payment && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        To'lov summasi *
                      </label>
                      <div className="relative">
                        <Banknote size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          value={formData.first_payment_amount}
                          onChange={(e) => setFormData({ ...formData, first_payment_amount: e.target.value })}
                          required={formData.require_first_payment}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                          placeholder="500000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        To'lov turi *
                      </label>
                      <select
                        value={formData.first_payment_type}
                        onChange={(e) => setFormData({ ...formData, first_payment_type: e.target.value })}
                        required={formData.require_first_payment}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                      >
                        <option value="CASH">Naqd pul</option>
                        <option value="CARD">Plastik karta</option>
                        <option value="CLICK">Click</option>
                        <option value="PAYME">Payme</option>
                      </select>
                    </div>
                  </div>
                )}

                {formData.require_first_payment && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      To'lov sanasi *
                    </label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={formData.first_payment_date}
                        onChange={(e) => setFormData({ ...formData, first_payment_date: e.target.value })}
                        required={formData.require_first_payment}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Kabinet login/password section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Key size={16} className="text-indigo-500" />
              O'quvchi kabineti
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Login
                </label>
                <input
                  type="text"
                  value={formData.login}
                  onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  placeholder="student001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Parol {editingStudent && <span className="text-gray-400">(ixtiyoriy)</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              O'quvchi ushbu login va parol bilan shaxsiy kabinetga kirishi mumkin
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary px-4 py-3 rounded-xl font-medium"
            >
              {editingStudent ? 'Saqlash' : 'Qo\'shish'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Message Modal */}
      <Modal
        isOpen={showMessageModal && !!selectedGroup}
        onClose={() => {
          setShowMessageModal(false);
          setSelectedGroup(null);
        }}
        title="Guruhga xabar yuborish"
        size="sm"
      >
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl mb-4">
          <p className="text-green-700 dark:text-green-300">
            <strong>{selectedGroup?.name}</strong> guruhiga xabar yuborish
          </p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Qaysi turdagi xabarni yubormoqchisiz?
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={() => handleSendMessage('attendance')}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-400 to-orange-500 text-white rounded-xl font-medium shadow-lg hover:from-red-500 hover:to-orange-600 transition-all"
          >
            📋 Davomat xabari
          </button>
          <button
            onClick={() => handleSendMessage('scores')}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-xl font-medium shadow-lg hover:from-blue-500 hover:to-indigo-600 transition-all"
          >
            🎯 Ballar xabari
          </button>
        </div>

        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <strong>Davomat xabari:</strong> Bugun kelmagan o'quvchilar ro'yxati<br />
            <strong>Ballar xabari:</strong> Bugun kelgan o'quvchilar va ularning ballari
          </p>
        </div>
      </Modal>
=======
      {showModal && (
        <div 
          className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-fade-in-up max-h-[calc(100vh-2rem)] overflow-y-auto"
            style={{ scrollBehavior: 'smooth' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingStudent ? 'O\'quvchini tahrirlash' : 'Yangi o\'quvchi'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To'liq ism *
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    placeholder="Ism Familiya"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Telefon *
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                      placeholder="+998901234567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ota-ona telefoni
                  </label>
                  <input
                    type="tel"
                    value={formData.parent_phone}
                    onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    placeholder="+998901234567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Guruh *
                </label>
                <select
                  value={formData.group_id}
                  onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                >
                  <option value="">Guruhni tanlang</option>
                  {groups.map(group => (
                    <option key={group._id} value={group._id}>
                      {group.name} ({group.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Holati
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  >
                    <option value="LEAD">Nabor</option>
                    <option value="ACTIVE">Faol</option>
                    <option value="DEBTOR">Qarzdor</option>
                    <option value="STOPPED">To'xtatilgan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Qo'shilgan sana
                  </label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={formData.joined_date}
                      onChange={(e) => setFormData({ ...formData, joined_date: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Kabinet login/password section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Key size={16} className="text-indigo-500" />
                  O'quvchi kabineti
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Login
                    </label>
                    <input
                      type="text"
                      value={formData.login}
                      onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                      placeholder="student001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Parol {editingStudent && <span className="text-gray-400">(ixtiyoriy)</span>}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all pr-12"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  O'quvchi ushbu login va parol bilan shaxsiy kabinetga kirishi mumkin
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary px-4 py-3 rounded-xl font-medium"
                >
                  {editingStudent ? 'Saqlash' : 'Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    </div>
  );
}
