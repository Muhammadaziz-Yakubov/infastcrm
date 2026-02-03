<<<<<<< HEAD
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Modal from '../components/Modal';

import {
  FileText, Plus, Edit, Trash2, Search, Image as ImageIcon,
  Users, Target, Upload, Clock, X, Eye, Download, CheckCircle,
  AlertCircle, MessageSquare, Star, File as FileIcon, ChevronRight,
  Filter, LayoutGrid, List, BarChart3, ArrowUpRight, Calendar
} from 'lucide-react';

// ... (existing code top)

export default function AdminTasks() {
  const [searchParams] = useSearchParams();
  const studentIdParam = searchParams.get('student_id');

  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState(studentIdParam ? 'submissions' : 'tasks'); // 'tasks' | 'submissions' | 'stats'
  const [tasks, setTasks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [studentFilter, setStudentFilter] = useState(studentIdParam || '');

  // Modals
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showSubmissionDetailModal, setShowSubmissionDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [taskToArchive, setTaskToArchive] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected Items
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grading, setGrading] = useState({ score: '', feedback: '' });

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    group_id: '',
    deadline: '',
    max_score: 100,
    status: 'ACTIVE'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  // --- API SERVICE LAYER ---

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tasksRes, groupsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/groups')
      ]);
      setTasks(tasksRes.data);
      setGroups(groupsRes.data);

      // If studentIdParam is present, fetch their submissions across all tasks
      if (studentIdParam) {
        const subRes = await api.get('/tasks/submissions/all', {
          params: { student_id: studentIdParam }
        });
        setSubmissions(subRes.data);
      }
    } catch (error) {
      console.error("Data Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [studentIdParam]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      const endpoint = selectedTask ? `/tasks/${selectedTask._id}` : '/tasks';
      const method = selectedTask ? 'put' : 'post';
      await api[method](endpoint, data);

      setShowTaskModal(false);
      resetTaskForm();
      fetchData();
    } catch (error) {
      console.error('Task submission error:', error);
      alert("Xatolik yuz berdi: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const loadSubmissions = async (taskId) => {
    setLoading(true);
    try {
      const res = await api.get(`/tasks/${taskId}/submissions`);
      setSubmissions(res.data);
    } catch (error) {
      console.error(error);
=======
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  FileCode, 
  Search,
  Eye,
  CheckCircle,
  Clock,
  Trophy,
  Image,
  Users,
  Star
} from 'lucide-react';
import { format } from 'date-fns';

export default function AdminTasks() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    group_id: '',
    max_score: 100
  });

  const [gradeData, setGradeData] = useState({
    score: '',
    feedback: ''
  });

  useEffect(() => {
    fetchGroups();
    fetchTasks();
    fetchSubmissions();
  }, [groupFilter]);

  const fetchGroups = async () => {
    try {
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const params = groupFilter ? { group_id: groupFilter } : {};
      const response = await api.get('/tasks', { params });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const submitGrade = async () => {
    if (!grading.score) return alert("Ballni kiriting");
    try {
      await api.post(`/tasks/submissions/${selectedSubmission._id}/grade`, {
        score: parseInt(grading.score),
        feedback: grading.feedback
      });
      setShowSubmissionDetailModal(false);

      // Refresh based on current context
      if (selectedTask) {
        loadSubmissions(selectedTask._id);
      } else if (studentIdParam) {
        fetchData(); // This will re-fetch the global submissions
      }
    } catch (error) {
      alert("Xatolik");
    }
  };

  const handleDeleteTask = (task) => {
    console.log('🗑️ Delete button clicked for task:', task.title, task._id);
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) {
      console.error('❌ No task to delete');
      return;
    }

    console.log(`🗑️ Starting delete process for task: ${taskToDelete._id} - ${taskToDelete.title}`);

    try {
      console.log(`📡 Making DELETE request to: /tasks/${taskToDelete._id}`);

      const response = await api.delete(`/tasks/${taskToDelete._id}`);
      console.log('✅ Raw response:', response);
      console.log('✅ Task deleted successfully:', response.data);

      // Refresh tasks list
      fetchData();

      // If the deleted task was selected, clear selection
      if (selectedTask && selectedTask._id === taskToDelete._id) {
        setSelectedTask(null);
        setSubmissions([]);
        setActiveTab('tasks');
      }

      setShowDeleteModal(false);
      setTaskToDelete(null);

      // Show success message
      alert('✅ Vazifa muvaffaqiyatli o\'chirildi!');
    } catch (error) {
      console.error('❌ Task deletion error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error message:', error.message);

      let errorMessage = 'Noma\'lum xatolik';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert("Xatolik yuz berdi: " + errorMessage);
    }
  };

  const handleArchiveTask = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, { ...task, status: 'CLOSED' });
      alert('Vazifa arxivlandi');
      fetchData();
    } catch (error) {
      alert('Xatolik yuz berdi');
    }
  };

  // --- LOGIC HELPERS ---

  const getImageUrl = (url) => {
    if (!url) return null;
    // Support data URLs (base64) and http URLs - return as is
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    // Production da backend URL dan foydalanamiz
    const backendUrl = import.meta.env.VITE_API_URL || 'https://infastcrm-0b2r.onrender.com';
    // URL to'g'ri formatda bo'lishi kerak: /uploads/tasks/filename.jpg
    const cleanUrl = url.startsWith('/') ? url : '/' + url;
    return `${backendUrl}${cleanUrl}`;
  };

  const resetTaskForm = () => {
    setFormData({ title: '', description: '', group_id: '', deadline: '', max_score: 100, status: 'ACTIVE' });
    setImagePreview('');
    setImageFile(null);
    setSelectedTask(null);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGroup = groupFilter ? t.group_id?._id === groupFilter : true;

      // If we are in 'tasks' tab, only show ACTIVE
      // If we are in 'archive' tab, only show CLOSED
      const tabStatus = activeTab === 'tasks' ? 'ACTIVE' : (activeTab === 'archive' ? 'CLOSED' : null);

      if (tabStatus && t.status !== tabStatus) return false;

      const matchesStatus = statusFilter === 'ALL' ? true : t.status === statusFilter;
      return matchesSearch && matchesGroup && matchesStatus;
    });
  }, [tasks, searchTerm, groupFilter, statusFilter, activeTab]);

  // --- RENDER COMPONENTS ---

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h4 className="text-3xl font-black mt-1 dark:text-white">{value}</h4>
      </div>
      <div className={`p-4 rounded-2xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 p-4 md:p-8 lg:p-12 font-sans">

      {/* 1. TOP NAVIGATION & STATS */}
      <div className="max-w-[1400px] mx-auto space-y-10">

        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Vazifalar Boshqaruv Paneli
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
              <Calendar size={16} /> Bugun: {new Date().toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => { resetTaskForm(); setShowTaskModal(true); }}
              className="flex-1 lg:flex-none px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 transition-all active:scale-95"
            >
              <Plus size={22} /> Yangi Vazifa Qo'shish
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Jami Vazifalar" value={tasks.length} icon={FileText} color="bg-blue-500" />
          <StatCard title="Faol Guruhlar" value={groups.length} icon={Users} color="bg-indigo-500" />
          <StatCard title="Yuborilgan topshiriqlar" value={submissions.length || 0} icon={ArrowUpRight} color="bg-emerald-500" />
          <StatCard title="Kutilmoqda" value={tasks.filter(t => t.status === 'ACTIVE').length} icon={Clock} color="bg-amber-500" />
        </div>

        {/* 2. TABS SYSTEM */}
        <div className="flex items-center gap-2 p-1.5 bg-gray-200/50 dark:bg-gray-900/50 rounded-[1.5rem] w-fit">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'tasks' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Vazifalar
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'submissions' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Tekshirish
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'archive' ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Arxiv
          </button>
        </div>

        {/* 3. MAIN CONTENT AREA */}
        {activeTab === 'tasks' ? (
          <section className="space-y-6 animate-in fade-in duration-500">
            {/* Filters Bar */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Vazifa nomi bo'yicha qidirish..."
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl dark:text-white font-medium"
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
              >
                <option value="">Barcha Guruhlar</option>
                {groups.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
              </select>
              <select
                className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl dark:text-white font-medium"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">Barcha Holatlar</option>
                <option value="ACTIVE">Faol</option>
                <option value="CLOSED">Yopilgan</option>
              </select>
            </div>

            {/* Task Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-80 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-[2.5rem]" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredTasks.map(task => (
                  <div key={task._id} className="group bg-white dark:bg-gray-900 rounded-[3rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                    <div className="relative h-56 mb-6 rounded-[2.2rem] overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {task.image_url ? (
                        <img src={getImageUrl(task.image_url)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={60} strokeWidth={1} /></div>
                      )}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md ${task.status === 'ACTIVE' ? 'bg-emerald-500/80 text-white' : 'bg-rose-500/80 text-white'}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-black mb-3 dark:text-white line-clamp-1">{task.title}</h3>

                    <div className="flex flex-wrap gap-4 mb-8">
                      <div className="flex items-center gap-2 text-gray-500 text-sm font-bold bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-xl">
                        <Users size={16} className="text-blue-500" /> {task.group_id?.name || 'Guruhsiz'}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm font-bold bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-xl">
                        <Target size={16} className="text-rose-500" /> {task.max_score} ball
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <button
                        onClick={() => { setSelectedTask(task); loadSubmissions(task._id); setActiveTab('submissions'); }}
                        className="py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl font-bold text-xs hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-1"
                      >
                        <Eye size={14} /> Tekshirish
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTask(task); setFormData({
                            title: task.title,
                            description: task.description || '',
                            group_id: task.group_id?._id || '',
                            deadline: task.deadline ? new Date(new Date(task.deadline).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '',
                            max_score: task.max_score,
                            status: task.status
                          }); setImagePreview(getImageUrl(task.image_url)); setShowTaskModal(true);
                        }}
                        className="py-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl font-bold text-xs hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center gap-1"
                      >
                        <Edit size={14} /> Tahrirlash
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task)}
                        className="py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-2xl font-bold text-xs hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-1"
                      >
                        <Trash2 size={14} /> O'chirish
                      </button>
                      {task.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleArchiveTask(task)}
                          className="py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl font-bold text-xs hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-1"
                        >
                          <CheckCircle size={14} /> Tugatish
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : activeTab === 'archive' ? (
          <section className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-[2rem] border border-amber-200 dark:border-amber-900/20 flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white"><AlertCircle size={24} /></div>
              <p className="text-amber-800 dark:text-amber-200 font-bold">Arxivlangan vazifalar o'quvchilarga "Yakunlangan" bo'limida ko'rinadi va ular qayta topshira olmaydilar.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {tasks.filter(t => t.status === 'CLOSED').length === 0 ? (
                <div className="col-span-full py-20 text-center text-gray-400 font-bold">Arxivlangan vazifalar mavjud emas</div>
              ) : (
                tasks.filter(t => t.status === 'CLOSED').map(task => (
                  <div key={task._id} className="bg-white dark:bg-gray-900 rounded-[3rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800 opacity-75">
                    <h3 className="text-xl font-black mb-2 dark:text-white">{task.title}</h3>
                    <p className="text-xs text-gray-500 mb-4">{task.group_id?.name}</p>
                    <button
                      onClick={() => {
                        if (window.confirm('Vazifani qayta faollashtirmoqchimisiz?')) {
                          api.put(`/tasks/${task._id}`, { ...task, status: 'ACTIVE' }).then(() => fetchData());
                        }
                      }}
                      className="w-full py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl font-bold text-xs hover:bg-emerald-500 hover:text-white transition-all"
                    >
                      Qayta Faollashtirish
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        ) : (
          /* 4. SUBMISSIONS VIEW (Tekshirish qismi) */
          <section className="animate-in slide-in-from-right duration-500">
            {!selectedTask ? (
              <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-800">
                <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="text-blue-600" size={40} />
                </div>
                <h2 className="text-3xl font-black dark:text-white mb-2">Vazifani tanlang</h2>
                <p className="text-gray-500">Topshiriqlarni tekshirish uchun avval vazifalar ro'yxatidan birini tanlang</p>
                <button onClick={() => setActiveTab('tasks')} className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold">Vazifalarga qaytish</button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Header for Submissions */}
                <div className="flex justify-between items-center bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/30">
                  <div>
                    <button onClick={() => setSelectedTask(null)} className="text-blue-200 mb-2 flex items-center gap-1 hover:text-white transition-colors">
                      <ChevronRight className="rotate-180" size={20} /> Orqaga
                    </button>
                    <h2 className="text-3xl font-black">{selectedTask.title}</h2>
                    <p className="opacity-80 font-medium">{selectedTask.group_id?.name} guruhi topshiriqlari</p>
                  </div>
                  <div className="hidden md:block text-right">
                    <p className="text-sm opacity-80 uppercase tracking-widest font-bold">Jami yuborilgan</p>
                    <p className="text-5xl font-black">{submissions.length}</p>
                  </div>
                </div>

                {/* Submissions List */}
                <div className="grid grid-cols-1 gap-4">
                  {submissions.length === 0 ? (
                    <div className="py-20 text-center text-gray-400">Hali hech kim javob yubormagan</div>
                  ) : (
                    submissions.map((sub, index) => (
                      <div key={sub._id} className="bg-white dark:bg-gray-900 p-6 rounded-[2.2rem] border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center text-2xl font-black text-gray-500">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="text-xl font-black dark:text-white">{sub.student_id?.full_name}</h4>
                            {!selectedTask && sub.task_id && (
                              <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{sub.task_id.title}</p>
                            )}
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-400 flex items-center gap-1"><Clock size={14} /> {new Date(sub.submitted_at).toLocaleDateString()} {new Date(sub.submitted_at).toLocaleTimeString()}</span>
                              <span className={`text-[10px] font-black px-3 py-1 rounded-full ${sub.status === 'GRADED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                {sub.status === 'GRADED' ? 'BAHOLANGAN' : 'KUTILMOQDA'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                          {sub.status === 'GRADED' && (
                            <div className="text-right mr-4">
                              <p className="text-[10px] font-bold text-gray-400 uppercase">Ball</p>
                              <p className="text-2xl font-black text-blue-600">{sub.score} / {selectedTask?.max_score || sub.task_id?.max_score}</p>
                            </div>
                          )}
                          <button
                            onClick={() => { setSelectedSubmission(sub); setGrading({ score: sub.score || '', feedback: sub.feedback || '' }); setShowSubmissionDetailModal(true); }}
                            className="flex-1 md:flex-none px-10 py-4 bg-gray-900 dark:bg-gray-800 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg"
                          >
                            Tekshirish
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* --- MODALS AREA --- */}

      {/* A. CREATE/EDIT TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowTaskModal(false)} />
          <form onSubmit={handleTaskSubmit} className="relative bg-white dark:bg-gray-900 w-full max-w-4xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex flex-col h-[90vh]">
              {/* Modal Header */}
              <div className="p-10 border-b dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-3xl font-black dark:text-white">{selectedTask ? 'Vazifani Tahrirlash' : 'Yangi Vazifa'}</h2>
                <button type="button" onClick={() => setShowTaskModal(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors dark:text-white"><X size={28} /></button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Vazifa Sarlavhasi</label>
                    <input
                      required
                      className="w-full px-6 py-5 bg-gray-50 dark:bg-gray-800 border-none rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/20 dark:text-white text-lg font-bold"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Masalan: React Hooks darsligi"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Guruhni Tanlang</label>
                    <select
                      required
                      className="w-full px-6 py-5 bg-gray-50 dark:bg-gray-800 border-none rounded-[1.5rem] dark:text-white font-bold"
                      value={formData.group_id}
                      onChange={e => setFormData({ ...formData, group_id: e.target.value })}
                    >
                      <option value="">Tanlash...</option>
                      {groups.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Vazifa Tavsifi (Full Description)</label>
                  <textarea
                    rows={5}
                    className="w-full px-6 py-5 bg-gray-50 dark:bg-gray-800 border-none rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/20 dark:text-white"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Vazifa haqida batafsil ma'lumot kiriting..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Tugatish vaqti (Deadline)</label>
                    <input type="datetime-local" className="w-full px-6 py-5 bg-gray-50 dark:bg-gray-800 border-none rounded-[1.5rem] dark:text-white font-bold" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Maksimal Ball</label>
                    <input type="number" className="w-full px-6 py-5 bg-gray-50 dark:bg-gray-800 border-none rounded-[1.5rem] dark:text-white font-bold" value={formData.max_score} onChange={e => setFormData({ ...formData, max_score: e.target.value })} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Holati</label>
                    <select className="w-full px-6 py-5 bg-gray-50 dark:bg-gray-800 border-none rounded-[1.5rem] dark:text-white font-bold" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                      <option value="ACTIVE">Faol</option>
                      <option value="CLOSED">Yopilgan</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Muqova Rasmi (Cover)</label>
                  <div className="relative group h-64 bg-gray-50 dark:bg-gray-800 rounded-[2.5rem] border-4 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center overflow-hidden hover:border-blue-500 transition-all">
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto text-gray-300 mb-4" size={50} />
                        <p className="text-gray-500 font-bold">Rasm yuklang yoki shu yerga tashlang</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }} />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-10 border-t dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex gap-4">
                <button type="button" onClick={() => setShowTaskModal(false)} className="flex-1 py-5 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-[1.5rem] font-bold hover:bg-gray-100 transition-all">Bekor qilish</button>
                <button type="submit" disabled={submitting} className="flex-[2] py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-xl shadow-2xl shadow-blue-500/40 hover:bg-blue-700 disabled:opacity-50">
                  {submitting ? 'Saqlanmoqda...' : 'Vazifani Saqlash'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* B. SUBMISSION DETAIL & GRADING MODAL */}
      {showSubmissionDetailModal && selectedSubmission && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowSubmissionDetailModal(false)} />
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-6xl rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] animate-in zoom-in-95 duration-200">

            {/* Chap tomon: Talaba yuborgan kontent */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 border-r dark:border-gray-800">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-3xl font-black text-white">{selectedSubmission.student_id?.full_name?.charAt(0)}</div>
                <div>
                  <h3 className="text-3xl font-black dark:text-white">{selectedSubmission.student_id?.full_name}</h3>
                  <p className="text-gray-500 font-bold flex items-center gap-2"><Clock size={18} /> Yuborilgan vaqt: {new Date(selectedSubmission.submitted_at).toLocaleString('uz-UZ')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase text-gray-400 tracking-widest">Talaba izohi:</h4>
                <div className="p-8 bg-gray-50 dark:bg-gray-800 rounded-[2rem] text-lg text-gray-700 dark:text-gray-300 italic border-l-8 border-blue-500">
                  "{selectedSubmission.description || 'Izoh qoldirilmagan'}"
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase text-gray-400 tracking-widest">Yuborilgan fayllar ({selectedSubmission.submitted_files?.length}):</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedSubmission.submitted_files?.map((file, i) => {
                    const fileUrl = getImageUrl(file.file_path);
                    console.log(`📄 Admin File ${file.original_name}: file_path = ${file.file_path?.substring(0, 100)}..., resolved URL = ${fileUrl?.substring(0, 100)}...`);
                    return (
                      <div key={i} className="group p-4 bg-white dark:bg-gray-800 border-2 dark:border-gray-700 rounded-2xl flex items-center justify-between hover:border-blue-500 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl">{file.mime_type?.includes('image') ? <ImageIcon size={24} /> : <FileIcon size={24} />}</div>
                          <span className="font-bold text-sm dark:text-white truncate max-w-[150px]">{file.original_name}</span>
                        </div>
                        <div className="flex gap-2">
                          {file.mime_type?.includes('image') && (
                            <button onClick={() => {
                              console.log(`🖼️ Admin previewing image: ${fileUrl?.substring(0, 100)}...`);
                              setPreviewImage(fileUrl);
                            }} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500 hover:text-blue-600"><Eye size={18} /></button>
                          )}
                          <a href={fileUrl} target="_blank" rel="noreferrer" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Download size={18} /></a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* O'ng tomon: Baholash paneli */}
            <div className="w-full md:w-[400px] bg-gray-50 dark:bg-gray-800/30 p-10 flex flex-col justify-between">
              <div>
                <h4 className="text-2xl font-black dark:text-white mb-8">Baholash</h4>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase">Qo'yiladigan Ball (Max: {selectedTask?.max_score || selectedSubmission?.task_id?.max_score})</label>
                    <div className="relative">
                      <Star className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400" size={24} />
                      <input
                        type="number"
                        max={selectedTask?.max_score || selectedSubmission?.task_id?.max_score}
                        className="w-full pl-14 pr-6 py-5 bg-white dark:bg-gray-900 border-none rounded-2xl text-2xl font-black text-blue-600 focus:ring-4 focus:ring-blue-500/20"
                        value={grading.score}
                        onChange={e => setGrading({ ...grading, score: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase">Fikr-mulohaza (Feedback)</label>
                    <textarea
                      rows={6}
                      className="w-full p-6 bg-white dark:bg-gray-900 border-none rounded-2xl dark:text-white font-medium"
                      placeholder="Talabaga xatolarini yoki yutuqlarini yozing..."
                      value={grading.feedback}
                      onChange={e => setGrading({ ...grading, feedback: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={submitGrade}
                className="w-full py-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-emerald-500/30 transition-all active:scale-95"
              >
                {selectedSubmission.status === 'GRADED' ? 'Bahoni Yangilash' : 'Baholashni Tasdiqlash'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* B. DELETE CONFIRMATION MODAL */}
      {showDeleteModal && taskToDelete && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-800">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600" size={32} />
              </div>
              <h3 className="text-2xl font-black dark:text-white mb-2">Vazifani O'chirish</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                <strong>"{taskToDelete.title}"</strong> vazifasini o'chirishni xohlaysizmi?
              </p>
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                  <AlertCircle size={20} />
                  <span className="font-semibold">Ogohlantirish!</span>
                </div>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  Bu amal o'chirib bo'lmaydi va vazifaga barcha topshiriqlar ham o'chib ketadi.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setTaskToDelete(null);
                  }}
                  className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-all"
                >
                  Bekor Qilish
                </button>
                <button
                  onClick={confirmDeleteTask}
                  className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all"
                >
                  O'chirish
                </button>
              </div>
            </div>
=======
  const fetchSubmissions = async () => {
    try {
      const params = groupFilter ? { group_id: groupFilter } : {};
      const response = await api.get('/tasks/submissions/all', { params });
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, formData);
      } else {
        await api.post('/tasks', formData);
      }
      setShowModal(false);
      setEditingTask(null);
      resetForm();
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      alert(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleGrade = async () => {
    try {
      await api.put(`/tasks/submissions/${selectedSubmission._id}/grade`, {
        score: parseInt(gradeData.score),
        feedback: gradeData.feedback
      });
      setShowGradeModal(false);
      setSelectedSubmission(null);
      setGradeData({ score: '', feedback: '' });
      fetchSubmissions();
    } catch (error) {
      console.error('Error grading:', error);
      alert(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      image_url: task.image_url || '',
      group_id: task.group_id._id || task.group_id,
      max_score: task.max_score
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Vazifani o\'chirishni tasdiqlaysizmi?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      group_id: '',
      max_score: 100
    });
  };

  const openGradeModal = (submission) => {
    setSelectedSubmission(submission);
    setGradeData({
      score: submission.score || '',
      feedback: submission.feedback || ''
    });
    setShowGradeModal(true);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'from-emerald-400 to-green-500';
    if (score >= 40) return 'from-amber-400 to-orange-500';
    return 'from-red-400 to-rose-500';
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return 'Juda ajoyib';
    if (score >= 40) return 'Yaxshi';
    return 'Yomon';
  };

  const pendingSubmissions = submissions.filter(s => s.status === 'PENDING');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Vazifalar
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {tasks.length} ta vazifa • {pendingSubmissions.length} ta tekshirilmagan
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
          >
            <option value="">Barcha guruhlar</option>
            {groups.map(group => (
              <option key={group._id} value={group._id}>{group.name}</option>
            ))}
          </select>

          {isAdmin && (
            <button
              onClick={() => {
                setEditingTask(null);
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
            >
              <Plus size={20} />
              Yangi vazifa
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'tasks'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileCode size={18} />
            Vazifalar
          </div>
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === 'submissions'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle size={18} />
            Topshiriqlar
            {pendingSubmissions.length > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {pendingSubmissions.length}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task, index) => (
            <div 
              key={task._id} 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden card-hover animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {task.image_url && (
                <img 
                  src={task.image_url} 
                  alt={task.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {task.title}
                  </h3>
                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg text-xs">
                    {task.max_score} ball
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                  {task.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Users size={14} />
                    {task.group_id?.name}
                  </span>
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(task)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
              <FileCode className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
              <p className="text-gray-500 dark:text-gray-400">Vazifalar topilmadi</p>
            </div>
          )}
        </div>
      )}

      {/* Submissions Tab */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          {submissions.map((submission, index) => (
            <div 
              key={submission._id} 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {submission.student_id?.full_name}
                    </h3>
                    {submission.status === 'PENDING' ? (
                      <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-xs flex items-center gap-1">
                        <Clock size={12} />
                        Tekshirilmagan
                      </span>
                    ) : (
                      <span className={`px-2 py-1 rounded-lg text-xs text-white bg-gradient-to-r ${getScoreColor(submission.score)} flex items-center gap-1`}>
                        <Star size={12} />
                        {submission.score} ball - {getScoreLabel(submission.score)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">{submission.task_id?.title}</span>
                    {' • '}
                    {submission.task_id?.group_id?.name}
                    {' • '}
                    {format(new Date(submission.submitted_at), 'dd.MM.yyyy HH:mm')}
                  </p>
                  {submission.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                      "{submission.description}"
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openGradeModal(submission)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                      submission.status === 'PENDING'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    <Eye size={16} />
                    {submission.status === 'PENDING' ? 'Baholash' : 'Ko\'rish'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {submissions.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
              <CheckCircle className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
              <p className="text-gray-500 dark:text-gray-400">Topshiriqlar topilmadi</p>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Task Modal */}
      {showModal && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-fade-in-up max-h-[calc(100vh-2rem)] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingTask ? 'Vazifani tahrirlash' : 'Yangi vazifa'}
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
                  Vazifa nomi *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  placeholder="Masalan: HTML button yaratish"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tavsif *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all resize-none"
                  placeholder="Vazifa haqida batafsil ma'lumot..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rasm URL (ixtiyoriy)
                </label>
                <div className="relative">
                  <Image size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Guruh *
                  </label>
                  <select
                    value={formData.group_id}
                    onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  >
                    <option value="">Tanlang</option>
                    {groups.map(group => (
                      <option key={group._id} value={group._id}>{group.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maksimal ball
                  </label>
                  <input
                    type="number"
                    value={formData.max_score}
                    onChange={(e) => setFormData({ ...formData, max_score: parseInt(e.target.value) })}
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  />
                </div>
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
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  {editingTask ? 'Saqlash' : 'Qo\'shish'}
                </button>
              </div>
            </form>
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
          </div>
        </div>
      )}

<<<<<<< HEAD
      {/* C. IMAGE FULL PREVIEW */}
      {previewImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <button onClick={() => setPreviewImage(null)} className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"><X size={32} /></button>
          <img src={previewImage} className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" alt="Full Preview" />
        </div>
      )}

    </div>
  );
}
=======
      {/* Grade Modal */}
      {showGradeModal && selectedSubmission && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-fade-in-up max-h-[calc(100vh-2rem)] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Vazifani baholash
              </h2>
              <button
                onClick={() => setShowGradeModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <FileCode className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {selectedSubmission.student_id?.full_name}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedSubmission.task_id?.title}</p>
                </div>
              </div>

              {/* Code Preview */}
              <div className="bg-gray-900 rounded-xl overflow-hidden mb-4">
                <div className="px-4 py-2 bg-gray-800 text-gray-400 text-sm flex items-center gap-2">
                  <Code size={16} />
                  Kod
                </div>
                <pre className="p-4 text-sm text-gray-100 overflow-x-auto max-h-60">
                  <code>{selectedSubmission.code}</code>
                </pre>
              </div>

              {selectedSubmission.description && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">O'quvchi izohi:</span> {selectedSubmission.description}
                  </p>
                </div>
              )}
            </div>

            {isAdmin && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ball (0-100)
                  </label>
                  <div className="flex gap-2">
                    {[0, 25, 40, 50, 70, 85, 100].map(score => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setGradeData({ ...gradeData, score: score.toString() })}
                        className={`px-3 py-2 rounded-lg font-medium transition-all ${
                          parseInt(gradeData.score) === score
                            ? `text-white bg-gradient-to-r ${getScoreColor(score)}`
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={gradeData.score}
                    onChange={(e) => setGradeData({ ...gradeData, score: e.target.value })}
                    min="0"
                    max="100"
                    className="w-full mt-2 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    placeholder="Yoki o'zingiz kiriting..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Izoh (ixtiyoriy)
                  </label>
                  <textarea
                    value={gradeData.feedback}
                    onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all resize-none"
                    placeholder="O'quvchiga izoh yozing..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowGradeModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={handleGrade}
                    disabled={!gradeData.score}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    <Trophy className="inline mr-2" size={18} />
                    Baholash
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
