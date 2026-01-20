import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Modal from '../components/Modal';
import {
  LogOut,
  User,
  Lock,
  Eye,
  EyeOff,
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
  Save,
  Trash2,
  Trophy,
  GraduationCap,
  Star,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Mail,
  X,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';

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
  const [ranking, setRanking] = useState(null);

  // Edit form state
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    profile_image: ''
  });
  const [imagePreview, setImagePreview] = useState('');

  // Password change state
  const [passModal, setPassModal] = useState(false);
  const [passData, setPassData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

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
          full_name: res.data.full_name || '',
          phone: res.data.phone || '',
          profile_image: res.data.profile_image || ''
        });
        setImagePreview(res.data.profile_image || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
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
      const endpoint = isOwnProfile ? '/badges/student' : `/badges/view/${id}`;
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
      const endpoint = isOwnProfile ? '/certificates/student' : `/certificates/view/${id}`;
      const res = await api.get(endpoint);
      setCertificates(res.data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setCertificatesLoading(false);
    }
  }, [id, isOwnProfile]);

  const fetchRanking = useCallback(async () => {
    try {
      const res = await api.get('/public/ratings');
      const targetName = profile?.full_name;
      if (targetName) {
        const myRankData = res.data.find(r => r.full_name === targetName);
        if (myRankData) {
          setRanking(myRankData.rank);
        }
      }
    } catch (error) {
      console.error('Error fetching ranking:', error);
    }
  }, [profile?.full_name]);

  useEffect(() => {
    fetchProfile();
    fetchBadges();
    fetchCertificates();
  }, [fetchProfile, fetchBadges, fetchCertificates]);

  useEffect(() => {
    if (profile) fetchRanking();
  }, [profile, fetchRanking]);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    const backendUrl = import.meta.env.VITE_API_URL || 'https://infastcrm-0b2r.onrender.com';
    const cleanUrl = url.startsWith('/') ? url : '/' + url;
    return `${backendUrl}${cleanUrl}`;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setEditing(true);
    try {
      const res = await api.put('/student-auth/profile', formData);
      setProfile(res.data);
      setEditModal(false);
    } catch (error) {
      alert('Xatolik yuz berdi');
    } finally {
      setEditing(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      alert("Yangi parollar mos kelmadi");
      return;
    }
    setPassLoading(true);
    try {
      await api.put('/student-auth/change-password', {
        oldPassword: passData.oldPassword,
        newPassword: passData.newPassword
      });
      alert('Parol muvaffaqiyatli yangilandi');
      setPassModal(false);
      setPassData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setPassLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, profile_image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="text-center py-24 text-gray-500 animate-pulse font-black uppercase tracking-[0.3em]">Profil yuklanmoqda...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 animate-in fade-in duration-700">
      {/* Header / Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-900"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6 h-full flex items-end pb-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 w-full">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-32 h-32 md:w-56 md:h-56 rounded-[2.5rem] md:rounded-[3.5rem] border-[6px] md:border-[10px] border-white dark:border-gray-900 bg-white shadow-2xl overflow-hidden relative transform group-hover:rotate-3 transition-transform duration-500">
                {profile?.profile_image || imagePreview ? (
                  <img src={getImageUrl(profile?.profile_image || imagePreview)} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-indigo-500">
                    <User size={64} md:size={80} strokeWidth={1} />
                  </div>
                )}
                {isOwnProfile && (
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                    <Camera className="text-white" size={24} md:size={32} />
                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                  </label>
                )}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left pb-4 space-y-4">
              <div className="flex flex-col items-center md:items-start gap-4">
                <h1 className="text-3xl md:text-6xl font-black text-white md:text-gray-900 dark:text-white tracking-tighter italic uppercase drop-shadow-sm leading-none">{profile?.full_name}</h1>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-white/10 md:bg-indigo-600 rounded-xl text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest border border-white/20 md:border-none shadow-xl shadow-indigo-500/20">TALABA</div>
                  <div className="px-3 py-1.5 bg-white/10 md:bg-gray-100 dark:bg-gray-800/80 text-white/80 md:text-indigo-600 dark:text-indigo-400 rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-white/10 dark:border-white/5">{profile?.group?.name || 'Mustaqil o\'quvchi'}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 mt-4">
                {isOwnProfile && profile?.phone && (
                  <div className="px-5 py-2.5 bg-white/10 md:bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center gap-2 md:gap-3 backdrop-blur-md border border-white/10 dark:border-white/5 shadow-sm">
                    <Phone size={16} className="text-indigo-500" />
                    <span className="text-sm font-black dark:text-gray-300 tracking-wider tabular-nums">{profile?.phone}</span>
                  </div>
                )}
                {ranking && (
                  <div className="px-5 py-2.5 bg-gradient-to-br from-yellow-400 to-amber-500 text-black rounded-2xl flex items-center gap-2 md:gap-3 shadow-2xl shadow-yellow-500/30 border border-yellow-300 transform hover:scale-105 transition-transform duration-300">
                    <Trophy size={16} strokeWidth={3} />
                    <span className="text-[10px] md:text-sm font-black italic">RANK #{ranking}</span>
                  </div>
                )}
                {isOwnProfile && (
                  <button onClick={() => setEditModal(true)} className="px-6 py-2.5 bg-white text-indigo-600 rounded-2xl font-black shadow-xl hover:-translate-y-1 transition-all text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2 md:gap-3 group border border-gray-100 dark:border-white/5">
                    <Settings size={16} className="group-hover:rotate-90 transition-transform duration-500" /> SOZLAMALAR
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left Sidebar */}
          <div className="space-y-10">
            {/* Stats Card */}
            <div className="bg-white dark:bg-gray-800 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-xl border border-gray-100 dark:border-gray-700/50 relative overflow-hidden group/stats">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover/stats:opacity-100 transition-opacity duration-700"></div>
              <h3 className="text-[8px] md:text-xs font-black uppercase tracking-widest text-gray-400 mb-6 md:mb-10 ml-1 italic opacity-70">Akademiya Faoliyati</h3>
              <div className="space-y-6 md:space-y-10 relative z-10">
                {ranking && (
                  <div className="flex items-center justify-between group/line">
                    <div className="flex items-center gap-3 md:gap-5">
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 flex items-center justify-center shadow-sm border border-yellow-100/50 group-hover/line:scale-110 transition-transform duration-500">
                        <TrendingUp size={20} md:size={24} />
                      </div>
                      <span className="text-[10px] md:text-sm font-bold dark:text-gray-300 uppercase tracking-widest">Reyting O'rni</span>
                    </div>
                    <span className="text-2xl md:text-3xl font-black text-yellow-500 italic drop-shadow-sm">#{ranking}</span>
                  </div>
                )}
                <div className="flex items-center justify-between group/line">
                  <div className="flex items-center gap-3 md:gap-5">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center shadow-sm border border-orange-100/50 group-hover/line:scale-110 transition-transform duration-500">
                      <Trophy size={20} md:size={24} />
                    </div>
                    <span className="text-[10px] md:text-sm font-bold dark:text-gray-300 uppercase tracking-widest">Yutuqlar</span>
                  </div>
                  <span className="text-2xl md:text-3xl font-black tabular-nums dark:text-white italic">{badges.length}</span>
                </div>
                <div className="flex items-center justify-between group/line">
                  <div className="flex items-center gap-3 md:gap-5">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center shadow-sm border border-indigo-100/50 group-hover/line:scale-110 transition-transform duration-500">
                      <ShieldCheck size={20} md:size={24} />
                    </div>
                    <span className="text-[10px] md:text-sm font-bold dark:text-gray-300 uppercase tracking-widest">Sertifikatlar</span>
                  </div>
                  <span className="text-2xl md:text-3xl font-black tabular-nums dark:text-white italic">{certificates.length}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700/50">
                  <div className="flex items-center gap-3 md:gap-5">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
                      <Calendar size={14} md:size={18} />
                    </div>
                    <span className="text-[8px] md:text-xs font-bold dark:text-gray-400 uppercase tracking-widest">A'zo bo'ldi</span>
                  </div>
                  <span className="text-[8px] md:text-xs font-black dark:text-indigo-400 uppercase tracking-widest">{profile?.createdAt ? format(new Date(profile.createdAt), 'MMM yyyy', { locale: uz }) : '--'}</span>
                </div>
              </div>
            </div>

            {isOwnProfile && (
              <button
                onClick={() => navigate('/student-dashboard')}
                className="w-full bg-white dark:bg-gray-800 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest shadow-xl border border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600 transition-all flex items-center justify-center gap-3 md:gap-4 text-[8px] md:text-xs italic"
              >
                <ArrowLeft size={16} md:size={18} /> Bo'limlarga qaytish
              </button>
            )}
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 p-2 rounded-[2rem] shadow-xl flex border border-gray-100 dark:border-gray-700/50 backdrop-blur-xl">
              <button
                onClick={() => setActiveTab('badges')}
                className={`flex-1 py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${activeTab === 'badges' ? 'bg-indigo-600 text-white shadow-2xl scale-105' : 'text-gray-400 hover:text-gray-500'}`}
              >
                <Award size={18} /> Yutuqlar ({badges.length})
              </button>
              <button
                onClick={() => setActiveTab('certificates')}
                className={`flex-1 py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${activeTab === 'certificates' ? 'bg-indigo-600 text-white shadow-2xl scale-105' : 'text-gray-400 hover:text-gray-500'}`}
              >
                <GraduationCap size={18} /> Sertifikatlar ({certificates.length})
              </button>
            </div>

            {/* Tab Panels */}
            {activeTab === 'badges' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {badgesLoading ? (
                  <div className="col-span-full py-20 text-center animate-pulse text-gray-400">Yutuqlar yuklanmoqda...</div>
                ) : badges.length === 0 ? (
                  <div className="col-span-full bg-white dark:bg-gray-800/40 rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100 dark:border-gray-700/50">
                    <Award size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 font-bold">Hozircha yutuqlar mavjud emas</p>
                  </div>
                ) : (
                  badges.map(badge => (
                    <div key={badge._id} className="group bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl border border-gray-100 dark:border-gray-700/50 hover:-translate-y-2 transition-all flex flex-col items-center text-center">
                      <div className="w-24 h-24 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500 mb-6 group-hover:rotate-12 transition-transform shadow-inner">
                        <Award size={40} strokeWidth={2.5} />
                      </div>
                      <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tighter text-sm mb-2 italic">{badge.badge_id?.name || 'Yutuq'}</h4>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 line-clamp-2 leading-relaxed uppercase tracking-widest">{badge.badge_id?.description}</p>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {certificatesLoading ? (
                  <div className="col-span-full py-20 text-center animate-pulse text-gray-400">Sertifikatlar yuklanmoqda...</div>
                ) : certificates.length === 0 ? (
                  <div className="col-span-full bg-white dark:bg-gray-800/40 rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100 dark:border-gray-700/50">
                    <GraduationCap size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 font-bold">Hozircha sertifikatlar mavjud emas</p>
                  </div>
                ) : (
                  certificates.map(cert => (
                    <div key={cert._id} className="group bg-white dark:bg-gray-800 rounded-[3rem] p-10 shadow-xl border border-gray-100 dark:border-gray-700/50 hover:-translate-y-2 transition-all overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                      <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-8 shadow-xl shadow-indigo-600/30">
                        <GraduationCap size={32} />
                      </div>
                      <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-3 italic uppercase tracking-tighter leading-none">{cert.title || 'Kursni tugatganlik to\'g\'risida'}</h4>
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-8 uppercase tracking-widest">{cert.course_id?.name}</p>
                      <a
                        href={cert.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] group-hover:gap-5 transition-all"
                      >
                        SIKLASH VA YUKLASH <Download size={14} strokeWidth={3} />
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-xl rounded-[3rem] p-12 shadow-2xl relative animate-in zoom-in-95 duration-500 border border-white/5">
            <button onClick={() => setEditModal(false)} className="absolute top-10 right-10 p-3 text-gray-400 hover:text-white hover:bg-rose-500 rounded-2xl transition-all">
              <X size={24} />
            </button>
            <h3 className="text-4xl font-black mb-10 dark:text-white italic uppercase tracking-tighter">Profil Sozlamalari</h3>

            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">To'liq ism</label>
                <input
                  required
                  type="text"
                  value={formData.full_name}
                  onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-8 py-5 bg-gray-50 dark:bg-gray-900 border-none rounded-[2rem] text-sm font-bold dark:text-white focus:ring-4 ring-indigo-500/10 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Telefon raqami</label>
                <input
                  required
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-8 py-5 bg-gray-50 dark:bg-gray-900 border-none rounded-[2rem] text-sm font-bold dark:text-white focus:ring-4 ring-indigo-500/10 transition-all shadow-inner"
                />
              </div>

              <div className="pt-4 space-y-4">
                <button
                  type="button"
                  onClick={() => { setEditModal(false); setPassModal(true); }}
                  className="w-full py-5 rounded-[1.5rem] bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-100 transition-all flex items-center justify-center gap-3"
                >
                  <Lock size={16} /> Parolni yangilash
                </button>
                <button
                  type="submit"
                  disabled={editing}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-6 rounded-[2rem] font-black shadow-2xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-2 transition-all italic text-lg uppercase tracking-widest disabled:opacity-50"
                >
                  {editing ? 'SAQLANMOQDA...' : 'O\'ZGARISHLARNI SAQLASH'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {passModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-[3rem] p-12 shadow-2xl relative animate-in zoom-in-95 border border-white/5">
            <button onClick={() => setPassModal(false)} className="absolute top-10 right-10 p-3 text-gray-400 hover:text-white hover:bg-rose-500 rounded-2xl transition-all">
              <X size={24} />
            </button>
            <h3 className="text-3xl font-black mb-10 dark:text-white italic uppercase tracking-tighter">Parolni o'zgartirish</h3>

            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 text-gray-500 mb-2 block">JORIY PAROL</label>
                <input
                  required
                  type="password"
                  value={passData.oldPassword}
                  onChange={e => setPassData({ ...passData, oldPassword: e.target.value })}
                  className="w-full px-8 py-5 bg-gray-50 dark:bg-gray-900 border-none rounded-[2rem] text-sm font-bold dark:text-white focus:ring-4 ring-indigo-500/10 shadow-inner"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 text-gray-500 mb-2 block">YANGI PAROL</label>
                <input
                  required
                  type="password"
                  value={passData.newPassword}
                  onChange={e => setPassData({ ...passData, newPassword: e.target.value })}
                  className="w-full px-8 py-5 bg-gray-50 dark:bg-gray-900 border-none rounded-[2rem] text-sm font-bold dark:text-white focus:ring-4 ring-indigo-500/10 shadow-inner"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 text-gray-500 mb-2 block">YANGI PAROLNI TASDIQLASH</label>
                <input
                  required
                  type="password"
                  value={passData.confirmPassword}
                  onChange={e => setPassData({ ...passData, confirmPassword: e.target.value })}
                  className="w-full px-8 py-5 bg-gray-50 dark:bg-gray-900 border-none rounded-[2rem] text-sm font-bold dark:text-white focus:ring-4 ring-indigo-500/10 shadow-inner"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={passLoading}
                className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black shadow-2xl shadow-indigo-600/30 mt-6 italic text-lg uppercase tracking-widest disabled:opacity-50"
              >
                {passLoading ? 'YANGILANMOQDA...' : 'PAROLNI SAQLASH'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
