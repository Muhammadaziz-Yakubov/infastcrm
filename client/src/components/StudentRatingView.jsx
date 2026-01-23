import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
    Trophy,
    Star,
    Medal,
    Crown,
    Users,
    TrendingUp,
    Target as TargetIcon,
    Award,
    Zap,
    BookOpen,
    FileCode,
    Brain,
    GraduationCap
} from 'lucide-react';

export default function StudentRatingView() {
    const [ratings, setRatings] = useState([]);
    const [myRating, setMyRating] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [globalRes, myRes] = await Promise.all([
                api.get('/public/ratings'),
                api.get('/student-auth/my-rating')
            ]);
            setRatings(globalRes.data);
            setMyRating(myRes.data);
        } catch (error) {
            console.error('Error fetching ratings:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return <Crown className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" size={32} strokeWidth={2.5} />;
        if (rank === 2) return <Medal className="text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]" size={24} strokeWidth={2.5} />;
        if (rank === 3) return <Medal className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" size={24} strokeWidth={2.5} />;
        return <span className="text-gray-400 font-black text-sm tabular-nums">{rank}</span>;
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-black uppercase tracking-[0.3em] animate-pulse">Reyting hisoblanmoqda...</p>
        </div>
    );

    const top3 = ratings.slice(0, 3);
    const others = ratings.slice(3);

    return (
        <div className="space-y-12 pb-32 animate-in fade-in duration-700">
            {/* Elegant Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 animate-pulse"></div>
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-all duration-500">
                            <Trophy className="text-white" size={32} md:size={40} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black dark:text-white tracking-tighter italic uppercase bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Elite Leaderboard</h2>
                        <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.4em] mt-2 ml-1 opacity-70 flex items-center gap-2">
                            <Zap size={12} className="text-yellow-400" /> Akademiya eng kuchli talabalari
                        </p>
                    </div>
                </div>
            </div>

            {/* Premium Personal Rank Card */}
            {myRating && (
                <div className="group relative bg-[#0f111a] rounded-[3rem] p-8 md:p-12 text-white shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden border border-white/5">
                    {/* Animated Decorative Blobs */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full -mr-40 -mt-40 blur-[120px] group-hover:bg-indigo-600/20 transition-all duration-1000"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full -ml-20 -mb-20 blur-[100px]"></div>

                    <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-12">
                        <div className="flex flex-col md:flex-row items-center gap-8 w-full xl:w-auto">
                            <div className="relative group/avatar">
                                <div className="absolute -inset-1 bg-gradient-to-tr from-yellow-400 to-orange-600 rounded-[2.5rem] blur opacity-25 group-hover/avatar:opacity-50 transition-opacity"></div>
                                <div className="w-24 h-24 md:w-32 md:h-32 bg-[#1a1c2e] rounded-[2.2rem] flex flex-col items-center justify-center border border-white/10 shadow-2xl relative z-10 overflow-hidden">
                                    {myRating.profile_image ? (
                                        <img src={myRating.profile_image} className="w-full h-full object-cover" alt="Me" />
                                    ) : (
                                        <>
                                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">O'rin</span>
                                            <span className="text-4xl md:text-6xl font-black italic tracking-tighter text-yellow-400">#{myRating.rank}</span>
                                        </>
                                    )}
                                </div>
                                {myRating.profile_image && (
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black font-black text-xs px-4 py-1 rounded-full shadow-xl shadow-yellow-500/30 z-20">
                                        #{myRating.rank}
                                    </div>
                                )}
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tight mb-4 flex items-center gap-3 justify-center md:justify-start">
                                    {myRating.full_name}
                                    <Star className="text-yellow-400 fill-yellow-400 animate-pulse" size={24} />
                                </h3>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                    <div className="px-5 py-2.5 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group/stat">
                                        <Users size={14} className="text-indigo-400 group-hover/stat:scale-120 transition-transform" /> {myRating.totalStudents} TA O'QUVCHI
                                    </div>
                                    <div className="px-5 py-2.5 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <TrendingUp size={14} className="text-emerald-400" /> {Math.ceil(myRating.totalPoints / 1000)}k POWER
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full xl:w-auto">
                            {[
                                { label: 'Darslar', val: myRating.stats?.lessons || 0, icon: BookOpen, color: 'text-blue-400' },
                                { label: 'Vazifa', val: myRating.stats?.tasks || 0, icon: FileCode, color: 'text-purple-400' },
                                { label: 'Quiz', val: myRating.stats?.quizzes || 0, icon: Zap, color: 'text-amber-400' },
                                { label: 'Imtihon', val: myRating.stats?.exams || 0, icon: GraduationCap, color: 'text-rose-400' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/5 p-4 rounded-3xl border border-white/5 flex flex-col items-center gap-1 min-w-[100px]">
                                    <stat.icon size={16} className={stat.color} />
                                    <span className="text-[8px] font-black text-white/40 uppercase mt-1">{stat.label}</span>
                                    <span className="text-xl font-black tabular-nums">{stat.val}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col items-center xl:items-end gap-2 w-full xl:w-auto border-t xl:border-t-0 xl:border-l border-white/5 pt-8 xl:pt-0 xl:pl-12">
                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1 italic">Total Points</span>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <span className="text-5xl md:text-7xl font-black tracking-tighter italic bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent tabular-nums">
                                        {myRating.totalPoints.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Podium for top 3 - Elite Design */}
            <div className="grid grid-cols-3 gap-6 md:gap-16 items-end max-w-5xl mx-auto pt-24 px-4 relative">
                {/* 2nd Place */}
                {top3[1] && (
                    <div className="flex flex-col items-center gap-6 group hover:-translate-y-2 transition-all duration-500">
                        <div className="relative">
                            <div className="w-20 h-20 md:w-36 md:h-36 rounded-full border-4 border-gray-400/30 p-2 bg-white dark:bg-gray-800 shadow-2xl relative z-10 overflow-hidden">
                                {top3[1].profile_image ? (
                                    <img src={top3[1].profile_image} className="w-full h-full object-cover" alt="2nd" />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                        <Users size={32} />
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-400 text-white text-[10px] md:text-sm font-black px-4 md:px-6 py-1.5 rounded-full shadow-2xl z-20 uppercase italic">2nd</div>
                        </div>
                        <div className="text-center w-full">
                            <p className="text-xs md:text-xl font-black dark:text-white truncate tracking-tight uppercase italic">{top3[1].full_name}</p>
                            <p className="text-[10px] md:text-lg text-indigo-500 font-black mt-1 tabular-nums italic">{top3[1].total_points.toLocaleString()} pts</p>
                        </div>
                        <div className="w-full h-24 md:h-44 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 dark:from-gray-700/50 dark:via-gray-800/50 dark:to-gray-900/50 rounded-t-[2rem] md:rounded-t-[3rem] shadow-2xl border-x border-t border-gray-100 dark:border-white/5 backdrop-blur-3xl relative overflow-hidden">
                            <div className="absolute inset-0 opacity-5 mask-gradient"></div>
                        </div>
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
                                        <img src={top3[0].profile_image} className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700" alt="Legend" />
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
                        <div className="w-full h-36 md:h-72 bg-gradient-to-b from-yellow-400 via-orange-500 to-red-600 dark:from-yellow-400/40 dark:via-orange-600/40 dark:to-red-700/60 rounded-t-[2.5rem] md:rounded-t-[4rem] shadow-2xl border-x border-t border-yellow-300/50 dark:border-white/10 backdrop-blur-3xl relative overflow-hidden">
                            <div className="absolute inset-x-0 top-0 h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                    </div>
                )}

                {/* 3rd Place */}
                {top3[2] && (
                    <div className="flex flex-col items-center gap-6 group hover:-translate-y-2 transition-all duration-500">
                        <div className="relative">
                            <div className="w-18 h-18 md:w-32 md:h-32 rounded-full border-4 border-amber-600/30 p-2 bg-white dark:bg-gray-800 shadow-2xl relative z-10 overflow-hidden">
                                {top3[2].profile_image ? (
                                    <img src={top3[2].profile_image} className="w-full h-full object-cover" alt="3rd" />
                                ) : (
                                    <div className="w-full h-full bg-amber-50 dark:bg-amber-900/10 flex items-center justify-center text-amber-600">
                                        <Users size={28} />
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[10px] md:text-sm font-black px-4 md:px-6 py-1.5 rounded-full shadow-2xl z-20 uppercase italic">3rd</div>
                        </div>
                        <div className="text-center w-full">
                            <p className="text-xs md:text-xl font-black dark:text-white truncate tracking-tight uppercase italic">{top3[2].full_name}</p>
                            <p className="text-[10px] md:text-lg text-indigo-500 font-black mt-1 tabular-nums italic">{top3[2].total_points.toLocaleString()} pts</p>
                        </div>
                        <div className="w-full h-20 md:h-36 bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700 dark:from-amber-700/40 dark:via-amber-800/40 dark:to-amber-950/40 rounded-t-[1.8rem] md:rounded-t-[2.8rem] shadow-2xl border-x border-t border-amber-500/20 dark:border-white/5 backdrop-blur-3xl"></div>
                    </div>
                )}
            </div>

            {/* Elite Table List */}
            <div className="bg-white dark:bg-[#0f111a] rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] dark:shadow-none overflow-hidden border border-gray-100 dark:border-white/5 backdrop-blur-2xl">
                <div className="p-8 md:p-10 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex items-center justify-between">
                    <h3 className="font-black text-xl md:text-2xl text-gray-900 dark:text-white flex items-center gap-4 italic uppercase tracking-tighter">
                        <TrendingUp size={28} className="text-indigo-500 animate-bounce" />
                        O'quvchilar Reytingi
                    </h3>
                    <div className="px-5 py-2 bg-indigo-600 rounded-2xl text-[10px] md:text-xs font-black text-white uppercase tracking-widest shadow-xl shadow-indigo-600/30">
                        {ratings.length} MEMBERS
                    </div>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-white/5">
                    {others.map((rating, index) => {
                        const isMe = myRating && rating.student_id === myRating.student_id;
                        return (
                            <div key={index} className={`flex items-center gap-4 md:gap-8 p-6 md:p-8 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-500 group relative ${isMe ? 'bg-indigo-50/50 dark:bg-indigo-600/10' : ''}`}>
                                {isMe && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600"></div>}

                                <div className="w-8 md:w-12 text-center shrink-0">
                                    <span className="text-sm md:text-xl font-black text-gray-300 dark:text-white/20 tabular-nums">#{rating.rank}</span>
                                </div>

                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-indigo-500/50 transition-all duration-500 shadow-lg">
                                        {rating.profile_image ? (
                                            <img src={rating.profile_image} className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform" alt="Av" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400">
                                                <Users size={24} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3">
                                        <p className={`font-black text-base md:text-xl text-gray-900 dark:text-white truncate tracking-tight uppercase italic ${isMe ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                                            {rating.full_name}
                                        </p>
                                        {isMe && <span className="px-3 py-0.5 bg-indigo-600 text-white text-[8px] font-black rounded-full uppercase tracking-widest">Siz</span>}
                                    </div>
                                    <div className="flex items-center gap-4 mt-1.5">
                                        <span className="text-[9px] font-black text-gray-400 dark:text-white/40 uppercase tracking-[0.2em]">{rating.group_name}</span>
                                        <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/10"></div>
                                        <div className="flex items-center gap-1">
                                            <Zap size={10} className="text-yellow-500" />
                                            <span className="text-[9px] font-black text-yellow-600/80 dark:text-yellow-500/80 uppercase">Active Elite</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right shrink-0">
                                    <div className="flex items-baseline gap-1 justify-end">
                                        <span className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tighter tabular-nums group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {rating.total_points.toLocaleString()}
                                        </span>
                                        <span className="text-[10px] font-black text-gray-300 dark:text-white/20 uppercase italic">Pts</span>
                                    </div>
                                    <div className="mt-1 flex items-center justify-end gap-1">
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className={`w-1 h-1 rounded-full ${i <= 4 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-white/10'}`}></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
