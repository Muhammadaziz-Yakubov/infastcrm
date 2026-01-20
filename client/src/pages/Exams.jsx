import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Modal from '../components/Modal';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Send,
  Clock,
  Calendar,
  Users,
  BarChart3,
  Play,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Timer
} from 'lucide-react';

export default function Exams() {
  const [exams, setExams] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [examStats, setExamStats] = useState(null);
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    group_id: '',
    total_points: 100,
    duration: 60,
    start_date: '',
    end_date: '',
    status: 'DRAFT'
  });

  const [questionForm, setQuestionForm] = useState({
    question_text: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    points: 1
  });

  const statusColors = {
    'DRAFT': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    'PUBLISHED': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'FINISHED': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
  };

  const statusLabels = {
    'DRAFT': 'Qoralama',
    'PUBLISHED': 'Nashr etilgan',
    'FINISHED': 'Tugagan'
  };

  useEffect(() => {
    fetchExams();
    fetchGroups();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await api.get('/exams');
      setExams(response.data);
    } catch (error) {
      console.error('Error fetching exams:', error);
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
      if (editingExam) {
        await api.put(`/exams/${editingExam._id}`, formData);
      } else {
        await api.post('/exams', formData);
      }

      fetchExams();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving exam:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Form data:', formData);

      // Show detailed error message
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Detailed error:', errorMessage);
      alert('Xatolik yuz berdi: ' + errorMessage);
    }
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      description: exam.description,
      group_id: exam.group_id._id || exam.group_id,
      total_points: exam.total_points || 100,
      duration: exam.duration || 60,
      start_date: exam.start_date ? new Date(exam.start_date).toISOString().slice(0, 16) : '',
      end_date: exam.end_date ? new Date(exam.end_date).toISOString().slice(0, 16) : '',
      status: exam.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Imtihonni o\'chirishni tasdiqlaysizmi?')) return;
    try {
      await api.delete(`/exams/${id}`);
      fetchExams();
    } catch (error) {
      console.error('Error deleting exam:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestionIndex !== null) {
        await api.put(`/exams/${selectedExam._id}/questions/${editingQuestionIndex}`, questionForm);
      } else {
        await api.post(`/exams/${selectedExam._id}/questions`, questionForm);
      }

      // Refresh exam data
      const examResponse = await api.get(`/exams/${selectedExam._id}`);
      setSelectedExam(examResponse.data);

      setEditingQuestionIndex(null);
      resetQuestionForm();
    } catch (error) {
      console.error('Error adding question:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const handleEditQuestion = (question, index) => {
    setEditingQuestionIndex(index);
    setQuestionForm({
      question_text: question.question_text,
      options: Array.isArray(question.options) ? question.options : ['', '', '', ''],
      correct_answer: question.correct_answer ?? 0,
      points: question.points ?? 1
    });
  };

  const handleDeleteQuestion = async (questionIndex) => {
    if (!confirm('Savolni o\'chirishni tasdiqlaysizmi?')) return;
    try {
      await api.delete(`/exams/${selectedExam._id}/questions/${questionIndex}`);

      // Refresh exam data
      const examResponse = await api.get(`/exams/${selectedExam._id}`);
      setSelectedExam(examResponse.data);
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const handleViewResults = async (exam) => {
    try {
      const [resultsResponse, statsResponse] = await Promise.all([
        api.get(`/exams/${exam._id}/results`),
        api.get(`/exams/${exam._id}/stats`)
      ]);

      setSelectedExam(exam);
      setExamResults(resultsResponse.data);
      setExamStats(statsResponse.data);
      setShowResultsModal(true);
    } catch (error) {
      console.error('Error fetching results:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      group_id: '',
      total_points: 100,
      duration: 60,
      start_date: '',
      end_date: '',
      status: 'DRAFT'
    });
    setEditingExam(null);
  };

  const resetQuestionForm = () => {
    setQuestionForm({
      question_text: '',
      options: ['', '', '', ''],
      correct_answer: 0,
      points: 1
    });
  };

  const openQuestionModal = (exam) => {
    setSelectedExam(exam);
    setEditingQuestionIndex(null);
    resetQuestionForm();
    setShowQuestionModal(true);
  };

  const handleSendResults = async (exam) => {
    if (!confirm('Natijalarni Telegram guruhiga yuborishni tasdiqlaysizmi?')) return;
    try {
      await api.post(`/exams/${exam._id}/send-results`);
      alert('Natijalar Telegram guruhiga yuborildi');
    } catch (error) {
      console.error('Error sending exam results:', error);
      const msg = error.response?.data?.message || 'Xatolik yuz berdi';
      alert(msg);
    }
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Imtihonlar</h1>
        <p className="text-gray-600 dark:text-gray-400">Imtihonlarni boshqarish va natijalarni ko'rish</p>
      </div>

      {/* Header Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Jami imtihonlar: <span className="font-semibold text-gray-900 dark:text-white">{exams.length}</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Nashr etilgan: <span className="font-semibold text-green-600 dark:text-green-400">
                {exams.filter(e => e.status === 'PUBLISHED').length}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn-primary flex items-center gap-2 px-5 py-3 rounded-xl font-semibold"
          >
            <Plus size={20} />
            Yangi imtihon
          </button>
        </div>
      </div>

      {/* Exams List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Imtihon
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Guruh
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Davomiyligi
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ball
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Vaqt
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {exams.map((exam) => (
                <tr key={exam._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {exam.title}
                      </p>
                      {exam.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {exam.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {exam.group_id?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center gap-1">
                      <Timer size={14} className="text-gray-400" />
                      {exam.duration} daqiqa
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center gap-1">
                      <BarChart3 size={14} className="text-gray-400" />
                      {exam.total_points} ball
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(exam.start_date).toLocaleDateString('uz-UZ')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(exam.start_date).toLocaleTimeString('uz-UZ', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[exam.status]}`}>
                      {statusLabels[exam.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openQuestionModal(exam)}
                        className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                        title="Savollar"
                      >
                        <FileText size={16} />
                      </button>
                      <button
                        onClick={() => handleViewResults(exam)}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        title="Natijalar"
                      >
                        <BarChart3 size={16} />
                      </button>
                      <button
                        onClick={() => handleSendResults(exam)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Yuborish"
                      >
                        <Send size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(exam)}
                        className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                        title="Tahrirlash"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(exam._id)}
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

      {/* Exam Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingExam ? 'Imtihonni tahrirlash' : 'Yangi imtihon qo\'shish'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Imtihon nomi
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tavsif
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="DRAFT">Qoralama</option>
                  <option value="PUBLISHED">Nashr etilgan</option>
                  <option value="FINISHED">Tugagan</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Umumiy ball
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.total_points ?? 0}
                  disabled
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Davomiyligi (daqiqa)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.duration || 60}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Boshlanish vaqti
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tugash vaqti
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
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
              {editingExam ? 'Saqlash' : 'Qo\'shish'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Question Modal */}
      <Modal
        isOpen={showQuestionModal}
        onClose={() => {
          setShowQuestionModal(false);
          setSelectedExam(null);
          setEditingQuestionIndex(null);
        }}
        title="Savol qo'shish"
        size="lg"
      >
        <div className="space-y-6">
          {/* Existing Questions */}
          {selectedExam && selectedExam.questions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Mavjud savollar ({selectedExam.questions.length})
              </h3>
              <div className="space-y-3">
                {selectedExam.questions.map((question, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white mb-2">
                          {index + 1}. {question.question_text}
                        </p>
                        <div className="space-y-1">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className={`text-sm ${optIndex === question.correct_answer
                              ? 'text-green-600 dark:text-green-400 font-medium'
                              : 'text-gray-600 dark:text-gray-400'
                              }`}>
                              {String.fromCharCode(65 + optIndex)}. {option}
                              {optIndex === question.correct_answer && ' ✅'}
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Ball: {question.points}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEditQuestion(question, index)}
                          className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                          title="Tahrirlash"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(index)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="O'chirish"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Question Form */}
          <form onSubmit={handleAddQuestion}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingQuestionIndex !== null ? 'Savolni tahrirlash' : 'Yangi savol qo\'shish'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Savol matni
                </label>
                <textarea
                  rows={3}
                  required
                  value={questionForm.question_text}
                  onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Javob variantlari
                </label>
                <div className="space-y-2">
                  {questionForm.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <input
                        type="text"
                        required
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...questionForm.options];
                          newOptions[index] = e.target.value;
                          setQuestionForm({ ...questionForm, options: newOptions });
                        }}
                        className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder={`Variant ${index + 1}`}
                      />
                      <input
                        type="radio"
                        name="correct_answer"
                        checked={questionForm.correct_answer === index}
                        onChange={() => setQuestionForm({ ...questionForm, correct_answer: index })}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Savol balli
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={questionForm.points || 1}
                  onChange={(e) => setQuestionForm({ ...questionForm, points: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowQuestionModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary px-4 py-3 rounded-xl font-medium"
              >
                {editingQuestionIndex !== null ? 'Saqlash' : 'Savol qo\'shish'}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Results Modal */}
      <Modal
        isOpen={showResultsModal}
        onClose={() => {
          setShowResultsModal(false);
          setSelectedExam(null);
          setExamResults([]);
          setExamStats(null);
        }}
        title={`${selectedExam?.title} - Natijalar`}
        size="xl"
      >
        {examStats && (
          <div className="space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-blue-600 dark:text-blue-400">Jami o'quvchilar</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{examStats.totalStudents}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p className="text-sm text-green-600 dark:text-green-400">Topshirganlar</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-300">{examStats.completedStudents}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <p className="text-sm text-purple-600 dark:text-purple-400">O'rtacha ball</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">{examStats.averageScore}</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                <p className="text-sm text-orange-600 dark:text-orange-400">O'rtacha foiz</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">{examStats.averagePercentage}%</p>
              </div>
            </div>

            {/* Results Table */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                O'quvchilar natijalari
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        O'quvchi
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Ball
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Foiz
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Vaqt
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {examResults.map((result) => (
                      <tr key={result._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {result.student_id.full_name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {result.student_id.phone}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {result.score}/{selectedExam.total_points}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${result.percentage}%` }}
                              />
                            </div>
                            <span>{result.percentage.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {Math.floor(result.time_taken / 60)}:{(result.time_taken % 60).toString().padStart(2, '0')}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${result.status === 'FINISHED'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : result.status === 'TIME_EXPIRED'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            }`}>
                            {result.status === 'FINISHED' ? 'Tugagan' :
                              result.status === 'TIME_EXPIRED' ? 'Vaqt tugagan' : 'Boshlangan'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
