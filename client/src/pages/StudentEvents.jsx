import { useState, useEffect } from 'react';
import api from '../utils/api';
import Modal from '../components/Modal';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Coins,
  Search,
  UserPlus,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Zap,
  Ticket
} from 'lucide-react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';

export default function StudentEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/events/upcoming');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEventDetail = (event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const handleRegister = async (eventId) => {
    setRegistering(true);
    try {
      await api.post(`/events/${eventId}/register`);
      fetchEvents();
      if (selectedEvent?._id === eventId) {
        setSelectedEvent(prev => ({ ...prev, is_registered: true, registered_count: prev.registered_count + 1 }));
      }
      alert('Tadbirga muvaffaqiyatli ro\'yxatdan o\'tdingiz! 🎉');
    } catch (error) {
      console.error('Error registering for event:', error);
      alert(error.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setRegistering(false);
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isRegistrationOpen = (event) => {
    return new Date() <= new Date(event.registration_deadline) &&
      event.registered_count < event.max_participants &&
      !event.is_registered;
  };

  const isEventFull = (event) => {
    return event.registered_count >= event.max_participants;
  };

  const isRegistrationClosed = (event) => {
    return new Date() > new Date(event.registration_deadline);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-jakarta animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Calendar size={20} />
            </div>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Exclusive Events</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight italic">
            Tadbirlar & <span className="text-indigo-600">Imkoniyatlar</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Faol bo'ling, bilim oling va coinlarni qo'lga kiriting!</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-white dark:bg-[#1e2330] rounded-2xl flex items-center px-4 py-3 border border-gray-100 dark:border-white/5 shadow-xl">
            <Search className="text-gray-400 w-5 h-5 mr-3" />
            <input
              type="text"
              placeholder="Tadbir qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm font-bold text-gray-700 dark:text-white placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-96 rounded-[2.5rem] bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-[#161a26] rounded-[3rem] border border-dashed border-gray-200 dark:border-white/5">
          <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Tadbirlar topilmadi</h3>
          <p className="text-gray-500">Hozircha rejalashtirilgan tadbirlar yo'q.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, index) => (
            <div
              key={event._id}
              onClick={() => openEventDetail(event)}
              className="group relative bg-white dark:bg-[#161a26] rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 hover:-translate-y-2 transition-all duration-500 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Banner */}
              <div className="h-64 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#161a26] via-transparent to-transparent z-10 opacity-90"></div>
                {event.banner ? (
                  <img src={event.banner} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
                    <Sparkles className="text-white/20 w-32 h-32" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
                  <div className="px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                    <Coins size={14} className="text-yellow-400" />
                    <span className="text-xs font-black text-white uppercase tracking-wider">{event.coin_reward} COIN</span>
                  </div>
                  {event.is_registered && (
                    <div className="px-4 py-1.5 bg-green-500/90 backdrop-blur-md rounded-full text-xs font-black text-white uppercase tracking-wider shadow-lg shadow-green-500/20 animate-pulse">
                      Qatnashmoqdasiz
                    </div>
                  )}
                </div>

                <div className="absolute bottom-4 left-6 z-20">
                  <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg mb-2 inline-block">
                    {format(new Date(event.event_date), 'dd MMMM', { locale: uz })}
                  </span>
                  <h3 className="text-2xl font-black text-white leading-tight line-clamp-2 italic">{event.title}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 space-y-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 font-medium leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                      <Clock size={16} />
                    </div>
                    <span className="text-sm font-bold">{format(new Date(event.event_date), 'HH:mm', { locale: uz })} da boshlanadi</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                      <MapPin size={16} />
                    </div>
                    <span className="text-sm font-bold truncate">{event.location}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-gray-400">
                    <span>Joylar</span>
                    <span>{event.registered_count} / {event.max_participants}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${isEventFull(event) ? 'bg-red-500' : 'bg-indigo-500'
                        }`}
                      style={{ width: `${Math.min((event.registered_count / event.max_participants) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <button className="w-full py-4 bg-gray-50 dark:bg-white/5 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn">
                  Batafsil
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title=""
        size="lg"
      >
        {selectedEvent && (
          <div className="relative">
            {/* Modal Header Image */}
            <div className="h-72 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#111827] z-10"></div>
              {selectedEvent.banner ? (
                <img src={selectedEvent.banner} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-800 flex items-center justify-center">
                  <Ticket size={64} className="text-white/20" />
                </div>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="px-8 pb-8 -mt-20 relative z-20">
              {/* Title Block */}
              <div className="bg-white dark:bg-[#1f2937] p-6 rounded-3xl shadow-xl mb-8 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-wider rounded-lg">
                    {format(new Date(selectedEvent.event_date), 'dd MMMM yyyy', { locale: uz })}
                  </span>
                  {selectedEvent.is_registered && (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-black uppercase tracking-wider rounded-lg flex items-center gap-1">
                      <CheckCircle size={12} /> Ro'yxatdan o'tilgan
                    </span>
                  )}
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white uppercase italic leading-none mb-2">
                  {selectedEvent.title}
                </h2>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold text-sm">
                  <MapPin size={16} className="text-indigo-500" />
                  {selectedEvent.location}
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Tadbir Haqida</h4>
                    <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>

                  <div className="bg-indigo-50 dark:bg-indigo-900/10 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                        <Coins size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-indigo-400 uppercase tracking-wider">Mukofot</p>
                        <p className="text-xl font-black text-indigo-900 dark:text-indigo-100">+{selectedEvent.coin_reward} Coin</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700/50 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <Clock className="text-gray-400" size={20} />
                        <div>
                          <p className="text-[10px] font-black uppercase text-gray-400">Boshlanish vaqti</p>
                          <p className="font-bold dark:text-white">{format(new Date(selectedEvent.event_date), 'HH:mm')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700/50 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <Users className="text-gray-400" size={20} />
                        <div>
                          <p className="text-[10px] font-black uppercase text-gray-400">Bo'sh o'rinlar</p>
                          <p className="font-bold dark:text-white">{selectedEvent.max_participants - selectedEvent.registered_count} ta qoldi</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      {!selectedEvent.is_registered && isRegistrationOpen(selectedEvent) ? (
                        <button
                          onClick={() => handleRegister(selectedEvent._id)}
                          disabled={registering}
                          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-wider shadow-xl shadow-indigo-600/30 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                          {registering ? 'Ro\'yxatdan o\'tilmoqda...' : 'Tadbirga Qatnashish'}
                        </button>
                      ) : selectedEvent.is_registered ? (
                        <button disabled className="w-full py-4 bg-green-500/10 text-green-600 rounded-2xl font-black uppercase tracking-wider cursor-default flex items-center justify-center gap-2">
                          <CheckCircle size={18} /> Ro'yxatdan o'tilgan
                        </button>
                      ) : (
                        <button disabled className="w-full py-4 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-2xl font-black uppercase tracking-wider cursor-not-allowed">
                          {isEventFull(selectedEvent) ? 'Joylar tugagan' : 'Muddati o\'tgan'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
