import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  Target, 
  Calendar, 
  Upload, 
  X, 
  CheckCircle, 
  Image as ImageIcon,
  Video,
  FileText,
  File,
  Archive,
  Star,
  Search,
  ArrowLeft,
  Clock,
  MoreVertical,
  ChevronRight,
  Download,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';

export default function StudentTasks() {
  // --- STATE ---
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [submitData, setSubmitData] = useState({
    description: '',
    files: []
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && previewImage) {
        setPreviewImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [previewImage]);

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

      await api.post(`/tasks/${selectedTask._id}/submit`, formData, {
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

  const getFileIcon = (file) => {
    const type = file.type || file.mime_type;
    if (type?.startsWith('image/')) return <ImageIcon size={24} className="text-blue-500" />;
    if (type?.startsWith('video/')) return <Video size={24} className="text-red-500" />;
    if (type?.includes('pdf') || type?.includes('document')) return <FileText size={24} className="text-orange-500" />;
    if (type?.includes('zip') || type?.includes('rar')) return <Archive size={24} className="text-yellow-500" />;
    return <File size={24} className="text-gray-500" />;
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- RENDERING ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2F4F8] dark:bg-gray-900">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Target size={20} className="text-indigo-600" />
          </div>
        </div>
        <p className="mt-4 text-gray-500 font-medium animate-pulse">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F4F8] dark:bg-gray-900 font-sans pb-20">
      
      {/* Mobile-style Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => window.history.back()}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 active:scale-95 transition-transform"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-none">Vazifalar</h1>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Jami {tasks.length} ta</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Target size={20} />
            </div>
          </div>

          {/* Search Bar - Modern Pill Shape */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Qidirish..."
              className="w-full bg-gray-100 dark:bg-gray-700/50 text-gray-900 dark:text-white pl-11 pr-4 py-3 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm font-medium shadow-inner"
            />
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-xl shadow-gray-200/50 dark:shadow-none mb-6">
              <Archive className="w-10 h-10 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Hech narsa topilmadi</h3>
            <p className="text-gray-500 text-sm mt-1">Hozircha vazifalar ro'yxati bo'sh</p>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                onClick={() => handleTaskClick(task)}
                className="group relative bg-white dark:bg-gray-800 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white dark:border-gray-700 overflow-hidden cursor-pointer active:scale-[0.98] transition-all duration-300"
              >
                {/* Status Badge - Floating */}
                <div className="absolute top-4 left-4 z-10">
                  {task.submitted ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/90 backdrop-blur-md text-white text-xs font-bold shadow-lg shadow-green-500/20">
                      <CheckCircle size={12} strokeWidth={3} />
                      <span>Yuborildi</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-gray-700 dark:text-gray-200 text-xs font-bold shadow-lg">
                      <Clock size={12} className="text-indigo-500" strokeWidth={2.5} />
                      <span>Jarayonda</span>
                    </div>
                  )}
                </div>

                {/* Card Image */}
                <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 relative">
                  {task.image_url ? (
                    <img
                      src={task.image_url.startsWith('http') ? task.image_url : `${import.meta.env.VITE_API_URL || 'https://infastcrm-0b2r.onrender.com'}${task.image_url.startsWith('/') ? task.image_url : '/' + task.image_url}`}
                      alt={task.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image load error:', task.image_url);
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                      <FileText className="w-16 h-16 text-white/50" />
                    </div>
                  )}
                  {/* Gradient Overlay for Text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  
                  {/* Deadline on Image */}
                  <div className="absolute bottom-4 left-4 text-white text-xs font-medium flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                    <Calendar size={12} />
                    {format(new Date(task.deadline), 'dd MMM, HH:mm', { locale: uz })}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {task.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {task.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {task.max_score} ball
                    </span>
                    <ChevronRight size={20} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Task Modal */}
      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" onClick={() => setShowTaskModal(false)} />
          <div className="relative bg-white dark:bg-gray-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            
            {/* Modal Header with Image */}
            <div className="relative h-64 bg-gray-200 dark:bg-gray-700">
              {selectedTask.image_url ? (
                <img
                  src={selectedTask.image_url.startsWith('http') ? selectedTask.image_url : `${import.meta.env.VITE_API_URL || 'https://infastcrm-0b2r.onrender.com'}${selectedTask.image_url.startsWith('/') ? selectedTask.image_url : '/' + selectedTask.image_url}`}
                  alt={selectedTask.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image load error:', selectedTask.image_url);
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                  <FileText className="w-24 h-24 text-white/30" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
               
              <button
                onClick={() => setShowTaskModal(false)}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-lg rounded-full text-white transition-all border border-white/10"
              >
                <X size={20} />
              </button>

              <div className="absolute -bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                   <div className="text-center">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Muddat</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                         {format(new Date(selectedTask.deadline), 'dd MMM', { locale: uz })}
                      </p>
                   </div>
                   <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                   <div className="text-center">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Maksimal</p>
                      <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                         {selectedTask.max_score}
                      </p>
                   </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 pt-10 overflow-y-auto custom-scrollbar">
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {selectedTask.title}
               </h2>
               
               <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-8">
                  {selectedTask.description}
               </div>

               {/* Submission Status */}
               {selectedTask.submission && (
                  <>
                     <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-5 rounded-2xl border border-green-100 dark:border-green-900/30">
                        <div className="flex items-center gap-3 mb-3">
                           <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full text-green-600 dark:text-green-300">
                              <CheckCircle size={20} />
                           </div>
                           <div>
                              <h4 className="font-bold text-gray-900 dark:text-white">Topshirildi</h4>
                              <p className="text-xs text-green-600 dark:text-green-400">
                                 {format(new Date(selectedTask.submission.submitted_at), 'dd MMMM, HH:mm', { locale: uz })}
                              </p>
                           </div>
                        </div>
                        
                        <div className="flex items-center justify-between bg-white/60 dark:bg-gray-800/60 p-3 rounded-xl mb-4">
                           <span className="text-sm text-gray-600 dark:text-gray-400">Baholanishi:</span>
                           <span className="font-bold text-lg text-green-600 dark:text-green-400">
                              {selectedTask.submission.score ? selectedTask.submission.score : '---'}
                              <span className="text-sm text-gray-400 font-normal"> / {selectedTask.max_score}</span>
                           </span>
                        </div>

                        {selectedTask.submission.description && (
                           <div className="mb-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2">Sizning izohingiz:</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 italic">{selectedTask.submission.description}</p>
                           </div>
                        )}

                        {selectedTask.submission.submitted_files && selectedTask.submission.submitted_files.length > 0 && (
                           <div className="space-y-3">
                              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Yuborilgan fayllar ({selectedTask.submission.submitted_files.length}):</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                 {selectedTask.submission.submitted_files.map((file, index) => {
                                    const fileUrl = file.file_path?.startsWith('http') ? file.file_path : `${import.meta.env.VITE_API_URL || 'https://infastcrm-0b2r.onrender.com'}${file.file_path?.startsWith('/') ? file.file_path : '/' + file.file_path}`;
                                    const isImage = file.mime_type?.includes('image');
                                    return (
                                       <div key={index} className="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                                          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
                                             {getFileIcon(file)}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                             <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.original_name}</p>
                                             <p className="text-xs text-gray-500">{(file.file_size / 1024).toFixed(1)} KB</p>
                                          </div>
                                          <div className="flex gap-2">
                                             {isImage && (
                                                <button 
                                                   onClick={() => setPreviewImage(fileUrl)} 
                                                   className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500 hover:text-indigo-600 transition-colors"
                                                >
                                                   <ImageIcon size={18} />
                                                </button>
                                             )}
                                             <a 
                                                href={fileUrl} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                             >
                                                <Download size={18} />
                                             </a>
                                          </div>
                                       </div>
                                    );
                                 })}
                              </div>
                           </div>
                        )}
                     </div>
                  </>
               )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
               {!selectedTask.submission ? (
                  <button
                     onClick={() => {
                        setShowTaskModal(false);
                        setShowSubmitModal(true);
                     }}
                     className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                     <Upload size={20} />
                     Vazifani topshirish
                  </button>
               ) : (
                  <button
                     onClick={() => setShowTaskModal(false)}
                     className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-4 rounded-xl font-bold active:scale-[0.98] transition-all"
                  >
                     Yopish
                  </button>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Submit Modal */}
      {showSubmitModal && selectedTask && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" onClick={() => setShowSubmitModal(false)} />
          <div className="relative bg-white dark:bg-gray-800 w-full sm:max-w-lg rounded-t-[2rem] sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:fade-in sm:zoom-in-95 duration-300">
            
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Javob yuborish</h3>
              <button onClick={() => setShowSubmitModal(false)} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full text-gray-500 hover:text-gray-900 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitTask} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Izoh</label>
                <textarea
                  value={submitData.description}
                  onChange={(e) => setSubmitData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 rounded-2xl border-none bg-gray-100 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all resize-none h-32"
                  placeholder="Vazifa bo'yicha izoh..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Fayllar</label>
                <div className="relative border-2 border-dashed border-indigo-200 dark:border-gray-600 bg-indigo-50/50 dark:bg-gray-700/20 rounded-2xl p-6 text-center transition-all hover:bg-indigo-50 hover:border-indigo-400 group">
                   <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                  />
                  <div className="bg-white dark:bg-gray-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                     <Upload className="text-indigo-500" size={24} />
                  </div>
                  <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">Fayllarni tanlash</p>
                  <p className="text-xs text-gray-500">yoki shu yerga tashlang</p>
                </div>
              </div>

              {/* File List */}
              {submitData.files.length > 0 && (
                <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                  {submitData.files.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-100 dark:border-gray-600">
                      <div className="bg-white dark:bg-gray-600 p-2 rounded-lg shadow-sm">
                        {getFileIcon(file)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex justify-center items-center gap-2 active:scale-[0.98]"
              >
                {submitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Tasdiqlash
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Full Screen Image Preview */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-2"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
          >
            <X size={24} />
          </button>
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}