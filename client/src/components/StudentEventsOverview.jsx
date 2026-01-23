import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Calendar, MapPin, Users, Coins, Clock, UserPlus, ArrowRight, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentEventsOverview() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      const response = await api.get('/events/upcoming');
      setEvents(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      setError(true);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything if there's an error
  if (error) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
        {[1, 2, 3].map((i) => (
          <div key={i} className="min-w-[280px] h-[420px] bg-white dark:bg-[#161a26] rounded-[2rem] p-4 animate-pulse border border-white/5">
            <div className="w-full h-full bg-gray-200 dark:bg-white/5 rounded-3xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter flex items-center gap-3">
          <span className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
            <Calendar size={18} />
          </span>
          Tadbirlar
        </h3>
        <button
          onClick={() => window.location.href = '/student/events'}
          className="text-purple-600 dark:text-purple-400 font-black text-xs uppercase tracking-widest hover:underline flex items-center gap-1"
        >
          Barchasi <ArrowRight size={14} />
        </button>
      </div>

      <div className="flex gap-4 md:gap-8 overflow-x-auto pb-8 pt-2 px-2 no-scrollbar snap-x">
        {events.map((event) => (
          <div
            key={event._id}
            className="snap-center shrink-0 w-[280px] md:w-[320px] h-[420px] md:h-[480px] relative rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-white/10"
            onClick={() => window.location.href = `/student/events#${event._id}`}
          >
            {/* Poster Image */}
            <div className="absolute inset-0 bg-gray-800">
              {event.banner ? (
                <img
                  src={event.banner}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 text-white/20">
                  <Calendar size={64} strokeWidth={1} />
                </div>
              )}
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

            {/* Status Badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              {event.is_registered && (
                <span className="px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1 backdrop-blur-md">
                  Yes!
                </span>
              )}
              <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                {event.registered_count}/{event.max_participants}
              </span>
            </div>

            {/* Valid Date Badge */}
            <div className="absolute top-4 left-4 z-10">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg">
                <span className="text-[10px] uppercase font-black tracking-widest text-white/60">
                  {format(new Date(event.event_date), 'MMM')}
                </span>
                <span className="text-xl font-black leading-none">
                  {format(new Date(event.event_date), 'dd')}
                </span>
              </div>
            </div>


            {/* Content Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <div className="space-y-3">
                {/* Coin Rewards */}
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 flex items-center gap-1">
                    <Coins size={12} className="fill-current" />
                    +{event.coin_reward}
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter leading-tight line-clamp-2 drop-shadow-lg">
                  {event.title}
                </h3>

                <div className="flex items-center gap-4 text-gray-300 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-purple-400" />
                    <span>{format(new Date(event.event_date), 'HH:mm')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-purple-400" />
                    <span className="truncate max-w-[120px]">{event.location}</span>
                  </div>
                </div>

                <button 
                  onClick={() => window.location.href = `/student/events`}
                  className="w-full py-3 bg-white text-gray-900 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 hover:bg-purple-50"
                >
                  Batafsil <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
