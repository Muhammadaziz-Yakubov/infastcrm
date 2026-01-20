import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import ExamRunner from '../components/ExamRunner';
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
  Search,
  ArrowLeft,
  Clock,
  ChevronRight,
  Download,
  AlertCircle,
  HelpCircle,
  Brain
} from 'lucide-react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';

export default function StudentTasks() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitData, setSubmitData] = useState({ description: '', files: [] });

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showQuizRunner, setShowQuizRunner] = useState(false);
  const [quizReadOnly, setQuizReadOnly] = useState(false);
  const [quizType, setQuizType] = useState('QUIZ');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const studentToken = localStorage.getItem('studentToken');
      const headers = studentToken ? { Authorization: `Bearer ${studentToken}` } : {};

      const [tasksRes, quizzesRes] = await Promise.all([
        api.get('/student-auth/tasks', { headers }),
        api.get('/student/quizzes', { headers })
      ]);

      const tasks = tasksRes.data.map(t => ({
        ...t,
        type: 'TASK',
        date: t.deadline || t.createdAt,
        sortDate: new Date(t.deadline || t.createdAt).getTime()
      }));

      const quizzes = quizzesRes.data.map(q => ({
        ...q,
        type: 'QUIZ',
        date: q.end_date,
        sortDate: new Date(q.end_date).getTime()
      }));

      const combined = [...tasks, ...quizzes].sort((a, b) => b.sortDate - a.sortDate);
      setItems(combined);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item) => {
    if (item.type === 'TASK') {
      setSelectedTask(item);
      setShowTaskModal(true);
    } else if (item.type === 'QUIZ') {
      handleQuizClick(item, 'QUIZ');
    }
  };

  const handleQuizClick = (quiz, type) => {
    const now = new Date();
    if (quiz.status === 'FINISHED' || quiz.submission?.status === 'FINISHED' || quiz.status === 'GRADED') {
      setSelectedItemId(quiz._id);
      setQuizType(type);
      setQuizReadOnly(true);
      setShowQuizRunner(true);
      return;
    }
    if (now < new Date(quiz.start_date)) {
      alert(`Boshlanish vaqti: ${format(new Date(quiz.start_date), 'dd MMM HH:mm', { locale: uz })}`);
      return;
    }
    if (now > new Date(quiz.end_date) && quiz.status !== 'STARTED') {
      alert('Muddati tugagan');
      return;
    }
    setSelectedItemId(quiz._id);
    setQuizType(type);
    setQuizReadOnly(false);
    setShowQuizRunner(true);
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('description', submitData.description);
      submitData.files.forEach(f => formData.append('files', f));
      await api.post(`/tasks/${selectedTask._id}/submit`, formData);
      alert('Yuborildi!');
      setShowSubmitModal(false);
      fetchData();
    } catch (error) {
      alert('Xatolik');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFileIcon = (file) => {
    const type = file.type || file.mime_type;
    if (type?.startsWith('image/')) return <ImageIcon size={24} className="text-blue-500" />;
    return <File size={24} className="text-gray-500" />;
  };

  const getCardColor = (type) => {
    switch (type) {
      case 'QUIZ':
        return 'bg-gradient-to-br from-blue-500 to-indigo-600';
      case 'EXAM':
        return 'bg-gradient-to-br from-red-500 to-purple-600';
      case 'TASK':
      default:
        return 'bg-indigo-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F4F8] dark:bg-gray-900 pb-20">
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b p-4">
        <div className="max-w-5xl mx-auto flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button onClick={() => window.history.back()} className="p-2 bg-gray-100 rounded-full"><ArrowLeft size={20} /></button>
              <h1 className="text-xl font-bold dark:text-white">Vazifalar va Quizlar</h1>
            </div>
            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600"><Target size={20} /></div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Qidirish..." className="w-full bg-gray-100 dark:bg-gray-700/50 pl-10 pr-4 py-3 rounded-2xl border-none" />
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {loading ? <div className="text-center py-20">Yuklanmoqda...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div key={`${item.type}-${item._id}`} onClick={() => handleItemClick(item)} className="bg-white dark:bg-gray-800 rounded-[2rem] border overflow-hidden cursor-pointer hover:shadow-lg transition-all p-1">
                <div className={`h-40 rounded-[1.8rem] relative flex items-center justify-center ${getCardColor(item.type)}`}>
                  {item.type === 'TASK' && item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" /> : <Brain size={48} className="text-white/30" />}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white bg-black/20 backdrop-blur-sm border border-white/20`}>{item.type}</span>
                    {(item.status === 'FINISHED' || item.submitted || item.status === 'GRADED') && <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white bg-green-500 shadow-lg`}>BITDI</span>}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1 truncate dark:text-white">{item.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{item.description || 'Tavsif yo\'q'}</p>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-xs font-bold text-indigo-600">{item.type === 'QUIZ' ? 100 : (item.max_score || item.total_points)} ball</span>
                    {(item.score !== undefined || item.submission?.score !== undefined) && <span className="text-xs font-bold text-green-600">{item.score ?? item.submission?.score} ball</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ExamRunner type={quizType} id={selectedItemId} isOpen={showQuizRunner} onClose={() => { setShowQuizRunner(false); setSelectedItemId(null); }} onComplete={fetchData} readOnly={quizReadOnly} />

      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="h-48 bg-gray-100 relative">
              {selectedTask.image_url ? <img src={selectedTask.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-indigo-600" />}
              <button onClick={() => setShowTaskModal(false)} className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white"><X /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">{selectedTask.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{selectedTask.description}</p>
              {selectedTask.submission && <div className="bg-green-50 p-4 rounded-xl text-green-700 font-bold">Topshirilgan: {selectedTask.submission.score || 'Baholanmoqda'}</div>}
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-700 border-t">
              {!selectedTask.submission && <button onClick={() => { setShowTaskModal(false); setShowSubmitModal(true); }} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">Vazifani topshirish</button>}
            </div>
          </div>
        </div>
      )}

      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Vazifa yuborish</h3>
            <textarea onChange={e => setSubmitData({ ...submitData, description: e.target.value })} className="w-full p-3 border rounded-xl mb-4 h-32" placeholder="Izoh..." />
            <input type="file" multiple onChange={e => setSubmitData({ ...submitData, files: Array.from(e.target.files) })} className="mb-6 block" />
            <button onClick={handleSubmitTask} disabled={submitting} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">Yuborish</button>
            <button onClick={() => setShowSubmitModal(false)} className="w-full mt-2 text-gray-500 py-2">Bekor qilish</button>
          </div>
        </div>
      )}
    </div>
  );
}