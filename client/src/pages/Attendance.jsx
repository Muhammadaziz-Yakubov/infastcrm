import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Attendance() {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
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
            setGroups(response.data);
        } catch (error) {
            console.error('Guruhlarni yuklashda xatolik:', error);
        }
    };

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/groups/${selectedGroup}/students`);
            setStudents(response.data);
        } catch (error) {
            console.error('O\'quvchilarni yuklashda xatolik:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendance = async () => {
        try {
            const response = await api.get(`/attendance/${selectedGroup}/${selectedDate}`);
            const attendanceMap = {};
            response.data.forEach(record => {
                attendanceMap[record.student_id._id || record.student_id] = record.status;
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
            alert('Davomat muvaffaqiyatli saqlandi!');
        } catch (error) {
            console.error('Davomatni saqlashda xatolik:', error);
            alert('Davomatni saqlashda xatolik yuz berdi!');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Davomat</h1>
                <p className="text-gray-600 dark:text-gray-400">O'quvchilar davomatini boshqaring</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Guruh
                        </label>
                        <select
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Guruhni tanlang</option>
                            {groups.map(group => (
                                <option key={group._id} value={group._id}>
                                    {group.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Sana
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>

                {selectedGroup && (
                    <>
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    #
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    O'quvchi
                                                </th>
                                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    Holat
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student, index) => (
                                                <tr key={student._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                                        {index + 1}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold mr-3">
                                                                {student.full_name ? student.full_name[0] : 'U'}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {student.full_name}
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {student.phone}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex justify-center gap-2">
                                                            <button
                                                                onClick={() => handleAttendanceChange(student._id, 'PRESENT')}
                                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${attendance[student._id] === 'PRESENT'
                                                                    ? 'bg-green-500 text-white'
                                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-900'
                                                                    }`}
                                                            >
                                                                Keldi
                                                            </button>
                                                            <button
                                                                onClick={() => handleAttendanceChange(student._id, 'ABSENT')}
                                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${attendance[student._id] === 'ABSENT'
                                                                    ? 'bg-red-500 text-white'
                                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900'
                                                                    }`}
                                                            >
                                                                Kelmadi
                                                            </button>
                                                            <button
                                                                onClick={() => handleAttendanceChange(student._id, 'LATE')}
                                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${attendance[student._id] === 'LATE'
                                                                    ? 'bg-yellow-500 text-white'
                                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-yellow-100 dark:hover:bg-yellow-900'
                                                                    }`}
                                                            >
                                                                Kechikdi
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={saveAttendance}
                                        disabled={saving}
                                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? 'Saqlanmoqda...' : 'Davomatni saqlash'}
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
