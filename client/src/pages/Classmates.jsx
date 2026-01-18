import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  Users, Search, User, Award, FileText, ArrowLeft,
  Mail, Calendar, Trophy
} from 'lucide-react';

export default function Classmates() {
  const navigate = useNavigate();
  const { student } = useAuth();
  const [classmates, setClassmates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClassmates();
  }, []);

  const fetchClassmates = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const res = await api.get('/student-auth/classmates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClassmates(res.data);
    } catch (error) {
      console.error('Error fetching classmates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClassmates = classmates.filter(classmate =>
    classmate.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Orqaga</span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Guruhdoshlar
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {classmates.length} ta guruhdosh
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Classmates Grid */}
        {filteredClassmates.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl shadow-lg">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Users size={40} className="text-indigo-500 dark:text-indigo-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? 'Guruhdosh topilmadi' : 'Hozircha guruhdoshlar yo\'q'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClassmates.map((classmate) => (
              <Link
                key={classmate.id}
                to={`/student/profile/${classmate.id}`}
                className="group bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
              >
                {/* Profile Image */}
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-2xl border-4 border-white dark:border-gray-700 bg-gradient-to-br from-indigo-400 to-purple-500 overflow-hidden shadow-xl group-hover:scale-105 transition-transform">
                    {classmate.profile_image ? (
                      <img
                        src={classmate.profile_image}
                        alt={classmate.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                        {classmate.full_name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div className={`absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                    classmate.status === 'ACTIVE'
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {classmate.status}
                  </div>
                </div>

                {/* Info */}
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {classmate.full_name}
                </h3>
                
                {classmate.group && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {classmate.group.name || classmate.group_id?.name}
                  </p>
                )}

                {/* Stats Preview */}
                <div className="flex items-center gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Award size={16} className="text-indigo-500" />
                    <span>Yutuqlar</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <FileText size={16} className="text-purple-500" />
                    <span>Sertifikat</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
