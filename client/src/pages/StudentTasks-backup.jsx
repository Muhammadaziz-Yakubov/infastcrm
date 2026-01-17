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
  AlertCircle
} from 'lucide-react';

export default function StudentTasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const isStudent = user?.role === 'STUDENT';

  const [submitData, setSubmitData] = useState({
    description: '',
    files: []
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const studentToken = localStorage.getItem('studentToken');
      const response = await api.get('/tasks/student', {
        headers: studentToken ? { Authorization: `Bearer ${studentToken}` } : {}
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid, redirect to login
        localStorage.removeItem('studentToken');
        window.location.href = '/student-login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;

    setSubmitting(true);
    try {
      const studentToken = localStorage.getItem('studentToken');
      const formData = new FormData();
      formData.append('description', submitData.description);
      
      submitData.files.forEach(file => {
        formData.append('files', file);
      });

      const response = await api.post(`/tasks/${selectedTask._id}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(studentToken && { Authorization: `Bearer ${studentToken}` })
        }
      });

      alert('Vazifa muvaffaqiyatli yuborildi!');
      setShowSubmitModal(false);
      setSubmitData({ description: '', files: [] });
      setSelectedTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Error submitting task:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('studentToken');
        window.location.href = '/student-login';
      } else {
        alert('Xatolik yuz berdi: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSubmitData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const removeFile = (index) => {
    setSubmitData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const getStatusColor = (task) => {
    if (task.submitted) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    }
    if (new Date(task.deadline) < new Date()) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    }
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
  };

  const getStatusText = (task) => {
    if (task.submitted) return 'Yuborilgan';
    if (new Date(task.deadline) < new Date()) return 'Muddati o\'tgan';
    return 'Bajarilishi kerak';
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <FileText className="text-blue-500" />
          Vazifalar
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Guruhingizga berilgan vazifalar</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative w-full lg:w-96">
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

      {/* Tasks Grid */}
      <div className="grid gap-6">
        {filteredTasks.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Vazifalar topilmadi</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Qidiruv natijalari bo\'sh' : 'Hozircha vazifalar yo\'q'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              onClick={() => handleTaskClick(task)}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-blue-200 dark:hover:border-blue-800 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {task.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {task.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
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

                  <div className="flex items-center gap-3">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(task)}`}>
                      {getStatusText(task)}
                    </span>
                    
                    {task.submitted && (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle size={16} />
                        <span className="text-sm font-medium">
                          {task.submission.score ? `${task.submission.score}/${task.max_score} ball` : 'Baholangan'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {task.image_url && (
                  <div className="ml-4">
                    <img
                      src={task.image_url}
                      alt={task.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Task Details Modal */}
      {showTaskModal && selectedTask && (
        <Modal onClose={() => setShowTaskModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {selectedTask.title}
            </h2>
            
            {selectedTask.image_url && (
              <img
                src={selectedTask.image_url}
                alt={selectedTask.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}
            
            <div className="prose dark:prose-invert max-w-none mb-6">
              <p className="text-gray-700 dark:text-gray-300">
                {selectedTask.description}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <Target size={16} />
                  <span>Maksimum ball</span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedTask.max_score}
                </p>
              </div>
              
              {selectedTask.deadline && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <Calendar size={16} />
                    <span>Muddat</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {new Date(selectedTask.deadline).toLocaleDateString('uz-UZ')}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowTaskModal(false);
                  setShowSubmitModal(true);
                }}
                disabled={selectedTask.submitted}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  selectedTask.submitted
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {selectedTask.submitted ? 'Yuborilgan' : 'Vazifani yuborish'}
              </button>
              
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Yopish
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Submit Task Modal */}
      {showSubmitModal && selectedTask && (
        <Modal onClose={() => setShowSubmitModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Vazifani yuborish: {selectedTask.title}
            </h2>
            
            <form onSubmit={handleSubmitTask}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Izoh (ixtiyoriy)
                </label>
                <textarea
                  value={submitData.description}
                  onChange={(e) => setSubmitData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Vazifa haqida qo'shimcha izoh..."
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fayllar (rasmlar, videolar, hujjatlar)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Upload size={48} className="text-gray-400 mb-2" />
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                      Fayllarni tanlang yoki bu yerga torting
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Rasm, video, PDF, DOC, ZIP (maks. 10MB)
                    </p>
                  </label>
                </div>
                
                {submitData.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tanlangan fayllar:
                    </p>
                    {submitData.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          {file.type.startsWith('image/') ? (
                            <ImageIcon size={20} className="text-blue-500" />
                          ) : file.type.startsWith('video/') ? (
                            <Video size={20} className="text-purple-500" />
                          ) : (
                            <File size={20} className="text-gray-500" />
                          )}
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                            {file.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting || submitData.files.length === 0}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    submitting || submitData.files.length === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {submitting ? 'Yuborilmoqda...' : 'Yuborish'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
