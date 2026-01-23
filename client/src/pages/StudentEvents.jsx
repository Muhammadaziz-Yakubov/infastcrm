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
  Image
} from 'lucide-react';
import { format } from 'date-fns';

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
      alert('Tadbirga muvaffaqiyatli ro\'yxatdan o\'tdingiz!');
      fetchEvents();
      setShowDetailModal(false);
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tadbirlar</h1>
        <p className="text-gray-600 dark:text-gray-400">Qiziqarli tadbirlarda qatnashing va coinlarga ega bo'ling!</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tadbirlarni qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Tadbirlar yuklanmoqda...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm ? 'Tadbirlar topilmadi' : 'Hozircha tadbirlar yo\'q'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm ? 'Boshqa kalit so\'zlar bilan urinib ko\'ring' : 'Tez orada yangi tadbirlar qo\'shiladi'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div 
              key={event._id} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => openEventDetail(event)}
            >
              {/* Banner Image */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                {event.banner ? (
                  <img
                    src={event.banner}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Calendar className="w-16 h-16 text-white opacity-50" />
                  </div>
                )}
                
                {/* Status badges */}
                <div className="absolute top-3 right-3 flex flex-col space-y-2">
                  {event.is_registered && (
                    <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Ro'yxatdan o'tilgan</span>
                    </span>
                  )}
                  
                  {isEventFull(event) && !event.is_registered && (
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium flex items-center space-x-1">
                      <XCircle className="w-3 h-3" />
                      <span>To'la</span>
                    </span>
                  )}
                  
                  {isRegistrationClosed(event) && !event.is_registered && (
                    <span className="px-3 py-1 bg-gray-500 text-white rounded-full text-xs font-medium flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Muddati o'tgan</span>
                    </span>
                  )}
                </div>

                {/* Participants overlay */}
                <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 px-3 py-1 rounded-full">
                  <div className="flex items-center space-x-2 text-white text-sm">
                    <Users className="w-4 h-4" />
                    <span>{event.registered_count}/{event.max_participants}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {event.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{format(new Date(event.event_date), 'dd.MM.yyyy HH:mm')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>
                      Ro'yxatdan o'tish: {format(new Date(event.registration_deadline), 'dd.MM.yyyy HH:mm')}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Coins className="w-4 h-4 mr-2 flex-shrink-0 text-yellow-500" />
                    <span className="text-green-600 dark:text-green-400 font-medium">+{event.coin_reward}</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="text-red-600 dark:text-red-400 font-medium">{event.coin_penalty}</span>
                    <span className="text-gray-500 ml-1">coin</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEventDetail(event);
                    }}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center space-x-1 transition"
                  >
                    <span>Batafsil</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  {!event.is_registered && isRegistrationOpen(event) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRegister(event._id);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-1 transition"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Qatnashish</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={selectedEvent?.title}
        size="lg"
      >
        {selectedEvent && (
          <div className="space-y-6">
            {/* Banner */}
            {selectedEvent.banner && (
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={selectedEvent.banner}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tadbir haqida</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {selectedEvent.description}
              </p>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Tadbir sanasi</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {format(new Date(selectedEvent.event_date), 'dd.MM.yyyy HH:mm')}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Manzil</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{selectedEvent.location}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Ro'yxatdan o'tish muddati</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {format(new Date(selectedEvent.registration_deadline), 'dd.MM.yyyy HH:mm')}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Ishtirokchilar</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedEvent.registered_count} / {selectedEvent.max_participants} kishi
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(selectedEvent.registered_count / selectedEvent.max_participants) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Coin Rewards */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Coins className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="font-medium text-gray-900 dark:text-white">Coin mukofotlari</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">+{selectedEvent.coin_reward}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tadbirga kelganda</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{selectedEvent.coin_penalty}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Kelmaganda</p>
                </div>
              </div>
            </div>

            {/* Registration Status */}
            {selectedEvent.is_registered ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">Siz ro'yxatdan o'tdingiz</p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Tadbir vaqtida bo'lib, coin mukofotini olishingiz mumkin
                    </p>
                  </div>
                </div>
              </div>
            ) : isRegistrationOpen(selectedEvent) ? (
              <button
                onClick={() => handleRegister(selectedEvent._id)}
                disabled={registering}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition flex items-center justify-center space-x-2"
              >
                {registering ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Ro'yxatdan o'tilmoqda...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Tadbirga qatnashish</span>
                  </>
                )}
              </button>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {isEventFull(selectedEvent) ? 'Tadbir to\'la' : 'Ro\'yxatdan o\'tish muddati tugagan'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Bu tadbirga ro\'yxatdan o\'tib bo\'lmaydi
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
