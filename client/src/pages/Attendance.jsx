import { useState, useEffect, useMemo } from 'react';
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
    RefreshCw
} from 'lucide-react';

export default function Attendance() {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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
            await Promise.all([fetchStudents(), fetchAttendance()]);
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

    const fetchStudents = async () => {
        try {
            const response = await api.get(`/groups/${selectedGroup}/students`);
            setStudents(response.data);
        } catch (error) {
            console.error('O\'quvchilarni yuklashda xatolik:', error);
        }
    };

    const fetchAttendance = async () => {
        try {
            const response = await api.get(`/attendance/${selectedGroup}/${selectedDate}`);
            const attendanceMap = {};
            response.data.forEach(record => {
                const sId = record.student_id._id || record.student_id;
                attendanceMap[sId] = record.status;
            });
            setAttendance(attendanceMap);
        } catch (error) {
            console.error('Davomatni yuklashda xatolik:', error);
        }
    };

    const handleAttendanceChange = (studentId, status) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const markAll = (status) => {
        const newAttendance = { ...attendance };
        filteredStudents.forEach(student => {
            newAttendance[student._id] = status;
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
                status: attendance[student._id] || 'ABSENT'
            }));

            await api.post('/attendance', { attendance: attendanceData });

            // Show custom notification or pulse the save button
            alert('✅ Davomat muvaffaqiyatli saqlandi!');
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
        if (total === 0) return { present: 0, absent: 0, late: 0, percentage: 0 };

        const present = filteredStudents.filter(s => attendance[s._id] === 'PRESENT').length;
        const late = filteredStudents.filter(s => attendance[s._id] === 'LATE').length;
        const absent = filteredStudents.filter(s => attendance[s._id] === 'ABSENT').length;

        return {
            present,
            late,
            absent,
            percentage: Math.round(((present + late * 0.5) / total) * 100)
        };
    }, [filteredStudents, attendance]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 lg:p-8">
            {/* Header section with Stats */}
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Davomat <span className="text-indigo-600 dark:text-indigo-400">Pro</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Guruh va o'quvchilar nazorati
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-1.5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                            <Calendar className="w-5 h-5 text-indigo-500 ml-2" />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 text-sm font-medium dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                {selectedGroup && students.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-3">
                                <UserCheck className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold dark:text-white">{stats.present}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Keldi</span>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-2xl flex items-center justify-center mb-3">
                                <Clock className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold dark:text-white">{stats.late}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Kechikdi</span>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-3">
                                <UserMinus className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold dark:text-white">{stats.absent}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Kelmadi</span>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-3">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold dark:text-white">{stats.percentage}%</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Faollik</span>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 dark:border-gray-800">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="w-full lg:w-1/3">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                                    Guruhni Tanlang
                                </label>
                                <select
                                    value={selectedGroup}
                                    onChange={(e) => setSelectedGroup(e.target.value)}
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 text-gray-900 dark:text-white font-medium transition-all"
                                >
                                    <option value="">Guruhlar ro'yxati</option>
                                    {groups.map(group => (
                                        <option key={group._id} value={group._id}>
                                            {group.name} {group.status === 'NABOR' ? '(Nabor)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedGroup && (
                                <div className="w-full lg:w-2/3 flex flex-col sm:flex-row items-end sm:items-center gap-4">
                                    <div className="relative w-full">
                                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="O'quvchi ismi yoki telefon raqami..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 text-gray-900 dark:text-white font-medium transition-all"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => markAll('PRESENT')}
                                            className="px-4 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-500/20 transition-all flex items-center gap-2 whitespace-nowrap"
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span className="hidden sm:inline">Hamma Keldi</span>
                                        </button>
                                        <button
                                            onClick={() => markAll('ABSENT')}
                                            className="px-4 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-2xl font-bold transition-all flex items-center gap-2 whitespace-nowrap"
                                        >
                                            <XCircle className="w-5 h-5" />
                                            <span className="hidden sm:inline">Tozalash</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="relative min-h-[400px]">
                        {!selectedGroup ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-gray-50/50 dark:bg-gray-950/20">
                                <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 rounded-full flex items-center justify-center mb-6">
                                    <Users className="w-12 h-12" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Guruh aniqlanmadi</h2>
                                <p className="text-gray-500 max-w-xs">Davomatni boshlash uchun yuqoridagi menyudan guruhni tanlang.</p>
                            </div>
                        ) : loading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-4 text-gray-500 font-medium">O'quvchilar yuklanmoqda...</p>
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-full flex items-center justify-center mb-4">
                                    <AlertTriangle className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">O'quvchilar topilmadi</h3>
                                <p className="text-gray-500">Bu guruhda o'quvchilar mavjud emas yoki qidiruvga mos kelmadi.</p>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="mt-4 text-indigo-600 font-bold hover:underline"
                                >
                                    Filtrni tozalash
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50 dark:divide-gray-800">
                                {filteredStudents.map((student, index) => (
                                    <div
                                        key={student._id}
                                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-8 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/5 transition-all"
                                    >
                                        <div className="flex items-center gap-6 mb-4 sm:mb-0">
                                            <span className="hidden lg:block text-sm font-black text-gray-300 dark:text-gray-700 w-8">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-500/20 overflow-hidden">
                                                    {student.profile_image ? (
                                                        <img src={student.profile_image} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.full_name}`} alt="" />
                                                    )}
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white dark:border-gray-900 ${attendance[student._id] === 'PRESENT' ? 'bg-green-500' :
                                                        attendance[student._id] === 'ABSENT' ? 'bg-red-500' :
                                                            attendance[student._id] === 'LATE' ? 'bg-yellow-500' : 'bg-gray-300'
                                                    }`} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {student.full_name}
                                                </h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{student.phone}</span>
                                                    {student.status === 'DEBTOR' && (
                                                        <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                                            Qarzdor
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="bg-gray-50 dark:bg-gray-950/50 p-2 rounded-[1.5rem] flex gap-2">
                                                <button
                                                    onClick={() => handleAttendanceChange(student._id, 'PRESENT')}
                                                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center transition-all ${attendance[student._id] === 'PRESENT'
                                                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-105'
                                                            : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-green-50 dark:hover:bg-green-900/10 hover:text-green-500'
                                                        }`}
                                                >
                                                    <Check className="w-6 h-6 mb-1" />
                                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Keldi</span>
                                                </button>
                                                <button
                                                    onClick={() => handleAttendanceChange(student._id, 'LATE')}
                                                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center transition-all ${attendance[student._id] === 'LATE'
                                                            ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30 scale-105'
                                                            : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 hover:text-yellow-500'
                                                        }`}
                                                >
                                                    <Clock className="w-6 h-6 mb-1" />
                                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Kechikdi</span>
                                                </button>
                                                <button
                                                    onClick={() => handleAttendanceChange(student._id, 'ABSENT')}
                                                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center transition-all ${attendance[student._id] === 'ABSENT'
                                                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105'
                                                            : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500'
                                                        }`}
                                                >
                                                    <XCircle className="w-6 h-6 mb-1" />
                                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Kelmadi</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {selectedGroup && students.length > 0 && !loading && (
                        <div className="p-8 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-6 py-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                                <AlertCircle className="w-5 h-5 text-indigo-500" />
                                <span className="text-sm font-bold">
                                    {Object.keys(attendance).length} / {students.length} o'quvchi belgilandi
                                </span>
                            </div>
                            <button
                                onClick={saveAttendance}
                                disabled={saving}
                                className={`group min-w-[240px] px-8 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black text-lg shadow-2xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${saving ? 'animate-pulse' : 'hover:scale-105 active:scale-95'
                                    }`}
                            >
                                {saving ? (
                                    <>
                                        <RefreshCw className="w-6 h-6 animate-spin" />
                                        <span>Saqlanmoqda...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-6 h-6" />
                                        <span>Davomatni Saqlash</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Button for smaller screens if needed */}
            {selectedGroup && students.length > 0 && !loading && (
                <div className="fixed bottom-8 right-8 lg:hidden">
                    <button
                        onClick={saveAttendance}
                        disabled={saving}
                        className="w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform"
                    >
                        <Save className="w-8 h-8" />
                    </button>
                </div>
            )}
        </div>
    );
}

