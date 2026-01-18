import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Modal from '../components/Modal';
import {
  Award,
  FileText,
  ArrowLeft,
  Calendar,
  Download,
  Phone,
  Camera,
  CheckCircle2,
  Users,
  Settings,
  Save
} from 'lucide-react';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { student, studentLogin } = useAuth();

  const isOwnProfile = !id;

  const [profile, setProfile] = useState(null);
  const [badges, setBadges] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [activeTab, setActiveTab] = useState('badges');
  const [badgesLoading, setBadgesLoading] = useState(false);
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [editing, setEditing] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({
    phone: '',
    profile_image: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null); // Kept for potential future upload logic if not base64

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = isOwnProfile
        ? '/student-auth/profile'
        : `/student-auth/view/${id}`;

      const res = await api.get(endpoint);
      setProfile(res.data);

      if (isOwnProfile) {
        setFormData({
          phone: res.data.phone || '',
          profile_image: res.data.profile_image || ''
        });
        setImagePreview(res.data.profile_image || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // The global interceptor handles 401 redirects.
      // We only manually handle navigation if it's not a 401 but some other error
      if (error.response?.status !== 401) {
        navigate('/student');
      }
    } finally {
      setLoading(false);
    }
  }, [id, isOwnProfile, navigate]);

  const fetchBadges = useCallback(async () => {
    setBadgesLoading(true);
    try {
      // Use student-specific endpoints to avoid 401 on admin routes
      const endpoint = isOwnProfile
        ? '/badges/student'
        : `/badges/view/${id}`;

      const res = await api.get(endpoint);
      setBadges(res.data);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setBadgesLoading(false);
    }
  }, [id, isOwnProfile]);

  const fetchCertificates = useCallback(async () => {
    setCertificatesLoading(true);
    try {
      // Use student-specific endpoints
      const endpoint = isOwnProfile
        ? '/certificates/student'
        : `/certificates/view/${id}`;

      const res = await api.get(endpoint);
      setCertificates(Array.isArray(res.data) ? res.data.filter(c => c.status === 'ACTIVE') : []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setCertificatesLoading(false);
    }
  }, [id, isOwnProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      if (activeTab === 'badges') fetchBadges();
      if (activeTab === 'certificates') fetchCertificates();
    }
  }, [activeTab, profile, fetchBadges, fetchCertificates]);

  useEffect(() => {
    // Sync local form data with global student state if it updates (and we haven't edited yet)
    if (student && isOwnProfile && !editing) {
      setFormData(prev => ({
        ...prev,
        phone: student.phone || '',
        profile_image: student.profile_image || ''
      }));
      setImagePreview(student.profile_image || '');
    }
  }, [student, isOwnProfile]); // Removed editing to avoid loops, but initial sync is good.

  const handleDirectImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // 1. Show immediate preview
      setImageFile(file);
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64 = reader.result;
        setImagePreview(base64);
        setFormData(prev => ({ ...prev, profile_image: base64 }));

        // 2. Auto-save to server
        setEditing(true);
        try {
          const res = await api.put('/student-auth/profile', {
            phone: formData.phone, // keep existing phone
            profile_image: base64
          });

          setProfile(res.data);

          if (isOwnProfile) {
            const token = localStorage.getItem('studentToken');
            if (token) {
              studentLogin(token, res.data);
            }
          }
          alert('Rasm yangilandi!');
        } catch (error) {
          console.error('Error updating profile image:', error);
          alert('Rasm yuklashda xatolik: ' + (error.response?.data?.message || error.message));
        } finally {
          setEditing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setImagePreview(base64);
        setFormData(prev => ({ ...prev, profile_image: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    setEditing(true);
    try {
      const res = await api.put('/student-auth/profile', {
        phone: formData.phone,
        profile_image: formData.profile_image
      });

      setProfile(res.data);

      // Update global context so header/sidebar updates immediately
      if (isOwnProfile) {
        const token = localStorage.getItem('studentToken');
        if (token) {
          studentLogin(token, res.data);
        }
      }

      setEditModal(false);
      // No need to fetchProfile if we trust the response and updated context, 
      // but keeping it doesn't hurt.
      fetchProfile();
      alert('Profil muvaffaqiyatli yangilandi!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Xatolik yuz berdi: ' + (error.response?.data?.message || error.message));
    } finally {
      setEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400">
        <p>Profile topilmadi</p>
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
        </div>

        {/* Profile Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-6">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
            {isOwnProfile && (
              <button
                onClick={() => setEditModal(true)}
                className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-lg rounded-full text-white hover:bg-white/30 transition-all"
              >
                <Settings size={20} />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="px-4 md:px-8 pb-8 -mt-20 relative">
            {/* Profile Image */}
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-br from-indigo-400 to-purple-500 overflow-hidden shadow-xl">
                {profile.profile_image ? (
                  <img
                    src={profile.profile_image}
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                    {profile.full_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              {isOwnProfile && (
                <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg group">
                  {editing ? <div className="animate-spin w-4 h-4 border-2 border-white rounded-full border-t-transparent" /> : <Camera size={18} />}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDirectImageUpload}
                    className="hidden"
                    disabled={editing}
                  />
                </label>
              )}
            </div>

            {/* Name and Info */}
            <div className="mt-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {profile.full_name}
              </h1>
              <div className="flex items-center gap-4 md:gap-6 flex-wrap">
                {isOwnProfile && profile.phone && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Phone size={18} />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.group && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Users size={18} />
                    <Link
                      to={`/student/classmates`}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {profile.group.name || profile.group_id?.name}
                    </Link>
                  </div>
                )}
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${profile.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                  {profile.status}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('badges')}
              className={`flex-1 px-4 md:px-6 py-4 font-semibold transition-all relative text-sm md:text-base ${activeTab === 'badges'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Award size={20} />
                <span>Yutuqlar</span>
                {badges.length > 0 && (
                  <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold">
                    {badges.length}
                  </span>
                )}
              </div>
              {activeTab === 'badges' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`flex-1 px-4 md:px-6 py-4 font-semibold transition-all relative text-sm md:text-base ${activeTab === 'certificates'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText size={20} />
                <span>Sertifikatlar</span>
                {certificates.length > 0 && (
                  <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold">
                    {certificates.length}
                  </span>
                )}
              </div>
              {activeTab === 'certificates' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600"></div>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 md:p-8">
            {activeTab === 'badges' && (
              <div>
                {badgesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : badges.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <Award size={40} className="text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Hozircha yutuqlar yo'q</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {badges.map((badge) => (
                      <div
                        key={badge._id}
                        className="p-4 md:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Award className="text-white" size={24} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-base md:text-lg">
                              {badge.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {badge.description}
                            </p>
                            {badge.condition && (
                              <p className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg inline-block">
                                {badge.condition}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(badge.earned_at).toLocaleDateString('uz-UZ')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'certificates' && (
              <div>
                {certificatesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : certificates.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <FileText size={40} className="text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Hozircha sertifikatlar yo'q</p>
                  </div>
                ) : (
                  <div className="space-y-4 md:space-y-6">
                    {certificates
                      .sort((a, b) => new Date(b.issued_at) - new Date(a.issued_at))
                      .map((cert) => (
                        <div
                          key={cert._id}
                          className="p-4 md:p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
                        >
                          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                            {cert.certificate_image_url && (
                              <img
                                src={cert.certificate_image_url}
                                alt={cert.title}
                                className="w-full h-auto md:w-40 md:h-40 object-contain rounded-xl border border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-800"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg md:text-xl">
                                {cert.title}
                              </h3>
                              {cert.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                  {cert.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 flex-wrap mb-4">
                                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                  <Calendar size={14} />
                                  {new Date(cert.issued_at).toLocaleDateString('uz-UZ')}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                                  <CheckCircle2 size={14} />
                                  Faol
                                </span>
                              </div>
                              {cert.certificate_image_url && (
                                <a
                                  href={cert.certificate_image_url}
                                  download
                                  className="inline-flex items-center justify-center w-full md:w-auto gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                  <Download size={16} />
                                  PDF yuklab olish
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModal && isOwnProfile && (
        <Modal
          isOpen={editModal}
          onClose={() => setEditModal(false)}
          title="Profili tahrirlash"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Telefon raqami
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="+998 90 123 45 67"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile rasmi
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-3 w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                />
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleUpdateProfile}
                disabled={editing}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {editing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saqlanmoqda...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Saqlash
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
