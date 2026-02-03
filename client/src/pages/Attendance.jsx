<<<<<<< HEAD
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import {
    Users,
    Calendar,
    Search,
    CheckCircle2,
    XCircle,
    Clock,
    Save,
    Check,
    AlertCircle,
    TrendingUp,
    UserCheck,
    UserMinus,
    AlertTriangle,
    RefreshCw,
    Trophy,
    MessageSquare,
    Plus,
    Minus,
    Star,
    Zap,
    Layout
} from 'lucide-react';

export default function Attendance() {
    const [searchParams] = useSearchParams();
    const groupParam = searchParams.get('group_id');

    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(groupParam || '');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({}); // { studentId: { status, score, note } }
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeNoteId, setActiveNoteId] = useState(null);

    useEffect(() => {
        fetchGroups();
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            fetchData();
        }
    }, [selectedGroup, selectedDate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [studentsRes, attendanceRes] = await Promise.all([
                api.get(`/groups/${selectedGroup}/students`),
                api.get(`/attendance/${selectedGroup}/${selectedDate}`)
            ]);

            setStudents(studentsRes.data);

            const attendanceMap = {};
            attendanceRes.data.forEach(record => {
                const sId = record.student_id._id || record.student_id;
                attendanceMap[sId] = {
                    status: record.status,
                    score: record.score || 0,
                    note: record.note || ''
                };
            });
            setAttendance(attendanceMap);
        } catch (error) {
            console.error('Data loading error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGroups = async () => {
        try {
            const response = await api.get('/groups');
            setGroups(response.data);
        } catch (error) {
            console.error('Guruhlarni yuklashda xatolik:', error);
        }
    };

    const updateStudentRecord = (studentId, updates) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] || { status: 'ABSENT', score: 0, note: '' }),
                ...updates
            }
        }));
    };

    const markAll = (status) => {
        const newAttendance = { ...attendance };
        filteredStudents.forEach(student => {
            newAttendance[student._id] = {
                ...(newAttendance[student._id] || { score: 0, note: '' }),
                status: status
            };
        });
        setAttendance(newAttendance);
    };

    const saveAttendance = async () => {
        try {
            setSaving(true);
            const attendanceData = students.map(student => ({
                student_id: student._id,
                group_id: selectedGroup,
                date: selectedDate,
                status: attendance[student._id]?.status || 'ABSENT',
                score: attendance[student._id]?.score || 0,
                note: attendance[student._id]?.note || ''
            }));

            await api.post('/attendance', { attendance: attendanceData });
            alert('✅ Davomat va ballar muvaffaqiyatli saqlandi!');
        } catch (error) {
            console.error('Davomatni saqlashda xatolik:', error);
            alert('❌ Davomatni saqlashda xatolik yuz berdi!');
        } finally {
            setSaving(false);
        }
    };

    const filteredStudents = useMemo(() => {
        return students.filter(student =>
            student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.phone?.includes(searchQuery)
        );
    }, [students, searchQuery]);

    const stats = useMemo(() => {
        const total = filteredStudents.length;
        if (total === 0) return { present: 0, absent: 0, late: 0, percentage: 0, avgScore: 0 };

        let present = 0, late = 0, absent = 0, totalScore = 0, scoredCount = 0;

        filteredStudents.forEach(s => {
            const record = attendance[s._id];
            if (record) {
                if (record.status === 'PRESENT') present++;
                else if (record.status === 'LATE') late++;
                else absent++;

                if (record.score > 0) {
                    totalScore += record.score;
                    scoredCount++;
                }
            } else {
                absent++;
            }
        });

        return {
            present, late, absent,
            percentage: Math.round(((present + late * 0.5) / total) * 100),
            avgScore: scoredCount ? Math.round(totalScore / scoredCount) : 0
        };
    }, [filteredStudents, attendance]);

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] p-4 lg:p-8 font-jakarta transition-colors duration-500">
            {/* Massive Header */}
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                                <Layout size={20} />
                            </div>
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Management Console</span>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                            Davomat <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent italic">Guruhlar</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2 font-medium">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            O'quvchilar faoliyati va ballarni boshqarish
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <Calendar className="w-5 h-5 text-indigo-500" />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Universe */}
                {selectedGroup && students.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        {[
                            { label: 'Keldi', val: stats.present, icon: UserCheck, color: 'emerald', bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' },
                            { label: 'Kechikdi', val: stats.late, icon: Clock, color: 'amber', bg: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' },
                            { label: 'Kelmadi', val: stats.absent, icon: UserMinus, color: 'rose', bg: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' },
                            { label: 'Faollik', val: `${stats.percentage}%`, icon: TrendingUp, color: 'indigo', bg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' },
                            { label: 'O\'rtacha Ball', val: stats.avgScore, icon: Trophy, color: 'purple', bg: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' }
                        ].map((s, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 hover:scale-[1.02] transition-all">
                                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3 shadow-inner`}>
                                    <s.icon className="w-5 h-5" />
                                </div>
                                <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{s.val}</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Control Center */}
                <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/10">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                            <div className="flex-1 max-w-md">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">
                                    Guruhlar Arxivatsiyasi
                                </label>
                                <select
                                    value={selectedGroup}
                                    onChange={(e) => setSelectedGroup(e.target.value)}
                                    className="w-full px-6 py-4 bg-white dark:bg-slate-900 border-none rounded-2xl shadow-inner focus:ring-4 focus:ring-indigo-500/10 text-slate-900 dark:text-white font-bold transition-all text-lg"
                                >
                                    <option value="">Guruhni tanlang...</option>
                                    {groups.map(group => (
                                        <option key={group._id} value={group._id}>
                                            {group.name} {group.status === 'NABOR' ? '🔥' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedGroup && (
                                <div className="flex-1 flex flex-col sm:flex-row items-center gap-4">
                                    <div className="relative w-full">
                                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="O'quvchini izlash..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900 border-none rounded-2xl shadow-inner focus:ring-4 focus:ring-indigo-500/10 text-slate-900 dark:text-white font-bold transition-all"
                                        />
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            onClick={() => markAll('PRESENT')}
                                            className="p-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                                            title="Hamma keldi"
                                        >
                                            <CheckCircle2 className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={() => markAll('ABSENT')}
                                            className="p-4 bg-slate-100 dark:bg-slate-900 text-slate-500 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all font-black text-xs"
                                            title="Tozalash"
                                        >
                                            <RefreshCw className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Student Matrix */}
                    <div className="relative min-h-[500px]">
                        {!selectedGroup ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                                <div className="w-32 h-32 bg-indigo-50 dark:bg-slate-900 text-indigo-500 rounded-full flex items-center justify-center mb-8 shadow-inner animate-bounce">
                                    <Users className="w-16 h-16" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Tizim Tayyor</h2>
                                <p className="text-slate-500 max-w-md font-medium">Boshlash uchun chap tomondagi menyudan guruhni tanlang va bugungi natijalarni kiritishga kirishing.</p>
                            </div>
                        ) : loading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                                <div className="w-20 h-20 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin shadow-2xl"></div>
                                <p className="mt-6 text-slate-900 dark:text-white font-black uppercase tracking-widest italic">Ma'lumotlar Sinxronizatsiyasi...</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filteredStudents.map((student, index) => {
                                    const record = attendance[student._id] || { status: 'ABSENT', score: 0, note: '' };
                                    return (
                                        <div
                                            key={student._id}
                                            className={`flex flex-col xl:flex-row xl:items-center justify-between p-6 md:p-10 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-900/20 group ${record.status === 'ABSENT' ? 'opacity-70 grayscale-[0.3]' : ''
                                                }`}
                                        >
                                            {/* Student Identity */}
                                            <div className="flex items-center gap-6 mb-6 xl:mb-0">
                                                <span className="hidden lg:block text-2xl font-black text-slate-200 dark:text-slate-700 w-12 italic">
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                <div className="relative">
                                                    <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br p-1 shadow-2xl transition-transform group-hover:rotate-3 ${record.status === 'PRESENT' ? 'from-emerald-400 to-indigo-600' :
                                                        record.status === 'LATE' ? 'from-amber-400 to-orange-600' : 'from-slate-200 to-slate-300'
                                                        }`}>
                                                        <div className="w-full h-full rounded-[1.8rem] bg-white dark:bg-slate-800 overflow-hidden">
                                                            {student.profile_image ? (
                                                                <img src={student.profile_image} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.full_name}`} />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center ${record.status === 'PRESENT' ? 'bg-emerald-500' :
                                                        record.status === 'ABSENT' ? 'bg-rose-500 shadow-rose-500/50' : 'bg-amber-500 shadow-amber-500/50'
                                                        } shadow-lg`} />
                                                </div>
                                                <div>
                                                    <h4 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors uppercase tracking-tight italic">
                                                        {student.full_name}
                                                    </h4>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <span className="text-sm font-bold text-slate-400 tracking-tight">{student.phone}</span>
                                                        {student.status === 'DEBTOR' && (
                                                            <span className="px-3 py-0.5 rounded-full bg-rose-100 text-rose-600 text-[9px] font-black uppercase tracking-widest border border-rose-200">Qarzdor</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Panel */}
                                            <div className="flex flex-col md:flex-row items-center gap-8">
                                                {/* Status Selector */}
                                                <div className="bg-slate-100 dark:bg-slate-900 p-2 rounded-[2rem] flex gap-2 shadow-inner">
                                                    {[
                                                        { id: 'PRESENT', icon: Check, label: 'Keldi', color: 'bg-emerald-500' },
                                                        { id: 'LATE', icon: Clock, label: 'Kech', color: 'bg-amber-500' },
                                                        { id: 'ABSENT', icon: XCircle, label: 'Yo\'q', color: 'bg-rose-500' }
                                                    ].map(opt => (
                                                        <button
                                                            key={opt.id}
                                                            onClick={() => updateStudentRecord(student._id, { status: opt.id })}
                                                            className={`px-6 py-4 rounded-2xl flex items-center gap-2 transition-all font-black uppercase text-[10px] tracking-widest ${record.status === opt.id
                                                                ? `${opt.color} text-white shadow-xl scale-105`
                                                                : 'hover:bg-white dark:hover:bg-slate-800 text-slate-400'
                                                                }`}
                                                        >
                                                            <opt.icon className="w-4 h-4" />
                                                            <span className="hidden sm:inline">{opt.label}</span>
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Grading System */}
                                                <div className={`flex items-center gap-4 transition-all duration-500 ${record.status === 'ABSENT' ? 'opacity-20 pointer-events-none' : ''}`}>
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Dars Balli</span>
                                                        <div className="relative group/score">
                                                            <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500 opacity-50 transition-opacity group-focus-within/score:opacity-100" />
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                value={record.score}
                                                                onChange={(e) => updateStudentRecord(student._id, { score: parseInt(e.target.value) || 0 })}
                                                                className="w-32 pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-900 border-none rounded-[1.5rem] focus:ring-4 focus:ring-amber-500/10 text-xl font-black text-slate-900 dark:text-white shadow-inner text-center"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-1.5 w-24">
                                                        {[100, 10, 5].map(pts => (
                                                            <button
                                                                key={pts}
                                                                onClick={() => updateStudentRecord(student._id, { score: Math.min(100, record.score + pts) })}
                                                                className="px-2.5 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 dark:border-indigo-800"
                                                            >
                                                                +{pts}
                                                            </button>
                                                        ))}
                                                        <button
                                                            onClick={() => updateStudentRecord(student._id, { score: 0 })}
                                                            className="px-2.5 py-2 bg-rose-50 text-rose-500 rounded-xl text-[10px] font-black hover:bg-rose-500 hover:text-white transition-all border border-rose-100"
                                                        >
                                                            0
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Note / Comment */}
                                                <button
                                                    onClick={() => setActiveNoteId(activeNoteId === student._id ? null : student._id)}
                                                    className={`p-4 rounded-2xl transition-all ${record.note ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                                                        } hover:scale-110`}
                                                >
                                                    <MessageSquare className="w-6 h-6" />
                                                </button>
                                            </div>

                                            {/* Internal Note Input - Expandable */}
                                            {activeNoteId === student._id && (
                                                <div className="w-full mt-6 animate-in slide-in-from-top-4 duration-300">
                                                    <textarea
                                                        value={record.note}
                                                        onChange={(e) => updateStudentRecord(student._id, { note: e.target.value })}
                                                        placeholder="O'quvchi haqida izoh yoki darsdagi ishtiroki haqida ma'lumot qoldiring..."
                                                        className="w-full p-6 bg-amber-50/50 dark:bg-slate-900 border-2 border-dashed border-amber-200 rounded-[2rem] text-sm font-bold italic focus:ring-0 focus:border-amber-400 transition-all dark:text-white"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Master Actions */}
                    {selectedGroup && students.length > 0 && !loading && (
                        <div className="p-10 bg-slate-900 dark:bg-slate-950 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-[2rem] bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
                                    <AlertCircle className="w-10 h-10 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Xulosa</p>
                                    <p className="text-xl font-bold text-white italic">
                                        <span className="text-indigo-400">{Object.keys(attendance).length}</span> ta o'quvchi nazorat qilindi.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={saveAttendance}
                                disabled={saving}
                                className={`group relative min-w-[320px] px-12 py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2.5rem] font-black text-2xl shadow-3xl shadow-indigo-600/40 transition-all overflow-hidden flex items-center justify-center gap-4 ${saving ? 'animate-pulse' : 'hover:-translate-y-2 hover:shadow-indigo-600/60 active:scale-95'
                                    }`}
                            >
                                {saving ? (
                                    <>
                                        <RefreshCw className="w-8 h-8 animate-spin" />
                                        <span>Saqlanmoqda...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-8 h-8" />
                                        <span>SAQLASH</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Float Saver */}
            {selectedGroup && students.length > 0 && !loading && (
                <div className="fixed bottom-10 right-10 lg:hidden z-50">
                    <button
                        onClick={saveAttendance}
                        disabled={saving}
                        className="w-20 h-20 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform shadow-indigo-600/50"
                    >
                        {saving ? <RefreshCw className="w-8 h-8 animate-spin" /> : <Save className="w-10 h-10" />}
                    </button>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .group-hover\\:animate-shimmer {
                    animation: shimmer 1.5s infinite;
                }
                .animated-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .7; }
                }
            `}} />
        </div>
    );
=======
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { Calendar, CheckCircle, XCircle, Clock, Users, Check, X as XIcon, AlertCircle, Star } from 'lucide-react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [searchParams] = useSearchParams();
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [scoringStudent, setScoringStudent] = useState(null);
  const [score, setScore] = useState('');
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const groupParam = searchParams.get('group_id');
    const dateParam = searchParams.get('date');
    if (groupParam) setSelectedGroup(groupParam);
    if (dateParam) setSelectedDate(dateParam);
    
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchStudents();
      fetchAttendance();
    }
  }, [selectedGroup, selectedDate]);

  const fetchGroups = async () => {
    try {
      const response = await api.get('/groups');
      setGroups(response.data.filter(g => g.status === 'ACTIVE'));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    if (!selectedGroup) return;
    try {
      const response = await api.get('/students', { params: { group_id: selectedGroup } });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchAttendance = async () => {
    if (!selectedGroup || !selectedDate) return;
    try {
      const response = await api.get('/attendance', {
        params: { group_id: selectedGroup, date: selectedDate }
      });
      setAttendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleAttendanceChange = async (studentId, status) => {
    try {
      await api.post('/attendance', {
        student_id: studentId,
        group_id: selectedGroup,
        date: selectedDate,
        status
      });
      fetchAttendance();
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleScoreSave = async () => {
    if (!scoringStudent || score === '') return;
    try {
      const existingRecord = attendance.find(
        a => (a.student_id._id || a.student_id) === scoringStudent._id
      );
      
      if (existingRecord) {
        await api.put(`/attendance/${existingRecord._id}`, {
          score: parseInt(score)
        });
      } else {
        await api.post('/attendance', {
          student_id: scoringStudent._id,
          group_id: selectedGroup,
          date: selectedDate,
          status: 'PRESENT',
          score: parseInt(score)
        });
      }
      setShowScoreModal(false);
      setScoringStudent(null);
      setScore('');
      fetchAttendance();
    } catch (error) {
      console.error('Error saving score:', error);
      alert(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const openScoreModal = (student) => {
    const record = attendance.find(
      a => (a.student_id._id || a.student_id) === student._id
    );
    setScoringStudent(student);
    setScore(record?.score?.toString() || '');
    setShowScoreModal(true);
  };

  const getAttendanceStatus = (studentId) => {
    const record = attendance.find(a => a.student_id._id === studentId || a.student_id === studentId);
    return record?.status || null;
  };

  const getAttendanceScore = (studentId) => {
    const record = attendance.find(a => a.student_id._id === studentId || a.student_id === studentId);
    return record?.score;
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    if (score >= 40) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  };

  const stats = {
    present: attendance.filter(a => a.status === 'PRESENT').length,
    late: attendance.filter(a => a.status === 'LATE').length,
    absent: students.length - attendance.filter(a => a.status !== 'ABSENT').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Davomat</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {format(new Date(selectedDate), "d MMMM yyyy, EEEE", { locale: uz })}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Guruh
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => {
                setSelectedGroup(e.target.value);
              }}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
            >
              <option value="">Guruhni tanlang</option>
              {groups.map(group => (
                <option key={group._id} value={group._id}>{group.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sana
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {selectedGroup && students.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                <CheckCircle className="text-white" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.present}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Keldi</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Clock className="text-white" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.late}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Kechikdi</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center">
                <XCircle className="text-white" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.absent}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Kelmadi</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance List */}
      {selectedGroup && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                <Users className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {groups.find(g => g._id === selectedGroup)?.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {students.length} ta o'quvchi
                </p>
              </div>
            </div>
          </div>

          {students.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
              <p className="text-gray-500 dark:text-gray-400">Bu guruhda o'quvchilar yo'q</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {students.map((student, index) => {
                const currentStatus = getAttendanceStatus(student._id);
                return (
                  <div
                    key={student._id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          currentStatus === 'PRESENT' 
                            ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                            : currentStatus === 'LATE'
                            ? 'bg-amber-100 dark:bg-amber-900/30'
                            : currentStatus === 'ABSENT'
                            ? 'bg-red-100 dark:bg-red-900/30'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          {currentStatus === 'PRESENT' && <CheckCircle className="text-emerald-500" size={20} />}
                          {currentStatus === 'LATE' && <Clock className="text-amber-500" size={20} />}
                          {currentStatus === 'ABSENT' && <XCircle className="text-red-500" size={20} />}
                          {!currentStatus && <AlertCircle className="text-gray-400" size={20} />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {student.full_name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {student.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        {/* Score Badge */}
                        {getAttendanceScore(student._id) !== undefined && getAttendanceScore(student._id) !== null && (
                          <span className={`px-3 py-2 rounded-xl text-sm font-bold ${getScoreColor(getAttendanceScore(student._id))}`}>
                            {getAttendanceScore(student._id)} ball
                          </span>
                        )}
                        
                        {/* Score Button (Admin only) */}
                        {isAdmin && (
                          <button
                            onClick={() => openScoreModal(student)}
                            className="px-3 py-2 rounded-xl text-sm font-medium bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all"
                            title="Ball qo'yish"
                          >
                            <Star size={18} />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleAttendanceChange(student._id, 'PRESENT')}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            currentStatus === 'PRESENT'
                              ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-lg'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                          }`}
                        >
                          <span className="hidden sm:inline">Keldi</span>
                          <Check size={18} className="sm:hidden" />
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student._id, 'LATE')}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            currentStatus === 'LATE'
                              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                          }`}
                        >
                          <span className="hidden sm:inline">Kechikdi</span>
                          <Clock size={18} className="sm:hidden" />
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student._id, 'ABSENT')}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            currentStatus === 'ABSENT'
                              ? 'bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-lg'
                              : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                          }`}
                        >
                          <span className="hidden sm:inline">Kelmadi</span>
                          <XIcon size={18} className="sm:hidden" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!selectedGroup && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-indigo-500" size={40} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Guruhni tanlang
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Davomatni belgilash uchun yuqoridagi ro'yxatdan guruhni tanlang
          </p>
        </div>
      )}

      {/* Score Modal */}
      {showScoreModal && scoringStudent && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up max-h-[calc(100vh-2rem)] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Ball qo'yish
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {scoringStudent.full_name}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ball (0-100)
              </label>
              <div className="flex gap-2 mb-3">
                {[0, 25, 40, 50, 70, 85, 100].map(s => (
                  <button
                    key={s}
                    onClick={() => setScore(s.toString())}
                    className={`px-3 py-2 rounded-lg font-medium transition-all ${
                      parseInt(score) === s
                        ? `text-white ${s >= 70 ? 'bg-emerald-500' : s >= 40 ? 'bg-amber-500' : 'bg-red-500'}`
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                min="0"
                max="100"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                placeholder="Yoki o'zingiz kiriting..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowScoreModal(false);
                  setScoringStudent(null);
                  setScore('');
                }}
                className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleScoreSave}
                disabled={score === ''}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
}
