import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import {
    Users, Search, Award, FileText, User, Mail, Calendar, Trophy, ChevronRight, GraduationCap, Sparkles, TrendingUp, ShieldCheck
} from 'lucide-react';

export default function StudentClassmatesView() {
    const [classmates, setClassmates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchClassmates();
    }, []);

    const fetchClassmates = async () => {
        try {
            const res = await api.get('/student-auth/classmates');
            setClassmates(res.data);
        } catch (error) {
            console.error('Error fetching classmates:', error);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        const backendUrl = import.meta.env.VITE_API_URL || 'https://infastcrm-0b2r.onrender.com';
        const cleanUrl = url.startsWith('/') ? url : '/' + url;
        return `${backendUrl}${cleanUrl}`;
    };

    const filteredClassmates = classmates.filter(classmate =>
        classmate.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center py-24 text-gray-500 animate-pulse font-black uppercase tracking-[0.3em]">Jamiyat yuklanmoqda...</div>;

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-700">
            {/* Cinematic Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-4">
                <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[1.8rem] bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30 transform hover:rotate-6 transition-transform">
                        <Users className="text-white" size={24} md:size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-4xl font-black dark:text-white tracking-tighter italic uppercase bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Guruhdoshlar</h2>
                        <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 ml-1 opacity-70">Siz bilan birga o'suvchi iqtidorli jamoa</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="bg-gray-100 dark:bg-gray-800/50 p-1 md:p-1.5 rounded-[1.2rem] md:rounded-[1.5rem] flex items-center border border-white/5 backdrop-blur-xl shadow-inner w-full lg:w-96 group">
                        <Search className="ml-3 md:ml-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={16} md:size={18} />
                        <input
                            type="text"
                            placeholder="Guruhdoshingizni izlang..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-[10px] md:text-sm font-black dark:text-white placeholder:text-gray-500 w-full px-3 md:px-4 py-2.5 md:py-3 italic tracking-widest uppercase"
                        />
                    </div>
                    <div className="hidden sm:flex px-6 py-4 bg-indigo-500 text-white rounded-[1.5rem] shadow-xl shadow-indigo-500/20 items-center gap-3">
                        <Sparkles size={18} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{classmates.length}</span>
                    </div>
                </div>
            </div>

            {filteredClassmates.length === 0 ? (
                <div className="bg-white dark:bg-gray-800/40 rounded-[2rem] md:rounded-[3rem] p-12 md:p-24 text-center border border-dashed border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-50 dark:bg-gray-900/50 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 md:mb-8 text-gray-300 shadow-inner">
                        <Users size={32} md:size={48} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-2 md:mb-3 tracking-tight">Hech kim topilmadi</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm max-w-xs mx-auto font-medium">Ism bo'yicha qidiruv natija bermadi. Qidiruv so'zini tekshirib ko'ring.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredClassmates.map((classmate) => (
                        <Link
                            key={classmate.id || classmate._id}
                            to={`/student/profile/${classmate.id || classmate._id}`}
                            className="group bg-white dark:bg-gray-800 rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800/50 hover:-translate-y-2 flex flex-col items-center text-center relative overflow-hidden"
                        >
                            {/* Decorative Background */}
                            <div className="absolute top-0 inset-x-0 h-24 md:h-32 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent group-hover:from-indigo-500/10 group-hover:via-purple-500/10 transition-colors"></div>

                            <div className="relative z-10 mb-4 md:mb-6 mt-1 md:mt-2">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-indigo-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-[1.8rem] md:rounded-[2.5rem] border-4 border-white dark:border-gray-900 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden shadow-2xl relative z-10 transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
                                        {classmate.profile_image ? (
                                            <img
                                                src={getImageUrl(classmate.profile_image)}
                                                alt={classmate.full_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-indigo-500 dark:text-indigo-400 text-5xl font-black italic">
                                                {classmate.full_name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center ${classmate.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-400'
                                        } shadow-lg z-20`}>
                                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 space-y-2 mb-8 flex-1">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 tracking-tighter uppercase italic">
                                    {classmate.full_name}
                                </h3>
                                <div className="inline-block px-4 py-1.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <p className="text-[9px] uppercase font-black tracking-[0.2em] text-gray-400 dark:text-gray-500">
                                        {classmate.group?.name || 'Bitiruvchi'}
                                    </p>
                                </div>
                            </div>

                            <div className="relative z-10 flex items-center justify-center gap-4 pt-6 border-t border-gray-50 dark:border-gray-700/50 w-full group/stats">
                                <div className="flex flex-col items-center gap-1.5 flex-1 transition-transform group-hover/stats:-translate-y-1">
                                    <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 shadow-sm border border-orange-100/50 dark:border-orange-900/10">
                                        <TrendingUp size={18} md:size={20} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Reyting</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5 flex-1 transition-transform group-hover/stats:-translate-y-1 delay-75">
                                    <div className="w-9 h-9 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-500 shadow-sm border border-yellow-100/50 dark:border-yellow-900/10">
                                        <Trophy size={18} md:size={20} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Yutuqlar</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5 flex-1 transition-transform group-hover/stats:-translate-y-1 delay-150">
                                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-100/50 dark:border-indigo-900/10">
                                        <ShieldCheck size={18} md:size={20} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Sertifikat</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
