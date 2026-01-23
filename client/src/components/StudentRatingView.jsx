import { useState, useEffect, useMemo } from 'react';
import api from '../utils/api';
import {
    Trophy,
    Star,
    Medal,
    Crown,
    Users,
    TrendingUp,
    Zap,
    BookOpen,
    FileCode,
    Brain,
    GraduationCap,
    Filter,
    ChevronDown,
    Users2,
    Search,
    RefreshCw
} from 'lucide-react';

export default function StudentRatingView() {
    const [ratings, setRatings] = useState([]);
    const [filters, setFilters] = useState({ groups: [], courses: [] });
    const [selectedFilters, setSelectedFilters] = useState({ groupId: '', courseId: '' });
    const [myGlobalRating, setMyGlobalRating] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterLoading, setFilterLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchRatings();
    }, [selectedFilters]);

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        // Adjust based on your API structure. Assuming baseURL ends with /api/
        const apiBase = api.defaults.baseURL.replace('/api/', '');
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${apiBase}${cleanPath}`;
    };

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [filterRes, myRes] = await Promise.all([
                api.get('public/filters'),
                api.get('student-auth/my-rating')
            ]);
            setFilters(filterRes.data);
            setMyGlobalRating(myRes.data);
        } catch (error) {
            console.error('Error fetching initial rating data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRatings = async () => {
        try {
            setFilterLoading(true);
            const params = new URLSearchParams();
            if (selectedFilters.groupId) params.append('groupId', selectedFilters.groupId);
            if (selectedFilters.courseId) params.append('courseId', selectedFilters.courseId);
            params.append('limit', '1000'); // Get all students for the ranking

            const res = await api.get(`public/ratings?${params.toString()}`);
            setRatings(res.data);
        } catch (error) {
            console.error('Error fetching ratings:', error);
        } finally {
            setFilterLoading(false);
        }
    };

    // Calculate current context rating (if filtered, find me in the filtered list)
    const myCurrentRating = useMemo(() => {
        if (!myGlobalRating) return null;
        // If filtered, find me in the results
        const meInResults = ratings.find(r => r.student_id === myGlobalRating.student_id);
        if (meInResults) {
            return {
                ...meInResults,
                totalStudents: ratings.length,
                isGlobal: !selectedFilters.groupId && !selectedFilters.courseId
            };
        }
        // If not in results (filtered out or not matched), show global info but marked as filtered
        return {
            ...myGlobalRating,
            totalStudents: ratings.length,
            isGlobal: true,
            notFoundInFilter: true
        };
    }, [myGlobalRating, ratings, selectedFilters]);

    const filteredList = useMemo(() => {
        if (!searchTerm) return ratings;
        return ratings.filter(r =>
            r.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.group_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [ratings, searchTerm]);

    const top3 = ratings.slice(0, 3);

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-black uppercase tracking-[0.3em] animate-pulse text-sm">Reyting yuklanmoqda...</p>
        </div>
    );

    return (
        <div className="space-y-12 pb-32 animate-in fade-in duration-700">
            {/* Elegant Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-4">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 animate-pulse"></div>
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-[2.2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-all duration-500">
                            <Trophy className="text-white" size={32} md:size={40} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black dark:text-white tracking-tighter italic uppercase bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Elite Leaderboard</h2>
                        <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.4em] mt-2 ml-1 opacity-70 flex items-center gap-2">
                            <Zap size={12} className="text-yellow-400" /> Akademiya reyting tizimi
                        </p>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Izlash..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white dark:bg-gray-800 border-none rounded-2xl pl-12 pr-6 py-3.5 text-xs font-bold focus:ring-4 ring-indigo-500/10 transition-all dark:text-white shadow-xl shadow-gray-200/10 dark:shadow-none w-full md:w-48"
                        />
                    </div>

                    <div className="relative group">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" size={16} />
                        <select
                            value={selectedFilters.courseId}
                            onChange={(e) => setSelectedFilters(prev => ({ ...prev, courseId: e.target.value }))}
                            className="appearance-none bg-white dark:bg-gray-800 border-none rounded-2xl pl-12 pr-10 py-3.5 text-xs font-bold focus:ring-4 ring-indigo-500/10 transition-all dark:text-white shadow-xl shadow-gray-200/10 dark:shadow-none min-w-[160px]"
                        >
                            <option value="">Barcha Fanlar</option>
                            {filters.courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                    </div>

                    <div className="relative group">
                        <Users2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors" size={16} />
                        <select
                            value={selectedFilters.groupId}
                            onChange={(e) => setSelectedFilters(prev => ({ ...prev, groupId: e.target.value }))}
                            className="appearance-none bg-white dark:bg-gray-800 border-none rounded-2xl pl-12 pr-10 py-3.5 text-xs font-bold focus:ring-4 ring-indigo-500/10 transition-all dark:text-white shadow-xl shadow-gray-200/10 dark:shadow-none min-w-[150px]"
                        >
                            <option value="">Barcha Guruhlar</option>
                            {filters.groups.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                    </div>

                    <button
                        onClick={() => { setSelectedFilters({ groupId: '', courseId: '' }); setSearchTerm(''); }}
                        className="p-3.5 bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-indigo-500 rounded-2xl transition-all"
                    >
                        <RefreshCw size={18} className={filterLoading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Compact Personal Rank Summary */}
            {myCurrentRating && (
                <div className="relative group overflow-hidden animate-in slide-in-from-top duration-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 via-purple-600/5 to-pink-600/5 rounded-[2.2rem] blur-xl"></div>
                    <div className="relative z-10 bg-white/40 dark:bg-[#0f111a]/40 backdrop-blur-2xl rounded-[2.2rem] p-5 md:p-6 border border-white/20 dark:border-white/5 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
                        <div className="flex items-center gap-5">
                            <div className="relative shrink-0">
                                <div className="absolute -inset-1 bg-gradient-to-tr from-yellow-400 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <div className="w-14 h-14 md:w-16 md:h-16 bg-[#1a1c2e] rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden relative shadow-lg">
                                    {myCurrentRating.profile_image ? (
                                        <img src={getImageUrl(myCurrentRating.profile_image)} className="w-full h-full object-cover" alt="Me" />
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <span className="text-white/40 text-[7px] font-black uppercase mb-0.5">Rank</span>
                                            <span className="text-xl md:text-2xl font-black text-yellow-400 italic tabular-nums">#{myCurrentRating.rank}</span>
                                        </div>
                                    )}
                                </div>
                                {myCurrentRating.profile_image && (
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-black font-black text-[8px] px-2.5 py-0.5 rounded-full shadow-lg z-20 whitespace-nowrap">
                                        #{myCurrentRating.rank} O'RIN
                                    </div>
                                )}
                            </div>

                            <div className="text-center md:text-left">
                                <h3 className="text-base md:text-xl font-black italic uppercase tracking-tight dark:text-white flex items-center gap-2 justify-center md:justify-start">
                                    {myCurrentRating.full_name}
                                    <Star className="text-yellow-400 fill-yellow-400 animate-pulse" size={14} />
                                </h3>
                                <div className="flex items-center gap-3 mt-1 justify-center md:justify-start">
                                    <span className="text-[9px] font-black text-white px-2 py-0.5 bg-indigo-600 rounded-md uppercase tracking-widest">
                                        {myCurrentRating.isGlobal ? 'Global' : 'Guruh'}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[10px] md:text-xs font-black text-indigo-500 uppercase tracking-tighter italic">
                                        <TrendingUp size={12} /> {(myCurrentRating.total_points || myCurrentRating.totalPoints || 0).toLocaleString()} Power Points
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2 md:gap-3 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-white/5 pt-5 lg:pt-0 lg:pl-6">
                            {[
                                { label: 'Darslar', val: myCurrentRating.stats?.lessons || 0, icon: BookOpen, color: 'text-blue-400' },
                                { label: 'Vazifa', val: myCurrentRating.stats?.tasks || 0, icon: FileCode, color: 'text-purple-400' },
                                { label: 'Quiz', val: myCurrentRating.stats?.quizzes || 0, icon: Zap, color: 'text-amber-400' },
                                { label: 'Exam', val: myCurrentRating.stats?.exams || 0, icon: GraduationCap, color: 'text-rose-400' }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col items-center bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-xl min-w-[65px] border border-transparent hover:border-indigo-500/20 transition-all">
                                    <stat.icon size={12} className={stat.color} />
                                    <span className="text-sm font-black dark:text-white mt-0.5 tabular-nums">{stat.val}</span>
                                    <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Podium for top 3 - Only visible when not searching */}
            {!searchTerm && top3.length > 0 && (
                <div className={`grid grid-cols-3 gap-4 md:gap-16 items-end max-w-5xl mx-auto pt-24 px-4 relative transition-all duration-500 ${filterLoading ? 'opacity-50 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
                    {/* 2nd Place */}
                    {top3[1] && (
                        <div className="flex flex-col items-center gap-6 group hover:-translate-y-2 transition-all duration-500">
                            <div className="relative">
                                <div className="w-20 h-20 md:w-36 md:h-36 rounded-full border-4 border-gray-400/30 p-1.5 bg-white dark:bg-gray-800 shadow-2xl relative z-10 overflow-hidden">
                                    {top3[1].profile_image ? (
                                        <img src={getImageUrl(top3[1].profile_image)} className="w-full h-full object-cover" alt="2nd" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                            <Users size={32} />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-400 text-white text-[10px] md:text-sm font-black px-4 md:px-6 py-1.5 rounded-full shadow-2xl z-20 uppercase italic">2nd Rank</div>
                            </div>
                            <div className="text-center w-full">
                                <p className="text-xs md:text-xl font-black dark:text-white truncate tracking-tight uppercase italic">{top3[1].full_name}</p>
                                <p className="text-[10px] md:text-lg text-indigo-500 font-black mt-1 tabular-nums italic">{top3[1].total_points.toLocaleString()} pts</p>
                            </div>
                            <div className="w-full h-20 md:h-44 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 dark:from-gray-700/50 dark:via-gray-800/50 dark:to-gray-900/50 rounded-t-[2rem] md:rounded-t-[3rem] shadow-2xl border-x border-t border-gray-100 dark:border-white/5 backdrop-blur-3xl"></div>
                        </div>
                    )}

                    {/* 1st Place - The King */}
                    {top3[0] && (
                        <div className="flex flex-col items-center gap-8 group hover:-translate-y-4 transition-all duration-700">
                            <div className="relative pt-12">
                                <div className="absolute -top-6 md:-top-10 left-1/2 -translate-x-1/2 animate-bounce z-30">
                                    <Crown className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] filter brightness-110" size={48} md:size={72} strokeWidth={2.5} />
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-yellow-400/40 blur-3xl animate-pulse"></div>
                                    <div className="w-24 h-24 md:w-48 md:h-48 rounded-full border-4 md:border-8 border-yellow-400 p-2 md:p-3 bg-white dark:bg-gray-800 shadow-[0_0_50px_rgba(250,204,21,0.3)] relative z-10 overflow-hidden">
                                        {top3[0].profile_image ? (
                                            <img src={getImageUrl(top3[0].profile_image)} className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700" alt="Legend" />
                                        ) : (
                                            <div className="w-full h-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-500">
                                                <Users size={48} md:size={64} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] md:text-lg font-black px-6 md:px-10 py-2 md:py-3 rounded-full shadow-[0_15px_35px_rgba(250,204,21,0.5)] z-20 uppercase italic tracking-tighter">THE LEGEND</div>
                            </div>
                            <div className="text-center w-full">
                                <p className="text-sm md:text-3xl font-black dark:text-white truncate tracking-tighter italic uppercase bg-gradient-to-b from-white to-gray-400 bg-clip-text">{top3[0].full_name}</p>
                                <p className="text-xs md:text-2xl text-yellow-500 font-black mt-2 tabular-nums italic drop-shadow-lg">{top3[0].total_points.toLocaleString()} PTS</p>
                            </div>
                            <div className="w-full h-32 md:h-72 bg-gradient-to-b from-yellow-400 via-orange-500 to-red-600 dark:from-yellow-400/40 dark:via-orange-600/40 dark:to-red-700/60 rounded-t-[2.5rem] md:rounded-t-[4rem] shadow-2xl border-x border-t border-yellow-300/50 dark:border-white/10 backdrop-blur-3xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            </div>
                        </div>
                    )}

                    {/* 3rd Place */}
                    {top3[2] && (
                        <div className="flex flex-col items-center gap-6 group hover:-translate-y-2 transition-all duration-500">
                            <div className="relative">
                                <div className="w-18 h-18 md:w-32 md:h-32 rounded-full border-4 border-amber-600/30 p-1.5 bg-white dark:bg-gray-800 shadow-2xl relative z-10 overflow-hidden">
                                    {top3[2].profile_image ? (
                                        <img src={getImageUrl(top3[2].profile_image)} className="w-full h-full object-cover" alt="3rd" />
                                    ) : (
                                        <div className="w-full h-full bg-amber-50 dark:bg-amber-900/10 flex items-center justify-center text-amber-600">
                                            <Users size={28} />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[10px] md:text-sm font-black px-4 md:px-6 py-1.5 rounded-full shadow-2xl z-20 uppercase italic">3rd Rank</div>
                            </div>
                            <div className="text-center w-full">
                                <p className="text-xs md:text-xl font-black dark:text-white truncate tracking-tight uppercase italic">{top3[2].full_name}</p>
                                <p className="text-[10px] md:text-lg text-indigo-500 font-black mt-1 tabular-nums italic">{top3[2].total_points.toLocaleString()} pts</p>
                            </div>
                            <div className="w-full h-16 md:h-36 bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700 dark:from-amber-700/40 dark:via-amber-800/40 dark:to-amber-950/40 rounded-t-[1.8rem] md:rounded-t-[2.8rem] shadow-2xl border-x border-t border-amber-500/20 dark:border-white/5 backdrop-blur-3xl"></div>
                        </div>
                    )}
                </div>
            )}

            {/* Elite Table List - Showing Everyone starting from Rank 1 */}
            <div className={`bg-white dark:bg-[#0f111a] rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] dark:shadow-none overflow-hidden border border-gray-100 dark:border-white/5 backdrop-blur-2xl transition-all duration-500 ${filterLoading ? 'opacity-50 blur-[2px] scale-[0.99]' : 'opacity-100 blur-0 scale-100'}`}>
                <div className="p-8 md:p-10 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex items-center justify-between">
                    <h3 className="font-black text-xl md:text-2xl text-gray-900 dark:text-white flex items-center gap-4 italic uppercase tracking-tighter">
                        <TrendingUp size={28} className="text-indigo-500" />
                        O'quvchilar Umumiy Reytingi
                    </h3>
                    <div className="px-5 py-2 bg-indigo-600 rounded-2xl text-[10px] md:text-xs font-black text-white uppercase tracking-widest shadow-xl shadow-indigo-600/30">
                        {filteredList.length} TALABA
                    </div>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-white/5 max-h-[1000px] overflow-y-auto custom-scrollbar">
                    {filteredList.length === 0 ? (
                        <div className="p-20 text-center">
                            <Users className="mx-auto text-gray-200 dark:text-white/5 mb-4" size={64} />
                            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Hech kim topilmadi</p>
                        </div>
                    ) : (filteredList.map((rating, index) => {
                        const isMe = myGlobalRating && rating.student_id === myGlobalRating.student_id;
                        const uniqueId = rating.student_id || rating._id || `rating-${index}`;

                        return (
                            <div key={uniqueId} className={`flex items-center gap-4 md:gap-8 p-6 md:p-10 hover:bg-gray-50/80 dark:hover:bg-white/5 transition-all duration-500 group relative ${isMe ? 'bg-indigo-50/50 dark:bg-indigo-600/10' : ''}`}>
                                {isMe && <div className="absolute left-0 top-0 bottom-0 w-2 bg-indigo-600 shadow-[4px_0_15px_rgba(79,70,229,0.5)]"></div>}

                                <div className="w-8 md:w-16 text-center shrink-0">
                                    <span className={`text-sm md:text-2xl font-black italic tabular-nums ${rating.rank <= 3 ? 'text-yellow-500' : 'text-gray-300 dark:text-white/20'}`}>
                                        #{rating.rank}
                                    </span>
                                </div>

                                <div className="relative shrink-0">
                                    <div className={`w-12 h-12 md:w-20 md:h-20 rounded-[1.4rem] md:rounded-[1.8rem] overflow-hidden border-2 md:border-4 transition-all duration-500 shadow-xl ${isMe ? 'border-indigo-600 scale-110' : 'border-transparent group-hover:border-gray-200 dark:group-hover:border-white/10'}`}>
                                        {rating.profile_image ? (
                                            <img src={getImageUrl(rating.profile_image)} className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700" alt="Av" />
                                        ) : (
                                            <div className={`w-full h-full flex items-center justify-center text-white/20 ${rating.rank <= 3 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-100 dark:bg-white/5'}`}>
                                                <Users size={rating.rank <= 3 ? 32 : 24} />
                                            </div>
                                        )}
                                    </div>
                                    {rating.rank <= 3 && (
                                        <div className="absolute -top-2 -right-2 bg-yellow-500 text-white p-1 rounded-full shadow-lg">
                                            {rating.rank === 1 ? <Crown size={12} /> : <Star size={12} />}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3">
                                        <p className={`font-black text-base md:text-2xl text-gray-900 dark:text-white truncate tracking-tight uppercase italic ${isMe ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                                            {rating.full_name}
                                        </p>
                                        {isMe && (
                                            <span className="px-4 py-1.5 bg-indigo-600 text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-indigo-600/30">
                                                Siz
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 md:gap-5 mt-2">
                                        <div className="flex items-center gap-2">
                                            <Users2 size={12} className="text-gray-400" />
                                            <span className="text-[10px] md:text-xs font-black text-gray-400 dark:text-white/40 uppercase tracking-widest">{rating.group_name}</span>
                                        </div>
                                        <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-indigo-500/20"></div>
                                        <div className="flex items-center gap-2">
                                            <Star size={12} className="text-yellow-500" />
                                            <span className="text-[10px] md:text-xs font-black text-indigo-500/60 uppercase tracking-widest italic">{rating.course_name}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right shrink-0">
                                    <div className="flex items-baseline gap-1.5 justify-end">
                                        <span className={`text-2xl md:text-5xl font-black tracking-tighter tabular-nums transition-colors ${rating.rank <= 3 ? 'text-yellow-500' : 'text-gray-900 dark:text-white group-hover:text-indigo-500'}`}>
                                            {rating.total_points.toLocaleString()}
                                        </span>
                                        <span className="text-[10px] md:text-xs font-black text-gray-300 dark:text-white/20 uppercase italic">Power</span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-end gap-1 opacity-60">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= (rating.total_points > 10000 ? 5 : 3) ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-white/10'}`}></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }))}
                </div>
            </div>
        </div>
    );
}
