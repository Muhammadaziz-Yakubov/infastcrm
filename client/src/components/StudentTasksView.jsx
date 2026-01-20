import { useState, useEffect } from 'react';
import api from '../utils/api';
import ExamRunner from './ExamRunner';
import {
    Target,
    Clock,
    CheckCircle,
    Brain,
    Search,
    X,
    Upload,
    FileCode,
    Calendar,
    ChevronRight,
    Target as TargetIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';

export default function StudentTasksView({ setFullScreen }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [submitData, setSubmitData] = useState({ description: '', files: [] });
    const [submitting, setSubmitting] = useState(false);

    const [selectedItemId, setSelectedItemId] = useState(null);
    const [showQuizRunner, setShowQuizRunner] = useState(false);
    const [quizReadOnly, setQuizReadOnly] = useState(false);
    const [quizType, setQuizType] = useState('QUIZ');
    const [activeTab, setActiveTab] = useState('active');

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        const backendUrl = import.meta.env.VITE_API_URL || 'https://infastcrm-0b2r.onrender.com';
        const cleanUrl = url.startsWith('/') ? url : '/' + url;
        return `${backendUrl}${cleanUrl}`;
    };

    useEffect(() => { fetchData(); }, []);

    // Auto-refresh calculation for "Recently Closed" status every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setItems(prev => [...prev]);
        }, 60000);
        return () => clearInterval(interval);
    }, []);

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
            console.error('Error fetching tasks components:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleItemClick = (item) => {
        if (item.type === 'TASK') {
            setSelectedTask(item);
            setShowTaskModal(true);
        } else {
            handleQuizClick(item, item.type);
        }
    };

    const handleQuizClick = (quiz, type) => {
        const now = new Date();
        const isCompleted = quiz.status === 'FINISHED' || quiz.submission?.status === 'FINISHED' || quiz.status === 'GRADED';

        if (isCompleted) {
            setSelectedItemId(quiz._id);
            setQuizType(type);
            setQuizReadOnly(true);
            setShowQuizRunner(true);
            if (typeof setFullScreen === 'function') setFullScreen(true);
            return;
        }

        if (quiz.start_date && now < new Date(quiz.start_date)) {
            alert(`Boshlanish vaqti: ${format(new Date(quiz.start_date), 'dd MMM HH:mm', { locale: uz })}`);
            return;
        }
        if (quiz.end_date && now > new Date(quiz.end_date) && quiz.status !== 'STARTED') {
            alert('Muddati tugagan');
            return;
        }

        setSelectedItemId(quiz._id);
        setQuizType(type);
        setQuizReadOnly(false);
        setShowQuizRunner(true);
        if (typeof setFullScreen === 'function') setFullScreen(true);
    };

    const handleSubmitTask = async (e) => {
        e.preventDefault();
        if (submitData.files.length > 5) {
            alert('Maksimal 5 ta fayl yuklash mumkin');
            return;
        }
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('description', submitData.description);
            submitData.files.forEach(f => formData.append('files', f));
            await api.post(`/tasks/${selectedTask._id}/submit`, formData);
            setShowSubmitModal(false);
            fetchData();
        } catch (error) {
            alert('Xatolik yuz berdi');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const now = new Date();
        const deadline = item.date ? new Date(item.date) : null;
        const isExpired = deadline && now > deadline;
        const isRecentlyExpired = isExpired && (now - deadline) < 600000; // 10 minutes in ms

        // The user wants tasks to stay in "Active" until they expire (deadline + 10 mins)
        // even if they are submitted.
        if (activeTab === 'completed') {
            return matchesSearch && (isExpired && !isRecentlyExpired);
        }
        // Active tab: Show items that are NOT expired OR are recently expired (within 10 mins)
        return matchesSearch && (!isExpired || isRecentlyExpired);
    });

    if (loading) return <div className="text-center py-20 animate-pulse text-gray-500">Vazifalar yuklanmoqda...</div>;

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4">
                <div>
                    <h2 className="text-2xl md:text-4xl font-black dark:text-white tracking-tighter italic uppercase bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent">Vazifalar Markazi</h2>
                    <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 ml-1 opacity-70">Bilimingizni sinovdan o'tkazing va natijalarga erishing</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-gray-100 dark:bg-gray-800/50 p-1 rounded-[1.2rem] md:rounded-[1.5rem] flex backdrop-blur-xl border border-white/5 shadow-inner">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`px-4 md:px-8 py-2 md:py-3 rounded-[0.9rem] md:rounded-[1.2rem] text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'active' ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-xl scale-105' : 'text-gray-400 hover:text-gray-500'}`}
                        >
                            Faollik
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            className={`px-4 md:px-8 py-2 md:py-3 rounded-[0.9rem] md:rounded-[1.2rem] text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'completed' ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-xl scale-105' : 'text-gray-400 hover:text-gray-500'}`}
                        >
                            Yakunlangan
                        </button>
                    </div>

                    <div className="relative group hidden lg:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-indigo-500" size={16} />
                        <input
                            type="text"
                            placeholder="Vazifalarni izlash..."
                            className="w-64 bg-gray-100 dark:bg-gray-800/50 border-none rounded-[1.2rem] pl-12 pr-6 py-3.5 text-xs font-bold focus:ring-4 ring-indigo-500/10 transition-all dark:text-white placeholder:text-gray-500"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Grid Section */}
            {filteredItems.length === 0 ? (
                <div className="bg-white dark:bg-gray-800/40 rounded-[2rem] md:rounded-[3rem] p-12 md:p-24 text-center border border-dashed border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-50 dark:bg-gray-900/50 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 md:mb-8 text-gray-300 shadow-inner">
                        {activeTab === 'active' ? <Calendar size={32} md:size={48} strokeWidth={1.5} /> : <CheckCircle size={32} md:size={48} strokeWidth={1.5} />}
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-2 md:mb-3 tracking-tight">Hozircha hech narsa yo'q</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm max-w-xs mx-auto font-medium">Bu bo'limda sizga oid vazifa yoki topshiriqlar topilmadi.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems.map(item => (
                        <div
                            key={`${item.type}-${item._id}`}
                            onClick={() => {
                                const now = new Date();
                                const deadline = item.date ? new Date(item.date) : null;
                                if (deadline && now > deadline && item.status !== 'STARTED') {
                                    alert('Vaqti tugadi');
                                    return;
                                }
                                handleItemClick(item);
                            }}
                            className={`group bg-white dark:bg-gray-800 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-1 ${(item.date && new Date() > new Date(item.date) && activeTab === 'active') ? 'opacity-75 grayscale-[0.5]' : ''
                                }`}
                        >
                            <div className="h-48 relative overflow-hidden">
                                {item.image_url ? (
                                    <img
                                        src={getImageUrl(item.image_url)}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt={item.title}
                                    />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${item.type === 'QUIZ' ? 'from-indigo-500 to-blue-600' : 'from-orange-400 to-amber-500'}`}>
                                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                        <div className="relative z-10 text-white flex flex-col items-center gap-2">
                                            {item.type === 'QUIZ' ? <Brain size={40} /> : <FileCode size={40} />}
                                        </div>
                                    </div>
                                )}

                                <div className="absolute top-5 left-5 z-20">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-black/40 backdrop-blur-md text-white px-4 py-1.5 rounded-xl border border-white/20">
                                        {item.type}
                                    </span>
                                </div>

                                {item.date && new Date() > new Date(item.date) && (new Date() - new Date(item.date)) < 600000 && (
                                    <div className="absolute bottom-5 left-5 bg-rose-600 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-xl shadow-rose-500/30 animate-pulse z-20 uppercase tracking-widest border border-white/20">
                                        10 minut vaqti tugadi
                                    </div>
                                )}

                                {((item.type === 'QUIZ'
                                    ? (item.status === 'FINISHED' || item.submission?.status === 'FINISHED' || item.status === 'GRADED')
                                    : (item.submission || item.status === 'COMPLETED' || item.status === 'CLOSED')) && activeTab === 'active') && (
                                        <div className="absolute bottom-5 right-5 bg-emerald-600 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-xl shadow-emerald-500/30 z-20 uppercase tracking-widest border border-white/20">
                                            Siz topshirib bo'ldingiz
                                        </div>
                                    )}

                                {(item.status === 'FINISHED' || item.submitted || item.status === 'GRADED' || item.submission) && (
                                    <div className="absolute top-5 right-5 bg-emerald-500 text-white p-2.5 rounded-xl shadow-xl shadow-emerald-500/20 z-20 border border-white/20">
                                        <CheckCircle size={18} strokeWidth={3} />
                                    </div>
                                )}
                            </div>

                            <div className="p-5 md:p-8">
                                <h3 className="font-black text-gray-900 dark:text-white mb-2 md:mb-3 truncate text-lg md:text-xl tracking-tight leading-tight uppercase italic">{item.title}</h3>
                                <p className="text-[11px] md:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 md:mb-8 h-8 md:h-10 font-bold leading-relaxed">{item.description || 'Tavsif mavjud emas'}</p>

                                {item.status === 'STARTED' && (
                                    <div className="mb-6 bg-indigo-50 dark:bg-indigo-900/20 px-5 py-3.5 rounded-2xl flex items-center justify-between group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-all border border-indigo-100 dark:border-indigo-900/10 shadow-sm shadow-indigo-500/5">
                                        <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] animate-pulse">Davom etmoqda</span>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-indigo-700 dark:text-indigo-300">
                                            DAVOM ETTIRISH <ChevronRight size={14} strokeWidth={3} />
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-gray-50 dark:border-gray-700/50">
                                    <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                        <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-400 border border-gray-100 dark:border-gray-700/50">
                                            <Clock size={12} md:size={14} strokeWidth={2.5} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[7px] md:text-[8px] text-gray-300 dark:text-gray-500 mb-0.5">MUDDAT</span>
                                            <span className="text-gray-500 dark:text-gray-400">{item.date ? format(new Date(item.date), 'dd MMM HH:mm', { locale: uz }) : 'MUDDATSIZ'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[7px] md:text-[8px] font-black text-gray-300 dark:text-gray-500 uppercase tracking-widest mb-0.5 uppercase">ball</span>
                                        <div className="font-black text-lg md:text-xl text-indigo-600 dark:text-indigo-400 tabular-nums tracking-tighter">
                                            {item.score !== undefined || item.submission?.score !== undefined
                                                ? `${item.score ?? item.submission?.score}`
                                                : `${item.max_score || 100}`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modals Section */}
            {showTaskModal && selectedTask && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-500">
                        <div className="p-4 md:p-8 shrink-0">
                            <div className="relative h-48 md:h-72 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden group/img shadow-2xl">
                                {selectedTask.image_url ? (
                                    <img src={getImageUrl(selectedTask.image_url)} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white/20">
                                        <FileCode size={80} md:size={120} strokeWidth={1} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                                <button onClick={() => setShowTaskModal(false)} className="absolute top-4 md:top-8 right-4 md:right-8 p-2.5 md:p-3.5 bg-black/20 hover:bg-black/40 text-white rounded-xl md:rounded-2xl transition-all backdrop-blur-xl border border-white/10 group-hover:scale-110">
                                    <X size={18} md:size={20} />
                                </button>
                                <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10 text-white">
                                    <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-lg md:rounded-xl bg-orange-500 shadow-xl shadow-orange-500/20 text-[8px] md:text-[10px] font-black mb-2 md:mb-4 uppercase tracking-widest border border-white/20">Vazifa</span>
                                    <h2 className="text-xl md:text-4xl font-black truncate leading-tight tracking-tight italic uppercase">{selectedTask.title}</h2>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 md:px-10 pb-6 md:pb-10 overflow-y-auto space-y-6 md:space-y-8 custom-scrollbar">
                            <div className="bg-orange-50/50 dark:bg-orange-900/5 p-6 md:p-10 rounded-[1.8rem] md:rounded-[2.5rem] border border-orange-100/50 dark:border-orange-900/10 shadow-inner">
                                <h4 className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-orange-500 mb-2 md:mb-4 ml-1">Tavsif</h4>
                                <p className="text-gray-700 dark:text-gray-300 leading-[1.6] md:leading-[1.8] font-bold text-sm md:text-lg italic">{selectedTask.description || 'Vazifa haqida qo\'shimcha ma\'lumotlar mavjud emas.'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700/50">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2">TUGASH MUDDATI</p>
                                    <p className="text-lg font-black dark:text-white uppercase tracking-tight">{selectedTask.date ? format(new Date(selectedTask.date), 'dd MMMM, HH:mm', { locale: uz }) : 'MUDDATSIZ'}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700/50">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2">MAKSIMAL BALL</p>
                                    <div className="flex items-center gap-3">
                                        <TargetIcon size={24} className="text-indigo-500" />
                                        <p className="text-2xl font-black dark:text-white">{selectedTask.max_score || 100}</p>
                                    </div>
                                </div>
                            </div>

                            {selectedTask.submission && (
                                <div className="bg-emerald-500 p-8 rounded-[2.5rem] flex items-center justify-between shadow-2xl shadow-emerald-500/20 border border-white/20">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                                            <CheckCircle size={32} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.3em] mb-1">Muvaffaqiyatli topshirildi</p>
                                            <p className="text-2xl font-black text-white italic uppercase">Bajarildi</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest mb-1">BALL</p>
                                        <p className="text-3xl font-black text-white">{selectedTask.submission.score || '--'}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-10 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-xl border-t dark:border-gray-700/50 shrink-0">
                            {!selectedTask.submission && selectedTask.status !== 'CLOSED' ? (
                                <button
                                    onClick={() => { setShowTaskModal(false); setShowSubmitModal(true); }}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[2rem] font-black shadow-2xl shadow-indigo-600/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 text-lg italic uppercase tracking-widest"
                                >
                                    <Upload size={24} strokeWidth={2.5} />
                                    Topshirishni boshlash
                                </button>
                            ) : (
                                <button onClick={() => setShowTaskModal(false)} className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white py-5 rounded-[2rem] font-black italic uppercase tracking-widest">Yopish</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showSubmitModal && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in-95 duration-500 border border-white/5">
                        <button onClick={() => setShowSubmitModal(false)} className="absolute top-8 right-8 p-3 text-gray-400 hover:text-white hover:bg-rose-500 rounded-2xl transition-all">
                            <X size={24} />
                        </button>
                        <h3 className="text-4xl font-black mb-10 dark:text-white italic uppercase tracking-tighter">Vazifani yuborish</h3>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Sizning izohingiz</label>
                                <textarea
                                    onChange={e => setSubmitData({ ...submitData, description: e.target.value })}
                                    className="w-full p-8 bg-gray-50 dark:bg-gray-900/50 border-none rounded-[2rem] h-40 text-sm font-bold focus:ring-4 ring-indigo-500/10 transition-all resize-none dark:text-white placeholder:text-gray-500 shadow-inner"
                                    placeholder="Vazifa bo'yicha qo'shimcha ma'lumot qoldiring (masalan: havola yoki tushuntirish)..."
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Fayllarni yuklang</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,video/*,.pdf,.doc,.docx,.zip"
                                        onChange={e => {
                                            const files = Array.from(e.target.files);
                                            if (files.length > 5) {
                                                alert("Maksimal 5 ta fayl yuklash mumkin");
                                                e.target.value = "";
                                                return;
                                            }
                                            setSubmitData({ ...submitData, files });
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="w-full border-4 border-dashed border-gray-100 dark:border-gray-700 rounded-[2.5rem] p-12 flex flex-col items-center gap-4 group-hover:border-indigo-500/50 group-hover:bg-indigo-50/10 transition-all duration-500 shadow-inner">
                                        <div className="w-20 h-20 rounded-[1.8rem] bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 group-hover:bg-indigo-500 group-hover:text-white group-hover:rotate-12 transition-all duration-500 shadow-xl group-hover:shadow-indigo-500/20">
                                            <Upload size={32} strokeWidth={2.5} />
                                        </div>
                                        <p className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{submitData.files.length > 0 ? `${submitData.files.length} TTA FAYL TANLANDI` : 'FAYLLARNI SHUYERGA TASHLANG (MAKS 5 TTA)'}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmitTask}
                                disabled={submitting}
                                className="w-full bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-6 rounded-[2rem] font-black shadow-2xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-2 active:scale-95 transition-all disabled:opacity-50 mt-4 text-xl italic uppercase tracking-[0.2em]"
                            >
                                {submitting ? 'YUBORILMOQDA...' : 'VAZIFANI TOPSHIRISH'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ExamRunner
                type={quizType}
                id={selectedItemId}
                isOpen={showQuizRunner}
                onClose={() => {
                    setShowQuizRunner(false);
                    setSelectedItemId(null);
                    if (typeof setFullScreen === 'function') setFullScreen(false);
                }}
                onComplete={fetchData}
                readOnly={quizReadOnly}
            />
        </div>
    );
}
