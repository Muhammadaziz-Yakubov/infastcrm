import { useState, useEffect } from 'react';
import api from '../utils/api';
import Modal from '../components/Modal';
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Coins,
  RefreshCw,
  Image,
  UserCheck,
  Award,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

export default function AdminEvents() {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [processingRewards, setProcessingRewards] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    banner: '',
    event_date: '',
    registration_deadline: '',
    max_participants: '',
    location: '',
    coin_reward: 500,
    coin_penalty: -500,
    status: 'UPCOMING'
  });

  const eventStatuses = [
    { value: 'UPCOMING', label: 'Keladigan', color: 'blue' },
    { value: 'ONGOING', label: 'Davom etayotgan', color: 'green' },
    { value: 'COMPLETED', label: 'Tugagan', color: 'gray' },
    { value: 'CANCELLED', label: 'Bekor qilingan', color: 'red' }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        event_date: new Date(formData.event_date),
        registration_deadline: new Date(formData.registration_deadline),
        max_participants: parseInt(formData.max_participants),
        coin_reward: parseInt(formData.coin_reward),
        coin_penalty: parseInt(formData.coin_penalty)
      };

      if (editingEvent) {
        await api.put(`/events/${editingEvent._id}`, data);
      } else {
        await api.post('/events', data);
      }

      setShowEventModal(false);
      setEditingEvent(null);
      resetFormData();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      alert(error.response?.data?.message || 'Xatolik yuz berdi: ' + (error.response?.data?.error || error.message));
    }
  };

  const resetFormData = () => {
    setFormData({
      title: '',
      description: '',
      banner: '',
      event_date: '',
      registration_deadline: '',
      max_participants: '',
      location: '',
      coin_reward: 500,
      coin_penalty: -500,
      status: 'UPCOMING'
    });
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      banner: event.banner,
      event_date: format(new Date(event.event_date), "yyyy-MM-dd'T'HH:mm"),
      registration_deadline: format(new Date(event.registration_deadline), "yyyy-MM-dd'T'HH:mm"),
      max_participants: event.max_participants,
      location: event.location,
      coin_reward: event.coin_reward,
      coin_penalty: event.coin_penalty,
      status: event.status
    });
    setShowEventModal(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Tadbirni ochirishga ishonchingiz komilmi?')) return;

    try {
      await api.delete(`/events/${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const openAttendanceModal = async (event) => {
    setSelectedEvent(event);
    setAttendees(event.registrations || []);
    setShowAttendanceModal(true);
  };

  const handleAttendanceChange = (studentId, attended) => {
    setAttendees(prev =>
      prev.map(attendee =>
        attendee.student_id._id === studentId
          ? { ...attendee, attended }
          : attendee
      )
    );
  };

  const saveAttendance = async () => {
    try {
      const attendedStudents = attendees
        .filter(a => a.attended)
        .map(a => a.student_id._id);

      await api.post(`/events/${selectedEvent._id}/attendance`, {
        student_ids: attendedStudents
      });

      alert('Davomat saqlandi');
      fetchEvents();
    } catch (error) {
      console.error('Error saving attendance:', error);
    }
  };

  const processRewards = async () => {
    if (!confirm('Davomat bo\'yicha coinlarni taqsimlashga ishonchingiz komilmi? Bu amal ortga qaytarilmaydi!')) return;

    setProcessingRewards(true);
    try {
      const result = await api.post(`/events/${selectedEvent._id}/process-rewards`);
      alert(`Mukofotlar muvaffaqiyatli taqsimlandi: ${result.data.processed} talaba`);
      fetchEvents();
      openAttendanceModal(selectedEvent); // Refresh modal data
    } catch (error) {
      console.error('Error processing rewards:', error);
      alert('Xatolik yuz berdi');
    } finally {
      setProcessingRewards(false);
    }
  };

  const getStatusColor = (status) => {
    const statusConfig = eventStatuses.find(s => s.value === status);
    return statusConfig ? statusConfig.color : 'gray';
  };

  const getStatusLabel = (status) => {
    const statusConfig = eventStatuses.find(s => s.value === status);
    return statusConfig ? statusConfig.label : status;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tadbirlar</h1>
        <p className="text-gray-600 dark:text-gray-400">Tadbirlarni boshqarish va davomatni kuzatish</p>
      </div>

      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-md font-medium transition ${activeTab === 'events'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Tadbirlar
          </button>
        </div>
      </div>

      {activeTab === 'events' && (
        <>
          <div className="mb-6 flex justify-between items-center">
            <div className="flex space-x-3">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tadbirlarni qidirish..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <button
              onClick={() => setShowEventModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Yangi tadbir</span>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Yuklanmoqda...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition">
                  {event.banner && (
                    <div className="aspect-[2/3] w-full bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                      <img
                        src={event.banner}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${getStatusColor(event.status)}-100 text-${getStatusColor(event.status)}-800 dark:bg-${getStatusColor(event.status)}-900 dark:text-${getStatusColor(event.status)}-200`}>
                          {getStatusLabel(event.status)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {format(new Date(event.event_date), 'dd.MM.yyyy HH:mm')}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-2" />
                        {event.registrations?.length || 0}/{event.max_participants}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Coins className="w-4 h-4 mr-2" />
                        +{event.coin_reward} / {event.coin_penalty}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => openAttendanceModal(event)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1 transition"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Davomat</span>
                      </button>
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Event Modal */}
      <Modal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setEditingEvent(null);
          resetFormData();
        }}
        title={editingEvent ? 'Tadbirni tahrirlash' : 'Yangi tadbir'}
        size="lg"
      >
        <form onSubmit={handleSubmitEvent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tadbir nomi
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tavsif
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Poster Rasmi URL (Uzunchoq 2:3)
            </label>
            <input
              type="url"
              value={formData.banner}
              onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tadbir sanasi
              </label>
              <input
                type="datetime-local"
                required
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ro'yxatdan o'tish muddati
              </label>
              <input
                type="datetime-local"
                required
                value={formData.registration_deadline}
                onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Manzil
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Maksimal ishtirokchilar
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.max_participants}
                onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Coin mukofoti
              </label>
              <input
                type="number"
                value={formData.coin_reward}
                onChange={(e) => setFormData({ ...formData, coin_reward: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Coin jarimasi
              </label>
              <input
                type="number"
                value={formData.coin_penalty}
                onChange={(e) => setFormData({ ...formData, coin_penalty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Holati
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {eventStatuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowEventModal(false);
                setEditingEvent(null);
                resetFormData();
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              {editingEvent ? 'Saqlash' : 'Yaratish'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Attendance Modal */}
      <Modal
        isOpen={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        title={`Davomat - ${selectedEvent?.title}`}
        size="xl"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {attendees.filter(a => a.attended).length} / {attendees.length} keldi
            </div>
            <div className="space-x-2">
              <button
                onClick={saveAttendance}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition"
              >
                <Check className="w-4 h-4 inline mr-2" />
                Davomatni saqlash
              </button>
              <button
                onClick={processRewards}
                disabled={processingRewards}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white rounded-lg text-sm transition"
              >
                <Award className="w-4 h-4 inline mr-2" />
                {processingRewards ? 'Qayta ishlanmoqda...' : 'Coinlarni taqsimlash'}
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {attendees.map((attendee) => (
                <div key={attendee.student_id._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {attendee.student_id.full_name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {attendee.student_id.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={attendee.attended}
                        onChange={(e) => handleAttendanceChange(attendee.student_id._id, e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {attendee.attended ? 'Keldi' : 'Kelmadi'}
                      </span>
                    </label>

                    {attendee.coin_given && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs">
                        Coin berildi
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
