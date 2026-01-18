import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Modal from '../components/Modal';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Calendar,
  Clock,
  Target,
  Upload,
  Image as ImageIcon,
  Video,
  File,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  Star
} from 'lucide-react';

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [gradingData, setGradingData] = useState({});
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

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

  useEffect(() => {
    fetchTasks();
    fetchGroups();
  }, [statusFilter, groupFilter, searchTerm]);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (groupFilter) params.append('group_id', groupFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await api.get(`/tasks?${params}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
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
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('group_id', formData.group_id);
      formDataToSend.append('max_score', formData.max_score);
      formDataToSend.append('status', formData.status);
      
      if (formData.deadline) {
        formDataToSend.append('deadline', formData.deadline);
      }
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      let response;
      if (selectedTask) {
        response = await api.put(`/tasks/${selectedTask._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await api.post('/tasks', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      alert(selectedTask ? 'Vazifa muvaffaqiyatli yangilandi!' : 'Vazifa muvaffaqiyatli yaratildi!');
      setShowModal(false);
      resetForm();
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Xatolik yuz berdi: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (task) => {
    console.log('handleEdit called with task:', task);
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      group_id: task.group_id._id || task.group_id,
      deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
      max_score: task.max_score,
      status: task.status
    });
    setImagePreview(task.image_url || '');
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Vazifani o\'chirishni tasdiqlaysizmi?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      alert('Vazifa muvaffaqiyatli o\'chirildi!');
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      group_id: '',
      deadline: '',
      max_score: 100,
      status: 'ACTIVE'
    });
    setImageFile(null);
    setImagePreview('');
    setSelectedTask(null);
  };

  const fetchSubmissions = async (taskId) => {
    try {
      const response = await api.get(`/tasks/${taskId}/submissions`);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleViewSubmissions = (task) => {
    console.log('handleViewSubmissions called with task:', task);
    setSelectedTask(task);
    setShowSubmissionsModal(true);
    fetchSubmissions(task._id);
  };

  const handleGradeSubmission = async (submissionId) => {
    const grading = gradingData[submissionId];
    if (!grading || !grading.score) {
      alert('Iltimos, ballni kiriting!');
      return;
    }
    
    try {
      await api.post(`/tasks/submissions/${submissionId}/grade`, {
        score: parseInt(grading.score),
        feedback: grading.feedback || ''
      });
      alert('Baholandi muvaffaqiyatli saqlandi!');
      
      // Clear grading data for this submission
      setGradingData(prev => {
        const newData = { ...prev };
        delete newData[submissionId];
        return newData;
      });
      
      fetchSubmissions(selectedTask._id);
    } catch (error) {
      console.error('Error grading submission:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'CLOSED': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Sizda bu sahifaga kirish huquqi yo'q</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <FileText className="text-blue-500" />
              Vazifalar
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Guruhlarga vazifalar berish va baholash</p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus size={20} />
            Yangi vazifa
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Barcha holatlar</option>
            <option value="ACTIVE">Faol</option>
            <option value="CLOSED">Yopiq</option>
          </select>

          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Barcha guruhlar</option>
            {groups.map(group => (
              <option key={group._id} value={group._id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Vazifalar topilmadi</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter || groupFilter ? 'Filter natijalari bo\'sh' : 'Hozircha vazifalar yo\'q'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {task.image_url && (
                <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 relative overflow-hidden">
                  <img
                    src={task.image_url}
                    alt={task.title}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setPreviewImage(task.image_url)}
                    onError={(e) => {
                      console.log('Image load error:', task.image_url);
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {task.title}
                      </h3>
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                        {task.status === 'ACTIVE' ? 'Faol' : 'Yopiq'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {task.description}
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>{task.group_id?.name || 'Guruh yo\'q'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target size={16} />
                        <span>{task.max_score} ball</span>
                      </div>
                      {task.deadline && (
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{new Date(task.deadline).toLocaleDateString('uz-UZ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewSubmissions(task);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
                  >
                    <Eye size={16} />
                    Yuborilganlar
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(task);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors w-full sm:w-auto"
                  >
                    <Edit size={16} />
                    Tahrirlash
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(task._id);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto"
                  >
                    <Trash2 size={16} />
                    O'chirish
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Task Modal */}
      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {selectedTask ? 'Vazifani tahrirlash' : 'Yangi vazifa'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sarlavha *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Vazifa sarlavhasi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Guruh *
                  </label>
                  <select
                    value={formData.group_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, group_id: e.target.value }))}
                    required
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Guruhni tanlang</option>
                    {groups.map(group => (
                      <option key={group._id} value={group._id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tavsif
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Vazifa haqida to'liqma tavsifi..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Muddat
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maksimum ball
                  </label>
                  <input
                    type="number"
                    value={formData.max_score}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_score: parseInt(e.target.value) || 100 }))}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Holat
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="ACTIVE">Faol</option>
                    <option value="CLOSED">Yopiq</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rasm (ixtiyoriy)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6">
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg mb-2"
                      />
                    ) : (
                      <ImageIcon size={48} className="text-gray-400 mb-2" />
                    )}
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                      {imagePreview ? 'Rasmni almashtirish uchun bosing' : 'Rasm tanlang'}
                    </p>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-primary py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saqlanmoqda...' : (selectedTask ? 'Yangilash' : 'Yaratish')}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Submissions Modal */}
      {showSubmissionsModal && selectedTask && (
        <Modal isOpen={showSubmissionsModal} onClose={() => setShowSubmissionsModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 max-w-4xl lg:max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedTask.title} - Yuborilganlar
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Jami yuborilganlar: {submissions.length} ta
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Maksimum ball: {selectedTask.max_score}
                </span>
              </div>
            </div>
            
            {submissions.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Yuborilgan vazifalar yo'q
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Hozircha hech kim bu vazifani yubormagan
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission, index) => (
                  <div key={submission._id} className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-600">
                    {/* Student Info Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-base md:text-lg">
                            {submission.student_id?.full_name || 'Noma\'lum talaba'}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {submission.student_id?.phone || 'Telefon raqami yo\'q'}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Yuborilgan vaqt: {new Date(submission.submitted_at).toLocaleString('uz-UZ')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {submission.status === 'GRADED' ? (
                          <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-3">
                            <div className={`text-2xl font-bold ${getScoreColor(submission.score)}`}>
                              {submission.score}/{selectedTask.max_score}
                            </div>
                            <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                              ✅ Baholangan
                            </div>
                          </div>
                        ) : (
                          <div className="bg-orange-100 dark:bg-orange-900/20 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                              <Clock size={16} />
                              <span className="font-medium">Baholashni kutmoqda</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Description */}
                    {submission.description && (
                      <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          📝 Talabaning izohi:
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          {submission.description}
                        </p>
                      </div>
                    )}
                    
                    {/* Files */}
                    {submission.submitted_files && submission.submitted_files.length > 0 && (
                      <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          📎 Yuborilgan fayllar:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {submission.submitted_files.map((file, fileIndex) => (
                            <div
                              key={fileIndex}
                              className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                  {file.mime_type?.startsWith('image/') ? (
                                    <img 
                                      src={file.file_path} 
                                      alt={file.original_name}
                                      className="w-6 h-6 object-cover rounded"
                                      onClick={() => setPreviewImage(file.file_path)}
                                      style={{ cursor: 'pointer' }}
                                    />
                                  ) : file.mime_type?.startsWith('video/') ? (
                                    <Video size={20} className="text-purple-600 dark:text-purple-400" />
                                  ) : (
                                    <File size={20} className="text-gray-600 dark:text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {file.original_name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {(file.file_size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>
                              <a
                                href={file.file_path}
                                download={file.original_name}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                title="Yuklab olish"
                              >
                                <Download size={16} />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Feedback for graded submissions */}
                    {submission.feedback && (
                      <div className="mb-4 bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                        <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                          💬 Fikr-mulohaza:
                        </h4>
                        <p className="text-green-700 dark:text-green-300">
                          {submission.feedback}
                        </p>
                      </div>
                    )}
                    
                    {/* Grading Form */}
                    {submission.status === 'PENDING' && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                        <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-3">
                          📊 Baholash:
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Ball (0-{selectedTask.max_score})
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={selectedTask.max_score}
                              value={gradingData[submission._id]?.score || ''}
                              onChange={(e) => setGradingData(prev => ({
                                ...prev,
                                [submission._id]: {
                                  ...prev[submission._id],
                                  score: e.target.value
                                }
                              }))}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Ballni kiriting"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Fikr-mulohaza (ixtiyoriy)
                            </label>
                            <textarea
                              rows={2}
                              value={gradingData[submission._id]?.feedback || ''}
                              onChange={(e) => setGradingData(prev => ({
                                ...prev,
                                [submission._id]: {
                                  ...prev[submission._id],
                                  feedback: e.target.value
                                }
                              }))}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              placeholder="Fikr-mulohazangizni yozing..."
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => handleGradeSubmission(submission._id)}
                            disabled={!gradingData[submission._id]?.score}
                            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            <CheckCircle size={18} className="inline mr-2" />
                            Baholashni saqlash
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <Modal isOpen={!!previewImage} onClose={() => setPreviewImage(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-auto rounded-lg"
            />
            <div className="mt-4 text-center">
              <button
                onClick={() => setPreviewImage(null)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Yopish
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
