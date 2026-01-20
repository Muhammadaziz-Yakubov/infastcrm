import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Modal from '../components/Modal';
import {
    Brain,
    Plus,
    Edit,
    Trash2,
    Calendar,
    Clock,
    Timer,
    BarChart3,
    FileText,
    Users
} from 'lucide-react';

export default function Quizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [quizResults, setQuizResults] = useState([]);
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        group_id: '',
        duration: 15,
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

    useEffect(() => {
        fetchQuizzes();
        fetchGroups();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const response = await api.get('/quizzes');
            setQuizzes(response.data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
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
        try {
            if (editingQuiz) {
                await api.put(`/quizzes/${editingQuiz._id}`, formData);
            } else {
                await api.post('/quizzes', formData);
            }
            fetchQuizzes();
            setShowModal(false);
            resetForm();
        } catch (error) {
            alert('Xatolik: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (quiz) => {
        setEditingQuiz(quiz);
        setFormData({
            title: quiz.title,
            description: quiz.description,
            group_id: quiz.group_id._id || quiz.group_id,
            duration: quiz.duration,
            start_date: quiz.start_date ? new Date(quiz.start_date).toISOString().slice(0, 16) : '',
            end_date: quiz.end_date ? new Date(quiz.end_date).toISOString().slice(0, 16) : '',
            status: quiz.status
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('O\'chirishni tasdiqlaysizmi?')) return;
        try {
            await api.delete(`/quizzes/${id}`);
            fetchQuizzes();
        } catch (error) {
            console.error('Error deleting quiz:', error);
        }
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        try {
            const updatedQuiz = { ...selectedQuiz };
            if (editingQuestionIndex !== null) {
                updatedQuiz.questions[editingQuestionIndex] = questionForm;
            } else {
                updatedQuiz.questions.push(questionForm);
            }

            const response = await api.put(`/quizzes/${selectedQuiz._id}`, { questions: updatedQuiz.questions });
            setSelectedQuiz(response.data);
            setEditingQuestionIndex(null);
            resetQuestionForm();
        } catch (error) {
            alert('Savol qo\'shishda xatolik');
        }
    };

    const handleDeleteQuestion = async (index) => {
        if (!confirm('Savolni o\'chirishni tasdiqlaysizmi?')) return;
        try {
            const updatedQuestions = selectedQuiz.questions.filter((_, i) => i !== index);
            const response = await api.put(`/quizzes/${selectedQuiz._id}`, { questions: updatedQuestions });
            setSelectedQuiz(response.data);
        } catch (error) {
            alert('Xatolik');
        }
    };

    const handleViewResults = async (quiz) => {
        try {
            const response = await api.get(`/quizzes/${quiz._id}/results`);
            setQuizResults(response.data);
            setSelectedQuiz(quiz);
            setShowResultsModal(true);
        } catch (error) {
            alert("Natijalarni yuklashda xatolik");
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            group_id: '',
            duration: 15,
            start_date: '',
            end_date: '',
            status: 'DRAFT'
        });
        setEditingQuiz(null);
    };

    const resetQuestionForm = () => {
        setQuestionForm({
            question_text: '',
            options: ['', '', '', ''],
            correct_answer: 0
        });
    };

    const openQuestionModal = (quiz) => {
        setSelectedQuiz(quiz);
        setShowQuestionModal(true);
        resetQuestionForm();
        setEditingQuestionIndex(null);
    };

    if (!isAdmin) return <div className="p-6 text-center">Ruxsat yo'q</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold dark:text-white">Quiz (Dars testlari)</h1>
                    <p className="text-gray-500">Darsdan keyingi 5-talik testlarni boshqarish</p>
                </div>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center gap-2 px-5 py-3 rounded-xl">
                    <Plus size={20} /> Yangi Quiz
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-4">Mavzu</th>
                            <th className="px-6 py-4">Guruh</th>
                            <th className="px-6 py-4">Vaqt</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Amallar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {quizzes.map(quiz => (
                            <tr key={quiz._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 font-medium dark:text-white">{quiz.title}</td>
                                <td className="px-6 py-4">{quiz.group_id?.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1"><Calendar size={14} /> {new Date(quiz.start_date).toLocaleDateString()}</div>
                                    <div className="flex items-center gap-1"><Clock size={14} /> {new Date(quiz.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${quiz.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>{quiz.status}</span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-3">
                                    <button onClick={() => openQuestionModal(quiz)} className="text-blue-600 hover:scale-110 transition-transform inline-block"><FileText size={18} /></button>
                                    <button onClick={() => handleViewResults(quiz)} className="text-purple-600 hover:scale-110 transition-transform inline-block"><BarChart3 size={18} /></button>
                                    <button onClick={() => handleEdit(quiz)} className="text-indigo-600 hover:scale-110 transition-transform inline-block"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(quiz._id)} className="text-red-600 hover:scale-110 transition-transform inline-block"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Main Quiz Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingQuiz ? "Tahrirlash" : "Yangi Quiz"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Mavzu nomi</label>
                        <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 border rounded-lg dark:bg-gray-700" placeholder="Masalan: React Hooks dars testi" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Guruh</label>
                        <select value={formData.group_id} onChange={e => setFormData({ ...formData, group_id: e.target.value })} className="w-full p-2 border rounded-lg dark:bg-gray-700" required>
                            <option value="">Tanlang</option>
                            {groups.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Boshlanish</label>
                            <input type="datetime-local" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} className="w-full p-2 border rounded-lg dark:bg-gray-700" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Tugash</label>
                            <input type="datetime-local" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} className="w-full p-2 border rounded-lg dark:bg-gray-700" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full p-2 border rounded-lg dark:bg-gray-700">
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full btn-primary py-3 rounded-lg font-bold">Saqlash</button>
                </form>
            </Modal>

            {/* Question Management Modal */}
            <Modal isOpen={showQuestionModal} onClose={() => setShowQuestionModal(false)} title="Test savollari" size="lg">
                <div className="space-y-6">
                    <div className="space-y-3">
                        {selectedQuiz?.questions.map((q, i) => (
                            <div key={i} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 flex justify-between items-start">
                                <div>
                                    <p className="font-bold">{i + 1}. {q.question_text}</p>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {q.options.map((o, idx) => <span key={idx} className={idx === q.correct_answer ? 'text-green-600 font-bold' : ''}>{String.fromCharCode(65 + idx)}. {o} </span>)}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setQuestionForm(q); setEditingQuestionIndex(i); }} className="text-indigo-600"><Edit size={16} /></button>
                                    <button onClick={() => handleDeleteQuestion(i)} className="text-red-600"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleAddQuestion} className="border-t pt-4 space-y-4">
                        <h3 className="font-bold">{editingQuestionIndex !== null ? 'Tahrirlash' : 'Yangi savol'}</h3>
                        <textarea value={questionForm.question_text} onChange={e => setQuestionForm({ ...questionForm, question_text: e.target.value })} className="w-full p-3 border rounded-lg dark:bg-gray-700" placeholder="Savol matni..." required />
                        <div className="grid grid-cols-2 gap-3">
                            {questionForm.options.map((opt, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <input type="radio" checked={questionForm.correct_answer === i} onChange={() => setQuestionForm({ ...questionForm, correct_answer: i })} name="correct" />
                                    <input type="text" value={opt} onChange={e => {
                                        const opts = [...questionForm.options];
                                        opts[i] = e.target.value;
                                        setQuestionForm({ ...questionForm, options: opts });
                                    }} className="flex-1 p-2 border rounded-lg dark:bg-gray-700" placeholder={`Variant ${String.fromCharCode(65 + i)}`} required />
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold">Savolni saqlash</button>
                    </form>
                </div>
            </Modal>

            {/* Results Modal */}
            <Modal isOpen={showResultsModal} onClose={() => setShowResultsModal(false)} title="Quiz natijalari" size="xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700">
                                <th className="px-4 py-2 border">O'quvchi</th>
                                <th className="px-4 py-2 border">Ball</th>
                                <th className="px-4 py-2 border">Foiz</th>
                                <th className="px-4 py-2 border">Topshirilgan vaqt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quizResults.map(r => (
                                <tr key={r._id}>
                                    <td className="px-4 py-2 border dark:border-gray-700">{r.student_id?.full_name}</td>
                                    <td className="px-4 py-2 border dark:border-gray-700 font-bold">{r.score}/{r.total_points}</td>
                                    <td className="px-4 py-2 border dark:border-gray-700">{r.percentage?.toFixed(1)}%</td>
                                    <td className="px-4 py-2 border dark:border-gray-700">{new Date(r.finished_at).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal>
        </div>
    );
}
