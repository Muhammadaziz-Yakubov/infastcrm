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

  const getAttendanceStats = () => {
    const total = students.length;
    if (total === 0) return { present: 0, absent: 0, late: 0, percentage: 0 };

    let present = 0, late = 0, absent = 0;
    
    students.forEach(student => {
      const record = attendance.find(a => 
        (a.student_id._id || a.student_id) === student._id
      );
      if (record) {
        if (record.status === 'PRESENT') present++;
        else if (record.status === 'LATE') late++;
        else absent++;
      } else {
        absent++;
      }
    });

    return {
      present,
      late,
      absent,
      percentage: Math.round(((present + late * 0.5) / total) * 100)
    };
  };

  const stats = getAttendanceStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Davomat</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Guruhlar bo'yicha davomatni boshqarish
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800"
            />
          </div>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800"
          >
            <option value="">Guruhni tanlang</option>
            {groups.map(group => (
              <option key={group._id} value={group._id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedGroup && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-green-500" size={20} />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Keldi</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.present}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-yellow-500" size={20} />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Kechikdi</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.late}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="text-red-500" size={20} />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Kelmadi</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.absent}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-2">
              <Star className="text-blue-500" size={20} />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Foiz</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.percentage}%</p>
          </div>
        </div>
      )}

      {selectedGroup && students.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    O'quvchi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Holati
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ball
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amallar
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {students.map((student) => {
                  const record = attendance.find(a => 
                    (a.student_id._id || a.student_id) === student._id
                  );
                  const status = record?.status || 'ABSENT';
                  const studentScore = record?.score || 0;

                  return (
                    <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.full_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {student.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAttendanceChange(student._id, 'PRESENT')}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              status === 'PRESENT'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800 hover:bg-green-50'
                            }`}
                          >
                            Keldi
                          </button>
                          <button
                            onClick={() => handleAttendanceChange(student._id, 'LATE')}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              status === 'LATE'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800 hover:bg-yellow-50'
                            }`}
                          >
                            Kechikdi
                          </button>
                          <button
                            onClick={() => handleAttendanceChange(student._id, 'ABSENT')}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              status === 'ABSENT'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800 hover:bg-red-50'
                            }`}
                          >
                            Kelmadi
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {studentScore}
                          </span>
                          {isAdmin && (
                            <button
                              onClick={() => {
                                setScoringStudent(student);
                                setScore(studentScore.toString());
                                setShowScoreModal(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <AlertCircle size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setScoringStudent(student);
                              setScore(studentScore.toString());
                              setShowScoreModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Ball qo'shish
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!selectedGroup && (
        <div className="text-center py-12">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 dark:text-gray-400">
            Guruhni tanlang va davomatni boshlang
          </p>
        </div>
      )}

      {selectedGroup && students.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 dark:text-gray-400">
            Bu guruhda o'quvchilar mavjud emas
          </p>
        </div>
      )}

      {/* Score Modal */}
      {showScoreModal && scoringStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Ball qo'shish - {scoringStudent.full_name}
              </h3>
              <button
                onClick={() => {
                  setShowScoreModal(false);
                  setScoringStudent(null);
                  setScore('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ball (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0-100"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowScoreModal(false);
                    setScoringStudent(null);
                    setScore('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleScoreSave}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
