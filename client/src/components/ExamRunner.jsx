import { useState, useEffect } from 'react';
import {
    X,
    Clock,
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    AlertCircle,
    Timer,
    Brain,
    Trophy,
    Award,
    HelpCircle,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import api from '../utils/api';

export default function ExamRunner({
    id,
    type = 'EXAM', // 'EXAM' or 'QUIZ'
    isOpen,
    onClose,
    onComplete,
    readOnly = false
}) {
    const [data, setData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    const baseUrl = type === 'QUIZ' ? '/student/quizzes' : '/student/exams';

    useEffect(() => {
        if (isOpen && id) {
            initialize();
        }
        if (!isOpen) {
            setData(null);
            setResult(null);
            setAnswers([]);
            setCurrentQuestionIndex(0);
        }
    }, [isOpen, id, type]);

    useEffect(() => {
        let interval;
        if (timeLeft > 0 && !result && !readOnly && !submitting && isOpen) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timeLeft, result, readOnly, submitting, isOpen]);

    // Anti-cheating listeners (Copy, Paste, Right Click, Screenshot shortcuts)
    useEffect(() => {
        if (!isOpen || readOnly || result) return;

        const preventAction = (e) => {
            e.preventDefault();
            return false;
        };

        const handleKeyDown = (e) => {
            // Block PrintScreen
            if (e.key === 'PrintScreen') {
                e.preventDefault();
                alert('Screenshot olish taqiqlangan!');
            }
            // Block Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+U (view source), F12, Ctrl+Shift+I/J
            if (e.ctrlKey && ['c', 'v', 'x', 'u', 's', 'i', 'j'].includes(e.key.toLowerCase())) {
                e.preventDefault();
                return false;
            }
            if (e.key === 'F12') {
                e.preventDefault();
                return false;
            }
        };

        // Disable right click, copy, paste, cut
        window.addEventListener('contextmenu', preventAction);
        window.addEventListener('copy', preventAction);
        window.addEventListener('paste', preventAction);
        window.addEventListener('cut', preventAction);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('contextmenu', preventAction);
            window.removeEventListener('copy', preventAction);
            window.removeEventListener('paste', preventAction);
            window.removeEventListener('cut', preventAction);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, readOnly, result]);

    const initialize = async () => {
        setLoading(true);
        try {
            const studentToken = localStorage.getItem('studentToken');
            const headers = studentToken ? { Authorization: `Bearer ${studentToken}` } : {};

            if (readOnly) {
                const res = await api.get(`${baseUrl}/${id}/result`, { headers });
                setData({
                    ...res.data.quiz || res.data.exam,
                    questions: res.data.questions
                });
                setResult(res.data.result);
                setAnswers(res.data.result.answers || []);
            } else {
                const res = await api.post(`${baseUrl}/${id}/start`, {}, { headers });
                const itemData = res.data.quiz || res.data.exam;
                setData(itemData);

                const existingResult = res.data.result;
                if (existingResult) {
                    setAnswers(existingResult.answers || []);
                    const startTime = new Date(existingResult.started_at);
                    const durationMs = itemData.duration * 60 * 1000;
                    const elapsed = Date.now() - startTime.getTime();
                    const remaining = Math.max(0, Math.floor((durationMs - elapsed) / 1000));
                    setTimeLeft(remaining);
                }
            }
        } catch (error) {
            console.error("Init error:", error);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (qIndex, optionIndex) => {
        if (readOnly || result) return;
        setAnswers(prev => {
            const existing = prev.findIndex(a => a.question_index === qIndex);
            const newAnswers = [...prev];
            if (existing >= 0) newAnswers[existing].selected_answer = optionIndex;
            else newAnswers.push({ question_index: qIndex, selected_answer: optionIndex });
            return newAnswers;
        });
    };

    const handleSubmit = async () => {
        if (submitting || readOnly || result) return;
        setSubmitting(true);
        try {
            const studentToken = localStorage.getItem('studentToken');
            const headers = studentToken ? { Authorization: `Bearer ${studentToken}` } : {};
            const res = await api.post(`${baseUrl}/${id}/submit`, { answers }, { headers });
            setResult(res.data.result);
            if (res.data.questions) {
                setData(prev => ({ ...prev, questions: res.data.questions }));
            }
            if (onComplete) onComplete(res.data.result);
        } catch (error) {
            alert("Xatolik: " + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-white dark:bg-gray-900 md:bg-black/80 md:backdrop-blur-xl animate-fade-in overflow-hidden select-none">
            <div className="w-full h-full md:max-w-5xl md:h-[90vh] md:rounded-[3rem] bg-gray-50 dark:bg-gray-900 flex flex-col shadow-2xl relative overflow-hidden">

                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full -ml-48 -mb-48 blur-3xl pointer-events-none"></div>

                {/* Header */}
                <header className="px-6 py-5 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg">
                            <Brain size={22} />
                        </div>
                        <div>
                            <h2 className="font-black text-gray-900 dark:text-white truncate max-w-[200px] md:max-w-md">{data?.title || 'Test'}</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{type === 'QUIZ' ? 'Quiz' : 'Imtihon'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {!readOnly && !result && (
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-sm transition-colors ${timeLeft < 300 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                                <Timer size={18} />
                                {formatTime(timeLeft)}
                            </div>
                        )}
                        <button onClick={onClose} className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <X size={22} className="text-gray-400" />
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-bold animate-pulse">Ma'lumotlar tayyorlanmoqda...</p>
                    </div>
                ) : (!data || !data.questions || data.questions.length === 0) ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 mb-6 shadow-xl">
                            <AlertCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Savollar topilmadi</h3>
                        <p className="text-gray-500 max-w-sm">Dasturchilar bu bo'limda hali savollar tayyorlashmagan ko'rinadi.</p>
                        <button onClick={onClose} className="mt-8 px-10 py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-2xl font-black transition-transform hover:scale-105">Yopish</button>
                    </div>
                ) : (
                    <>
                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 shrink-0">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out"
                                style={{ width: `${((currentQuestionIndex + 1) / data.questions.length) * 100}%` }}
                            ></div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-10 z-10">
                            {result && (
                                <div className="mb-10 animate-fade-in-up">
                                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden text-center">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                                        <div className="relative z-10 flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-lg mb-2">
                                                <Trophy size={40} className="text-yellow-400" />
                                            </div>
                                            <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter">NATIJA: {result.score} / 100</h3>
                                            <p className="text-white/80 font-bold uppercase tracking-[0.3em] text-xs">Imtihon muvaffaqiyatli yakunlandi</p>
                                            <div className="mt-6 flex gap-3">
                                                <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl text-sm font-black border border-white/10">To'g'ri: {result.correct_answers}</div>
                                                <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl text-sm font-black border border-white/10">Xato: {result.wrong_answers}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-black text-gray-900 dark:text-white mt-12 mb-6 flex items-center gap-3">
                                        <HelpCircle size={24} className="text-indigo-500" />
                                        Savollarni ko'rib chiqish
                                    </h4>
                                </div>
                            )}

                            <div className="max-w-3xl mx-auto space-y-8 pb-10">
                                {/* Question Content */}
                                <div className={`transition-all duration-500 ${result ? 'border-b border-gray-100 dark:border-gray-800 pb-12' : ''}`}>
                                    {result ? (
                                        <div className="space-y-12">
                                            {data?.questions?.map((q, idx) => (
                                                <div key={idx} className="space-y-6">
                                                    <div className="flex items-start gap-4">
                                                        <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 text-xs font-black">{idx + 1}</span>
                                                        <p className="text-lg md:text-xl font-bold dark:text-white text-gray-900 leading-relaxed">{q?.question_text || 'Savollarni o\'qishda xatolik'}</p>
                                                    </div>
                                                    <div className="grid gap-3 ml-12">
                                                        {q?.options?.map((opt, oIdx) => {
                                                            const isCorrect = q.correct_answer === oIdx;
                                                            const isStudent = q.student_answer === oIdx;
                                                            let className = "p-4 rounded-2xl border-2 flex items-center justify-between transition-all ";
                                                            if (isCorrect) className += "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 shadow-sm";
                                                            else if (isStudent) className += "bg-red-50 dark:bg-red-900/10 border-red-500 text-red-700 dark:text-red-400 shadow-sm";
                                                            else className += "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 opacity-60";

                                                            return (
                                                                <div key={oIdx} className={className}>
                                                                    <span className="font-bold text-sm">{opt}</span>
                                                                    {isCorrect && <CheckCircle size={18} />}
                                                                    {isStudent && !isCorrect && <X size={18} />}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="animate-fade-in-up">
                                            <div className="flex items-center gap-3 mb-6">
                                                <span className="bg-indigo-500 text-white px-3 py-1 rounded-lg text-xs font-black uppercase italic tracking-widest">Question {currentQuestionIndex + 1}</span>
                                            </div>
                                            <h3 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white mb-10 leading-tight">
                                                {data?.questions?.[currentQuestionIndex]?.question_text || 'Yuklanmoqda...'}
                                            </h3>

                                            <div className="grid gap-4">
                                                {data?.questions?.[currentQuestionIndex]?.options?.map((opt, idx) => {
                                                    const isSelected = answers.find(a => a.question_index === currentQuestionIndex)?.selected_answer === idx;
                                                    return (
                                                        <button
                                                            key={idx}
                                                            onClick={() => handleAnswerSelect(currentQuestionIndex, idx)}
                                                            className={`group relative p-6 rounded-3xl border-2 text-left transition-all flex items-center justify-between ${isSelected
                                                                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-500/20 translate-x-2'
                                                                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:translate-x-1'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-6">
                                                                <span className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-colors ${isSelected ? 'bg-white/20' : 'bg-gray-50 dark:bg-gray-700 text-indigo-500'}`}>
                                                                    {String.fromCharCode(65 + idx)}
                                                                </span>
                                                                <span className="font-bold md:text-lg">{opt}</span>
                                                            </div>
                                                            {isSelected && <CheckCircle size={22} className="shrink-0" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Controls */}
                        {!result && (
                            <footer className="px-6 py-6 md:px-12 md:py-8 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between shrink-0 z-10">
                                <button
                                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                    disabled={currentQuestionIndex === 0}
                                    className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-all active:scale-95"
                                >
                                    <ChevronLeft size={20} />
                                    <span className="hidden md:inline">Oldingi savol</span>
                                </button>

                                <div className="flex gap-2">
                                    {data.questions.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === currentQuestionIndex ? 'w-6 bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                                        ></div>
                                    ))}
                                </div>

                                {currentQuestionIndex === data.questions.length - 1 ? (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                    >
                                        {submitting ? 'Yuborilmoqda...' : 'Topshirish'}
                                        <CheckCircle size={20} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setCurrentQuestionIndex(prev => Math.min(data.questions.length - 1, prev + 1))}
                                        className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-black shadow-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                                    >
                                        Keyingi
                                        <ChevronRight size={20} />
                                    </button>
                                )}
                            </footer>
                        )}

                        {result && (
                            <footer className="px-6 py-6 md:px-12 md:py-8 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center shrink-0 z-10">
                                <button onClick={onClose} className="px-12 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black shadow-xl transition-all hover:scale-105 active:scale-95">Yopish va chiqish</button>
                            </footer>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
