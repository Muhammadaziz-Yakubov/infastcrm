import { useState, useEffect, useCallback, useMemo } from 'react';
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
    Target as TargetIcon,
    AlertCircle,
    FileText,
    Image as ImageIcon,
    Download,
    Trash2,
    Check
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
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState(null);

    const [selectedItemId, setSelectedItemId] = useState(null);
    const [showQuizRunner, setShowQuizRunner] = useState(false);
    const [quizReadOnly, setQuizReadOnly] = useState(false);
    const [quizType, setQuizType] = useState('QUIZ');
    const [activeTab, setActiveTab] = useState('active');

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        // Use the same base URL as API but remove /api for static files
        const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api/' : 'https://infastcrm-0b2r.onrender.com/api/');
        const staticBaseUrl = baseURL.replace('/api/', '/');
        return `${staticBaseUrl}${url.startsWith('/') ? url.slice(1) : url}`;
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Using separate try-catch for each to ensure one failure doesn't block the other
            let tasks = [];
            let quizzes = [];

            try {
                const tasksRes = await api.get('student-auth/tasks');
                tasks = tasksRes.data.map(t => ({
                    ...t,
                    type: 'TASK',
                    deadline: t.deadline || null,
                    createdAt: t.createdAt,
                    sortDate: new Date(t.deadline || t.createdAt).getTime()
                }));
            } catch (err) {
                console.error('Error fetching tasks:', err);
            }

            try {
                const quizzesRes = await api.get('student-quizzes');
                quizzes = quizzesRes.data.map(q => ({
                    ...q,
                    type: 'QUIZ',
                    deadline: q.end_date || null,
                    createdAt: q.createdAt,
                    sortDate: new Date(q.end_date || q.createdAt).getTime()
                }));
            } catch (err) {
                console.error('Error fetching quizzes:', err);
            }

            const combined = [...tasks, ...quizzes].sort((a, b) => b.sortDate - a.sortDate);
            setItems(combined);
        } catch (error) {
            console.error('General error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

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
            return; // Start date not reached
        }

        setSelectedItemId(quiz._id);
        setQuizType(type);
        setQuizReadOnly(false);
        setShowQuizRunner(true);
        if (typeof setFullScreen === 'function') setFullScreen(true);
    };

    const removeFile = (index) => {
        setSubmitData(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
    };

    const handleSubmitTask = async (e) => {
        if (e) e.preventDefault();
        setError(null);

        if (submitData.files.length === 0 && !submitData.description.trim()) {
            setError('Iltimos, vazifani jo\'natish uchun fayl yuklang yoki izoh qoldiring!');
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('description', submitData.description);
            submitData.files.forEach(f => formData.append('files', f));

            await api.post(`tasks/${selectedTask._id}/submit`, formData);

            setSubmitSuccess(true);
            setTimeout(() => {
                setShowSubmitModal(false);
                setSubmitSuccess(false);
                setSubmitData({ description: '', files: [] });
                fetchData();
            }, 2000);
        } catch (error) {
            console.error('Submission total error:', error);
            setError(error.response?.data?.message || 'Vazifani jo\'natishda xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
            const now = new Date();

            const isCompleted = item.type === 'TASK'
                ? !!item.submission
                : (item.status === 'FINISHED' || item.submission?.status === 'FINISHED' || item.status === 'GRADED' || item.submission?.status === 'GRADED');

            // Expiry logic only applies if there is an explicit deadline
            const deadline = item.deadline ? new Date(item.deadline) : null;
            const isExpired = deadline && now > deadline;
            const isRecentlyExpired = isExpired && (now - deadline) < 600000;

            if (activeTab === 'completed') {
                return matchesSearch && isCompleted;
            }
            // Keep items visible even after deadline passes; UI already disables submitting when expired.
            return matchesSearch && !isCompleted;
        });
    }, [items, searchTerm, activeTab]);

    if (loading) return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-[2.5rem] h-[450px] border border-gray-100 dark:border-gray-700/50">
                    <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-t-[2.5rem]"></div>
                    <div className="p-8 space-y-4">
                        <div className="h-6 w-3/4 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                        <div className="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                        <div className="h-4 w-1/2 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                        <div className="pt-10 flex justify-between">
                            <div className="h-10 w-24 bg-gray-100 dark:bg-gray-700 rounded-xl"></div>
                            <div className="h-10 w-24 bg-gray-100 dark:bg-gray-700 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Elegant Top Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-6 border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-[2.2rem] bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl relative overflow-hidden group transition-all duration-500">
                            <TargetIcon className="text-white group-hover:scale-110 transition-transform" size={32} />
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black dark:text-white tracking-tighter italic uppercase bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent">Vazifalar</h2>
                        <p className="text-[10px] md:text-xs font-black text-gray-400 dark:text-white/40 uppercase tracking-[0.4em] mt-2 ml-1 flex items-center gap-2">
                            Akademiya topshiriqlar platformasi
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="bg-gray-100 dark:bg-white/5 p-1.5 rounded-3xl flex backdrop-blur-xl border border-white/5 ring-1 ring-black/5 dark:ring-white/5">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`px-6 md:px-10 py-3 rounded-2xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-500 ${activeTab === 'active' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xl scale-105' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white/60'}`}
                        >
                            Faollik
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            className={`px-6 md:px-10 py-3 rounded-2xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-500 ${activeTab === 'completed' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xl scale-105' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white/60'}`}
                        >
                            Yakunlangan
                        </button>
                    </div>

                    <div className="relative group lg:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Izlash..."
                            className="w-full bg-white dark:bg-white/5 border-none rounded-[1.5rem] pl-12 pr-6 py-4 text-xs font-bold focus:ring-4 ring-indigo-500/10 transition-all dark:text-white shadow-xl shadow-gray-200/5 dark:shadow-none"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {filteredItems.length === 0 ? (
                <div className="bg-white dark:bg-white/[0.02] rounded-[3.5rem] p-16 md:p-32 text-center border-4 border-dashed border-gray-50 dark:border-white/5 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 dark:bg-white/5 rounded-[3rem] flex items-center justify-center mb-10 text-gray-200 dark:text-white/10 rotate-12 group hover:rotate-0 transition-transform duration-700">
                        {activeTab === 'active' ? <Calendar size={56} strokeWidth={1} /> : <CheckCircle size={56} strokeWidth={1} />}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight italic uppercase italic">Topshiriqlar topilmadi</h3>
                    <p className="text-gray-400 dark:text-white/40 text-sm md:text-lg max-w-sm font-medium tracking-tight">Hozircha bu bo'limda hech qanday topshiriq mavjud emas. Yangidurslarini kuting!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredItems.map(item => {
                        const now = new Date();
                        const deadline = item.deadline ? new Date(item.deadline) : null;
                        const isExpired = deadline && now > deadline;
                        const isSubmitted = item.submission || item.status === 'FINISHED' || item.status === 'GRADED';

                        return (
                            <div
                                key={`${item.type}-${item._id}`}
                                onClick={() => isExpired && !item.submission ? null : handleItemClick(item)}
                                className={`group bg-white dark:bg-[#0f111a] rounded-[3rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_40px_80px_rgba(79,70,229,0.1)] transition-all duration-700 cursor-pointer flex flex-col h-full relative ${isExpired && !item.submission ? 'opacity-60 grayscale-[0.5] cursor-not-allowed' : 'hover:-translate-y-3'}`}
                            >
                                <div className="h-56 relative overflow-hidden shrink-0">
                                    {item.image_url ? (
                                        <img
                                            src={getImageUrl(item.image_url)}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            alt={item.title}
                                        />
                                    ) : (
                                        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${item.type === 'QUIZ' ? 'from-indigo-600 to-indigo-800' : 'from-rose-500 to-orange-600'}`}>
                                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                            <div className="relative z-10 text-white/20">
                                                {item.type === 'QUIZ' ? <Brain size={100} strokeWidth={1} /> : <FileCode size={100} strokeWidth={1} />}
                                            </div>
                                        </div>
                                    )}

                                    {/* Glass Overlay Badges */}
                                    <div className="absolute top-6 left-6 z-20 flex gap-2">
                                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl border border-white/20 shadow-xl backdrop-blur-md ${item.type === 'QUIZ' ? 'bg-indigo-600 text-white' : 'bg-orange-600 text-white'}`}>
                                            {item.type}
                                        </span>
                                    </div>

                                    {isSubmitted && (
                                        <div className="absolute top-6 right-6 z-20">
                                            <div className="bg-emerald-500 text-white p-2.5 rounded-xl shadow-2xl shadow-emerald-500/30 border border-white/20 animate-in zoom-in-50">
                                                <CheckCircle size={20} strokeWidth={3} />
                                            </div>
                                        </div>
                                    )}

                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                                </div>

                                <div className="p-8 md:p-10 flex flex-col flex-1">
                                    <div className="flex-1">
                                        <h3 className="font-black text-gray-900 dark:text-white mb-4 line-clamp-1 text-2xl tracking-tighter uppercase italic group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                                        <p className="text-xs md:text-sm text-gray-400 dark:text-white/40 line-clamp-2 mb-8 font-bold leading-relaxed">{item.description || 'Vazifa shartlari bilan yaqindan tanishib chiqing.'}</p>
                                    </div>

                                    <div className="space-y-6">
                                        {item.status === 'STARTED' && (
                                            <div className="bg-indigo-50 dark:bg-indigo-600/10 px-6 py-4 rounded-[1.5rem] flex items-center justify-between group-hover:bg-indigo-600 group-hover:scale-[1.02] transition-all border border-indigo-100 dark:border-indigo-600/20 shadow-lg shadow-indigo-600/5 group-hover:shadow-indigo-600/20 group-hover:text-white">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Davom etish</span>
                                                <ChevronRight size={16} strokeWidth={3} />
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-white/20 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 border border-gray-100 dark:border-white/10">
                                                    <Clock size={16} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-gray-300 dark:text-white/20 uppercase tracking-widest leading-none mb-1">{item.deadline ? 'MUDDAT' : 'TOPHIRILDI'}</span>
                                                    <span className={`text-[11px] font-black uppercase tracking-tight italic ${isExpired ? 'text-rose-500' : 'text-gray-500 dark:text-white/60'}`}>
                                                        {item.deadline ? format(new Date(item.deadline), 'dd MMM, HH:mm', { locale: uz }) : format(new Date(item.createdAt), 'dd MMM, HH:mm', { locale: uz })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[8px] font-black text-gray-300 dark:text-white/20 uppercase tracking-widest leading-none mb-1">SCORE</span>
                                                <div className="flex items-center gap-1.5 font-black text-2xl text-indigo-600 dark:text-indigo-400 tracking-tighter tabular-nums drop-shadow-sm group-hover:scale-110 transition-transform origin-right">
                                                    <Target size={18} />
                                                    {item.submission?.score !== undefined ? item.submission.score : (item.score ?? item.max_score ?? 100)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Premium Task Details Modal */}
            {showTaskModal && selectedTask && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-[#0f111a] w-full max-w-2xl rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col max-h-[92vh] animate-in zoom-in-95 slide-in-from-bottom-10 duration-700">
                        <div className="relative shrink-0 h-64 md:h-80">
                            {selectedTask.image_url ? (
                                <img src={getImageUrl(selectedTask.image_url)} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${selectedTask.type === 'TASK' ? 'from-orange-500 to-rose-600' : 'from-indigo-600 to-blue-700'} flex items-center justify-center text-white/10`}>
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                    {selectedTask.type === 'TASK' ? <FileText size={160} strokeWidth={1} /> : <Brain size={160} strokeWidth={1} />}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-[#0f111a]/20 to-transparent"></div>

                            <button onClick={() => setShowTaskModal(false)} className="absolute top-8 right-8 w-12 h-12 bg-black/40 hover:bg-black/80 text-white rounded-2xl transition-all backdrop-blur-xl border border-white/20 flex items-center justify-center group/btn z-50">
                                <X size={20} className="group-hover/btn:rotate-90 transition-transform duration-500" />
                            </button>

                            <div className="absolute bottom-10 left-10 right-10 text-white">
                                <span className="inline-block px-4 py-1.5 rounded-xl bg-indigo-500 shadow-2xl shadow-indigo-500/40 text-[10px] font-black mb-4 uppercase tracking-[0.2em] border border-white/20">Task Overview</span>
                                <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-[0.9]">{selectedTask.title}</h2>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-12 pb-12 space-y-10 py-6">
                            <div className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-inner">
                                <div className="flex items-center gap-3 mb-4 text-indigo-500">
                                    <FileText size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Topshiriq tavsifi</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-bold text-sm md:text-lg italic whitespace-pre-line tracking-tight">{selectedTask.description || 'Ushbu vazifa uchun maxsus tavsif qo\'shilmagan.'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl flex flex-col items-center">
                                    <Clock className="text-indigo-500 mb-3" size={24} />
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">MUDDAT</span>
                                    <span className="text-base font-black dark:text-white uppercase italic">{selectedTask.date ? format(new Date(selectedTask.date), 'dd MMMM, HH:mm', { locale: uz }) : 'MUDDATSIZ'}</span>
                                </div>
                                <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl flex flex-col items-center">
                                    <TargetIcon className="text-emerald-500 mb-3" size={24} />
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">MAX BALL</span>
                                    <span className="text-2xl font-black dark:text-white tabular-nums italic">{selectedTask.max_score || 100}</span>
                                </div>
                            </div>

                            {selectedTask.submission && (
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-10 rounded-[3rem] shadow-2xl shadow-emerald-500/20 text-white flex items-center justify-between border border-white/20">
                                        <div className="flex items-center gap-8">
                                            <div className="w-20 h-20 rounded-[2rem] bg-white/20 flex items-center justify-center text-white backdrop-blur-md border border-white/30 shadow-inner">
                                                <CheckCircle size={40} strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-emerald-100 uppercase tracking-[0.3em] mb-1">Vazifa baholangan</p>
                                                <p className="text-3xl font-black italic uppercase tracking-tighter">Bajarildi ✅</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[11px] font-black text-emerald-100 uppercase tracking-widest mb-1">BALL</p>
                                            <p className="text-5xl font-black tabular-nums">{selectedTask.submission.score ?? '--'}</p>
                                        </div>
                                    </div>

                                    {selectedTask.submission.submitted_files?.length > 0 && (
                                        <div className="p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                            <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                                                <Download size={14} /> Yuborilgan fayllar
                                            </h5>
                                            <div className="grid grid-cols-1 gap-4">
                                                {selectedTask.submission.submitted_files.map((file, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={getImageUrl(file.file_path)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-indigo-500/20 group/file"
                                                    >
                                                        <div className="flex items-center gap-4 overflow-hidden">
                                                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#0f111a] flex items-center justify-center text-indigo-500 shadow-sm">
                                                                <FileCode size={20} />
                                                            </div>
                                                            <div className="overflow-hidden">
                                                                <p className="text-sm font-black dark:text-white truncate uppercase italic">{file.original_name}</p>
                                                                <p className="text-[9px] text-gray-400 font-bold tracking-widest">{(file.file_size / 1024 / 1024).toFixed(2)} MB</p>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="text-gray-300 group-hover/file:text-indigo-500 group-hover/file:translate-x-1 transition-all" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="p-10 px-12 bg-gray-50/80 dark:bg-[#1a1c2e]/50 backdrop-blur-3xl border-t dark:border-white/5">
                            {!selectedTask.submission && selectedTask.status !== 'CLOSED' ? (
                                <button
                                    onClick={() => { setShowTaskModal(false); setShowSubmitModal(true); }}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-[2.5rem] font-black shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:shadow-[0_30px_60px_rgba(79,70,229,0.5)] active:scale-95 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 text-xl italic uppercase tracking-widest"
                                >
                                    <Upload size={24} strokeWidth={3} />
                                    Topshirishni boshlash
                                </button>
                            ) : (
                                <button onClick={() => setShowTaskModal(false)} className="w-full bg-gray-200 dark:bg-white/5 text-gray-700 dark:text-white py-6 rounded-[2.5rem] font-black italic uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-white/10 transition-colors">Ma'lumotlarni yopish</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Submission Modal - Enhanced with File List Refinement */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-[#0f111a] w-full max-w-lg rounded-[3.5rem] p-10 shadow-[0_0_150px_rgba(0,0,0,0.8)] border border-white/5 relative animate-in zoom-in-95 duration-700 max-h-[92vh] flex flex-col">
                        <button onClick={() => { setShowSubmitModal(false); setError(null); setSubmitSuccess(false); }} className="absolute top-10 right-10 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-rose-500 rounded-2xl transition-all z-20">
                            <X size={24} />
                        </button>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                            <h3 className="text-4xl font-black mb-12 dark:text-white italic uppercase tracking-tighter leading-none mt-2">Vazifani<br />Jo'natish</h3>

                            {submitSuccess ? (
                                <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-500">
                                    <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_20px_60px_rgba(16,185,129,0.4)] border-8 border-emerald-500/20">
                                        <Check size={64} strokeWidth={4} />
                                    </div>
                                    <h4 className="text-3xl font-black dark:text-white italic uppercase tracking-tighter">Muvaffaqiyatli!</h4>
                                    <p className="text-gray-400 font-bold italic tracking-tight">Sizning topshirig'ingiz qabul qilindi va tekshiruvga yuborildi. 🚀</p>
                                </div>
                            ) : (
                                <div className="space-y-10">
                                    {error && (
                                        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center gap-4 text-rose-500 animate-in slide-in-from-top-4">
                                            <AlertCircle className="shrink-0" size={24} />
                                            <p className="text-xs font-black uppercase tracking-widest leading-relaxed">{error}</p>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2">
                                            <FileText size={14} className="text-indigo-500" /> Izoh qoldiring
                                        </label>
                                        <textarea
                                            value={submitData.description}
                                            onChange={e => setSubmitData({ ...submitData, description: e.target.value })}
                                            className="w-full p-8 bg-gray-50 dark:bg-white/5 border-none rounded-[2.5rem] h-48 text-base font-bold dark:text-white placeholder:text-gray-500 focus:ring-4 ring-indigo-500/10 transition-all resize-none shadow-inner"
                                            placeholder="Masalan: Github havola yoki tushuntirish matni..."
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2">
                                            <Upload size={14} className="text-indigo-500" /> Fayllarni biriktiring
                                        </label>

                                        {submitData.files.length > 0 && (
                                            <div className="space-y-3 mb-6">
                                                {submitData.files.map((file, i) => (
                                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 animate-in slide-in-from-left-4">
                                                        <div className="flex items-center gap-4 overflow-hidden">
                                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0f111a] flex items-center justify-center text-indigo-500">
                                                                {file.type.startsWith('image/') ? <ImageIcon size={20} /> : <FileCode size={20} />}
                                                            </div>
                                                            <p className="text-xs font-black dark:text-white truncate uppercase italic">{file.name}</p>
                                                        </div>
                                                        <button onClick={() => removeFile(i)} className="p-2 text-gray-400 hover:text-rose-500 transition-colors">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="relative group">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*,video/*,.pdf,.doc,.docx,.zip,.rar"
                                                onChange={e => {
                                                    const newFiles = Array.from(e.target.files);
                                                    const combined = [...submitData.files, ...newFiles];
                                                    if (combined.length > 5) {
                                                        setError("Maksimal 5 ta fayl yuklash mumkin!");
                                                        e.target.value = "";
                                                        return;
                                                    }
                                                    setSubmitData({ ...submitData, files: combined });
                                                    setError(null);
                                                }}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="w-full border-4 border-dashed border-gray-100 dark:border-white/10 rounded-[2.5rem] p-12 flex flex-col items-center gap-4 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/5 transition-all duration-700 shadow-inner">
                                                <div className="w-20 h-20 rounded-[1.8rem] bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-12 transition-all duration-700 shadow-2xl group-hover:shadow-indigo-500/30">
                                                    <Upload size={32} strokeWidth={3} />
                                                </div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Fayllarni tanlash yoki shuyerga tashlang</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSubmitTask}
                                        disabled={submitting}
                                        className="w-full py-6 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-[2.5rem] font-black shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:shadow-[0_30px_60px_rgba(79,70,229,0.6)] hover:-translate-y-2 active:scale-95 transition-all disabled:opacity-50 text-xl italic uppercase tracking-[0.2em] relative overflow-hidden group/submit"
                                    >
                                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/submit:translate-x-full transition-transform duration-1000"></div>
                                        <span className="relative z-10">{submitting ? 'YUBORILMOQDA...' : 'TOPSHIRIQLARNI YUBORISH'}</span>
                                    </button>
                                </div>
                            )}
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
