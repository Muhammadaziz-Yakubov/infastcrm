import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
    FileText,
    Timer,
    Play,
    Award,
    Target,
    Clock,
    Calendar,
    Eye,
    ChevronRight,
    Trophy
} from 'lucide-react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';
import ExamRunner from './ExamRunner';

export default function StudentExamsView({ setFullScreen }) {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showExamRunner, setShowExamRunner] = useState(false);
    const [selectedExamId, setSelectedExamId] = useState(null);
    const [readOnly, setReadOnly] = useState(false);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const token = localStorage.getItem('studentToken');
            const response = await api.get('/student/exams', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExams(response.data);
        } catch (error) {
            console.error('Error fetching exams view:', error);
        } finally {
            setLoading(false);
        }
    };

    const startExam = (exam) => {
        setSelectedExamId(exam._id);
        setReadOnly(false);
        setShowExamRunner(true);
        if (typeof setFullScreen === 'function') setFullScreen(true);
    };

    const viewResult = (exam) => {
        setSelectedExamId(exam._id);
        setReadOnly(true);
        setShowExamRunner(true);
        if (typeof setFullScreen === 'function') setFullScreen(true);
    };

    if (loading) return <div className="text-center py-24 text-gray-500 animate-pulse font-black uppercase tracking-[0.3em]">Imtihonlar yuklanmoqda...</div>;

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4">
                <div className="flex items-center gap-4 md:gap-5">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[1.8rem] bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-800 flex items-center justify-center shadow-2xl shadow-indigo-500/30 transform hover:rotate-6 transition-transform">
                        <Award className="text-white" size={24} md:size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-4xl font-black dark:text-white tracking-tighter italic uppercase bg-gradient-to-r from-indigo-500 to-blue-600 bg-clip-text text-transparent">Imtihonlar Markazi</h2>
                        <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 ml-1 opacity-70">Akademik natijalaringizni tasdiqlang va sertifikatlar oling</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {exams.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800/40 rounded-[2rem] md:rounded-[3rem] p-12 md:p-24 text-center border border-dashed border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-50 dark:bg-gray-900/50 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 md:mb-8 text-gray-300 shadow-inner">
                            <FileText size={32} md:size={48} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-2 md:mb-3 tracking-tight">Hozircha imtihonlar yo'q</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm max-w-xs mx-auto font-medium">Sizga tayinlangan imtihonlar hozircha mavjud emas. Yangiliklarni kuzatib boring.</p>
                    </div>
                ) : (
                    exams.map((exam) => (
                        <div
                            key={exam._id}
                            className="group bg-white dark:bg-gray-800 rounded-[2rem] md:rounded-[3.5rem] border border-gray-100 dark:border-gray-700/50 p-6 md:p-12 shadow-sm hover:shadow-2xl transition-all duration-700 relative overflow-hidden flex flex-col xl:flex-row xl:items-center justify-between gap-6 md:gap-10 hover:-translate-y-1"
                        >
                            {/* Animated Background Gradient */}
                            <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-0 group-hover:opacity-10 transition-opacity duration-1000 -mr-64 -mt-64 ${exam.status === 'FINISHED' ? 'bg-emerald-500' : 'bg-indigo-500'
                                }`}></div>

                            <div className="flex-1 relative z-10 flex flex-col md:flex-row md:items-center gap-10">
                                <div className={`w-20 h-20 md:w-28 md:h-28 shrink-0 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3 ${exam.status === 'FINISHED' ? 'bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 shadow-emerald-500/20' :
                                    exam.status === 'STARTED' ? 'bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-800 shadow-indigo-500/20' :
                                        'bg-gradient-to-br from-gray-400 to-gray-600 shadow-gray-500/20'
                                    }`}>
                                    {exam.status === 'FINISHED' ? <Award className="text-white" size={32} md:size={48} strokeWidth={2.5} /> : <FileText className="text-white" size={32} md:size={48} strokeWidth={2.5} />}
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-xl border ${exam.status === 'FINISHED' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400' :
                                                exam.status === 'STARTED' ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400' :
                                                    'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-700 text-gray-500'
                                                }`}>
                                                {exam.status === 'FINISHED' ? '• Tugallangan' : exam.status === 'STARTED' ? '• Davom etmoqda' : '• Navbatda'}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase leading-none">{exam.title}</h3>
                                    </div>

                                    <p className="text-sm md:text-lg font-bold text-gray-500 dark:text-gray-400 leading-relaxed max-w-3xl line-clamp-2 italic">{exam.description || 'Ushbu imtihon sizning fundamental bilimlaringizni tekshirish uchun maxsus tayyorlangan.'}</p>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 pt-2 md:pt-4">
                                        {[
                                            { icon: Timer, label: 'VAQT', val: `${exam.duration} MIN`, color: 'text-indigo-500' },
                                            { icon: Target, label: 'BALL', val: `${exam.total_points}`, color: 'text-rose-500' },
                                            { icon: Calendar, label: 'SANA', val: format(new Date(exam.start_date || new Date()), 'dd MMM yyyy', { locale: uz }), color: 'text-emerald-500' },
                                            { icon: Clock, label: 'BOSHLANISH', val: format(new Date(exam.start_date || new Date()), 'HH:mm'), color: 'text-amber-500' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex flex-col gap-1 md:gap-2">
                                                <div className="flex items-center gap-2">
                                                    <item.icon size={12} md:size={14} className={item.color} strokeWidth={3} />
                                                    <span className="text-[8px] md:text-[9px] font-black text-gray-300 dark:text-gray-500 uppercase tracking-widest">{item.label}</span>
                                                </div>
                                                <span className="font-black text-sm md:text-lg dark:text-white tracking-tight tabular-nums uppercase">{item.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 shrink-0 flex flex-col sm:flex-row items-center gap-8 w-full xl:w-auto xl:pl-12 xl:border-l border-gray-100 dark:border-gray-700/50">
                                {exam.status === 'FINISHED' && (
                                    <div className="flex flex-col items-center xl:items-end gap-1">
                                        <span className="text-[10px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">NATIJA</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl md:text-6xl font-black italic tracking-tighter text-emerald-500 tabular-nums">{exam.score}</span>
                                            <span className="text-xl md:text-2xl font-black text-gray-300 dark:text-gray-600">/ {exam.total_points}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="w-full sm:w-auto">
                                    {exam.status !== 'FINISHED' && exam.canStart ? (
                                        <button
                                            onClick={() => startExam(exam)}
                                            className="w-full sm:w-64 bg-indigo-600 hover:bg-indigo-700 text-white py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-4 transition-all hover:-translate-y-1 active:scale-95 text-base md:text-lg italic uppercase tracking-widest"
                                        >
                                            <Play size={20} md:size={24} fill="currentColor" />
                                            {exam.status === 'STARTED' ? 'Davom Ettirish' : 'Boshlash'}
                                        </button>
                                    ) : exam.status === 'FINISHED' ? (
                                        <button
                                            onClick={() => viewResult(exam)}
                                            className="w-full sm:w-64 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black shadow-xl flex items-center justify-center gap-4 transition-all hover:-translate-y-1 active:scale-95 text-base md:text-lg italic uppercase tracking-widest border border-gray-200 dark:border-white/5"
                                        >
                                            <Eye size={20} md:size={24} strokeWidth={2.5} />
                                            Natijani ko'rish
                                        </button>
                                    ) : (
                                        <div className="px-10 py-5 bg-gray-50 dark:bg-gray-900/50 rounded-[1.8rem] text-center border border-gray-100 dark:border-gray-800">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hozircha yopiq</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ExamRunner
                isOpen={showExamRunner}
                id={selectedExamId}
                type="EXAM"
                onClose={() => {
                    setShowExamRunner(false);
                    fetchExams();
                    if (typeof setFullScreen === 'function') setFullScreen(false);
                }}
                onComplete={fetchExams}
                readOnly={readOnly}
            />
        </div>
    );
}
