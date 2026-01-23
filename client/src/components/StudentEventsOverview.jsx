import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Calendar, MapPin, Users, Coins, Clock, UserPlus } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentEventsOverview() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      const response = await api.get('/events/upcoming');
      // Show only first 3 events for overview
      setEvents(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 animate-pulse">
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Hozircha tadbirlar yo'q</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {events.map((event) => (
        <div
          key={event._id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-300 group cursor-pointer"
          onClick={() => window.location.href = `/student/events#${event._id}`}
        >
          {/* Banner */}
          <div className="h-24 bg-gradient-to-br from-purple-500 to-pink-600 relative overflow-hidden">
            {event.banner ? (
              <img
                src={event.banner}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white opacity-50" />
              </div>
            )}
            
            {/* Status badge */}
            <div className="absolute top-2 right-2">
              {event.is_registered && (
                <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                  Ro'yxatdan o'tilgan
                </span>
              )}
            </div>

            {/* Participants overlay */}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded-full">
              <div className="flex items-center space-x-1 text-white text-xs">
                <Users className="w-3 h-3" />
                <span>{event.registered_count}/{event.max_participants}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition line-clamp-1">
              {event.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 line-clamp-2">
              {event.description}
            </p>
            
            <div className="space-y-1 mb-3">
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{format(new Date(event.event_date), 'dd.MM HH:mm')}</span>
              </div>
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
              <div className="flex items-center text-xs">
                <Coins className="w-3 h-3 mr-1 flex-shrink-0 text-yellow-500" />
                <span className="text-green-600 dark:text-green-400 font-medium">+{event.coin_reward}</span>
                <span className="text-gray-400 mx-1">/</span>
                <span className="text-red-600 dark:text-red-400 font-medium">{event.coin_penalty}</span>
              </div>
            </div>

            {!event.is_registered && event.registered_count < event.max_participants && new Date() <= new Date(event.registration_deadline) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/student/events#${event._id}`;
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-xs font-medium transition flex items-center justify-center space-x-1"
              >
                <UserPlus className="w-3 h-3" />
                <span>Qatnashish</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
