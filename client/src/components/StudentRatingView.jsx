import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
    Trophy,
    Star,
    Medal,
    Crown,
    Users,
    TrendingUp,
    Target as TargetIcon
} from 'lucide-react';

export default function StudentRatingView() {
    const [ratings, setRatings] = useState([]);
    const [myRating, setMyRating] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRatings();
        fetchMyRating();
    }, []);

    const fetchRatings = async () => {
        try {
            const response = await api.get('/public/ratings');
            const transformedData = response.data.map(item => ({
                rank: item.rank,
                averageScore: Math.round(item.percentage),
                student: {
                    full_name: item.full_name,
                    group: {
                        name: item.group_name
                    }
                }
            }));
            setRatings(transformedData);
        } catch (error) {
            console.error('Error fetching ratings:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyRating = async () => {
        try {
            const token = localStorage.getItem('studentToken');
            const response = await api.get('/student-auth/my-rating', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyRating(response.data);
        } catch (error) {
            console.error('Error fetching my rating:', error);
        }
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return <Crown className="text-yellow-400 drop-shadow-xl" size={24} strokeWidth={2.5} />;
        if (rank === 2) return <Medal className="text-gray-300 drop-shadow-lg" size={20} strokeWidth={2.5} />;
        if (rank === 3) return <Medal className="text-amber-500 drop-shadow-md" size={20} strokeWidth={2.5} />;
        return <span className="text-gray-400 font-black text-xs tabular-nums">{rank}</span>;
    };

    if (loading) return <div className="text-center py-24 text-gray-500 animate-pulse font-black uppercase tracking-[0.3em]">Reyting hisoblanmoqda...</div>;

    const top3 = ratings.slice(0, 3);

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4">
                <div className="flex items-center gap-4 md:gap-5">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[1.8rem] bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 flex items-center justify-center shadow-2xl shadow-orange-500/30 transform hover:rotate-6 transition-transform">
                        <Trophy className="text-white" size={24} md:size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-4xl font-black dark:text-white tracking-tighter italic uppercase bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">Akademiya Reytingi</h2>
                        <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 ml-1 opacity-70">Sizning natijalaringiz va umumiy yutuqlar</p>
                    </div>
                </div>
            </div>

            {myRating && (
                <div className="group relative bg-gradient-to-br from-[#1a1c2e] via-[#242745] to-[#1a1c2e] rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-white shadow-2xl shadow-indigo-500/20 overflow-hidden border border-white/5">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full -mr-40 -mt-40 blur-[100px] transition-transform group-hover:scale-125 duration-1000"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/5 rounded-full -ml-20 -mb-20 blur-[80px]"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="flex items-center gap-6 md:gap-10 w-full md:w-auto">
                            <div className="relative">
                                <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 animate-pulse"></div>
                                <div className="w-20 h-20 md:w-28 md:h-28 bg-white/5 backdrop-blur-2xl rounded-2xl md:rounded-[2.2rem] flex flex-col items-center justify-center border border-white/10 shadow-inner relative z-10">
                                    <span className="text-white/40 text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1">O'rin</span>
                                    <span className="text-3xl md:text-5xl font-black italic tracking-tighter text-yellow-400">#{myRating.rank}</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tight mb-2">Sizning ko'rsatkichingiz</h3>
                                <div className="flex flex-wrap gap-4">
                                    <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <Users size={14} className="text-indigo-400" /> {myRating.totalStudents} TA O'QUVCHI ORASIDA
                                    </div>
                                    <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <TargetIcon size={14} className="text-emerald-400" /> AKTIV HOLATDA
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start md:items-end flex-col gap-2 w-full md:w-auto mt-4 md:mt-0">
                            <span className="text-white/40 text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1 uppercase tracking-widest">Natija</span>
                            <div className="flex items-center gap-5">
                                <div className="text-right">
                                    <span className="text-4xl md:text-6xl font-black tracking-tighter italic bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">{myRating.averageScore}%</span>
                                </div>
                                <div className="w-1.5 h-16 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="w-full bg-gradient-to-t from-orange-600 to-yellow-400 rounded-full transition-all duration-1000 origin-bottom"
                                        style={{ height: `${myRating.averageScore}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Podium for top 3 */}
            <div className="grid grid-cols-3 gap-4 md:gap-12 items-end max-w-4xl mx-auto pt-20 px-4">
                {/* 2nd Place */}
                {top3[1] && (
                    <div className="flex flex-col items-center gap-4 md:gap-6 group hover:-translate-y-1 transition-transform duration-500">
                        <div className="relative">
                            <div className="w-16 h-16 md:w-28 md:h-28 rounded-full border-4 border-gray-300 dark:border-gray-600 p-1.5 md:p-2 bg-white dark:bg-gray-800 shadow-2xl overflow-hidden relative z-10">
                                <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                    <Users size={20} md:size={28} strokeWidth={1.5} />
                                </div>
                            </div>
                            <div className="absolute -bottom-2 md:-bottom-3 left-1/2 -translate-x-1/2 bg-gray-400 text-white text-[8px] md:text-[11px] font-black px-2 md:px-4 py-1 rounded-full shadow-xl shadow-gray-400/30 z-20 uppercase tracking-widest border border-white/20">2nd</div>
                        </div>
                        <div className="text-center w-full">
                            <p className="text-[10px] md:text-base font-black dark:text-white truncate tracking-tight">{top3[1].student.full_name}</p>
                            <p className="text-[8px] md:text-sm text-indigo-500 font-black uppercase tracking-widest mt-1 italic">{top3[1].averageScore}%</p>
                        </div>
                        <div className="w-full h-16 md:h-32 bg-gradient-to-b from-gray-200/80 via-gray-300/80 to-gray-400/80 dark:from-gray-700/50 dark:via-gray-800/50 dark:to-gray-900/50 rounded-t-[1.5rem] md:rounded-t-[2.5rem] shadow-2xl border-x border-t border-gray-200 dark:border-white/5 backdrop-blur-3xl"></div>
                    </div>
                )}

                {/* 1st Place */}
                {top3[0] && (
                    <div className="flex flex-col items-center gap-4 md:gap-6 group hover:-translate-y-2 transition-transform duration-700">
                        <div className="relative pt-4 md:pt-8">
                            <div className="absolute -top-4 md:-top-6 left-1/2 -translate-x-1/2 animate-bounce z-30">
                                <Crown className="text-yellow-400 drop-shadow-2xl filter brightness-110" size={32} md:size={56} strokeWidth={2.5} />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-yellow-400/30 blur-3xl animate-pulse"></div>
                                <div className="w-20 h-20 md:w-40 md:h-40 rounded-full border-4 md:border-8 border-yellow-400/30 p-1.5 md:p-2.5 bg-white dark:bg-gray-800 shadow-inner overflow-hidden relative z-10">
                                    <div className="w-full h-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-500">
                                        <Users size={32} md:size={48} strokeWidth={1} />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-2 md:-bottom-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-[9px] md:text-xs font-black px-4 md:px-6 py-1.5 md:py-2 rounded-full shadow-2xl shadow-yellow-500/40 z-20 uppercase tracking-widest border border-white/20 italic">1st</div>
                        </div>
                        <div className="text-center w-full">
                            <p className="text-xs md:text-2xl font-black dark:text-white truncate tracking-tighter italic uppercase">{top3[0].student.full_name}</p>
                            <p className="text-[10px] md:text-base text-yellow-500 font-black uppercase tracking-widest mt-1 italic">{top3[0].averageScore}% pts</p>
                        </div>
                        <div className="w-full h-24 md:h-56 bg-gradient-to-b from-yellow-400/80 via-orange-500/80 to-red-600/80 dark:from-yellow-500/40 dark:via-orange-600/40 dark:to-red-700/40 rounded-t-[2rem] md:rounded-t-[3.5rem] shadow-2xl border-x border-t border-yellow-300 dark:border-white/10 backdrop-blur-3xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        </div>
                    </div>
                )}

                {/* 3rd Place */}
                {top3[2] && (
                    <div className="flex flex-col items-center gap-4 md:gap-6 group hover:-translate-y-1 transition-transform duration-500">
                        <div className="relative">
                            <div className="w-14 h-14 md:w-24 md:h-24 rounded-full border-4 border-amber-600/30 p-1.5 md:p-2 bg-white dark:bg-gray-800 shadow-2xl overflow-hidden relative z-10">
                                <div className="w-full h-full bg-amber-50 dark:bg-amber-900/10 flex items-center justify-center text-amber-600">
                                    <Users size={16} md:size={24} strokeWidth={1.5} />
                                </div>
                            </div>
                            <div className="absolute -bottom-2 md:-bottom-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[8px] md:text-[11px] font-black px-2 md:px-4 py-1 rounded-full shadow-xl shadow-amber-600/30 z-20 uppercase tracking-widest border border-white/20">3rd</div>
                        </div>
                        <div className="text-center w-full">
                            <p className="text-[10px] md:text-base font-black dark:text-white truncate tracking-tight">{top3[2].student.full_name}</p>
                            <p className="text-[8px] md:text-sm text-indigo-500 font-black uppercase tracking-widest mt-1 italic">{top3[2].averageScore}%</p>
                        </div>
                        <div className="w-full h-12 md:h-28 bg-gradient-to-b from-amber-600/60 to-amber-800/60 dark:from-amber-800/40 dark:to-amber-950/40 rounded-t-[1.5rem] md:rounded-t-[2.5rem] shadow-2xl border-x border-t border-amber-500/30 dark:border-white/5 backdrop-blur-3xl"></div>
                    </div>
                )}
            </div>

            {/* List View */}
            <div className="bg-white dark:bg-gray-800 rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800/50 backdrop-blur-xl">
                <div className="p-5 md:p-8 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
                    <h3 className="font-black text-sm md:text-xl text-gray-900 dark:text-white flex items-center gap-3 md:gap-4 italic uppercase tracking-tighter">
                        <TrendingUp size={18} md:size={24} className="text-orange-500" />
                        O'quvchilar reytingi
                    </h3>
                    <div className="px-3 py-1.5 bg-gray-200/50 dark:bg-gray-800 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                        {ratings.length} O'QUVCHI
                    </div>
                </div>

                <div className="divide-y divide-gray-50 dark:divide-gray-700/30">
                    {ratings.map((rating, index) => {
                        const isMe = myRating && rating.student.full_name === myRating.full_name;
                        return (
                            <div key={index} className={`flex items-center gap-4 md:gap-6 p-4 md:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-300 group ${isMe ? 'bg-indigo-50/30 dark:bg-indigo-900/10 border-l-4 border-l-indigo-500' : rating.rank <= 3 ? 'bg-indigo-50/10 dark:bg-indigo-900/5' : ''}`}>
                                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border duration-500 group-hover:scale-110 shadow-sm ${rating.rank === 1 ? 'bg-yellow-100 border-yellow-200 text-yellow-600 dark:bg-yellow-900/30 dark:border-yellow-700' :
                                    rating.rank === 2 ? 'bg-gray-100 border-gray-200 text-gray-500 dark:bg-gray-700 dark:border-gray-600' :
                                        rating.rank === 3 ? 'bg-amber-100 border-amber-200 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700' :
                                            'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-700'
                                    }`}>
                                    {getRankIcon(rating.rank)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-black text-sm md:text-lg text-gray-900 dark:text-white truncate tracking-tight uppercase italic ${isMe ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                                        {rating.student.full_name}
                                        {isMe && <span className="ml-2 text-[8px] bg-indigo-600 text-white px-2 py-0.5 rounded-full not-italic">SIZ</span>}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[7px] md:text-[10px] font-black text-gray-400 dark:text-gray-500 truncate uppercase tracking-widest bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-lg border border-gray-200/50 dark:border-white/5">{rating.student.group.name}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-baseline gap-1 justify-end">
                                        <span className="text-xl md:text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter tabular-nums">{rating.averageScore}</span>
                                        <span className="text-[8px] md:text-[10px] font-black text-indigo-400/60 uppercase italic">%</span>
                                    </div>
                                    <div className="text-[7px] md:text-[9px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest mt-0.5">Success</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
