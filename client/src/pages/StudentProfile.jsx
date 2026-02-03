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
  ArrowRight,
  Zap,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { student, studentLogin, user, studentLogout } = useAuth();

  const isOwnProfile = !id;
  const isAdmin = !!user && user.role === 'ADMIN';

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
      let endpoint;
      if (isOwnProfile) {
        endpoint = '/student-auth/profile';
      } else if (isAdmin) {
        endpoint = `/students/${id}`;
      } else {
        endpoint = `/student-auth/view/${id}`;
      }

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
        navigate(isAdmin ? '/' : '/student');
      }
    } finally {
      setLoading(false);
    }
  }, [id, isOwnProfile, isAdmin, navigate]);

  const fetchBadges = useCallback(async () => {
    setBadgesLoading(true);
    try {
      const endpoint = isOwnProfile ? '/badges/student' : (isAdmin ? `/badges/view/${id}` : `/badges/view/${id}`);
      const res = await api.get(endpoint);
      setBadges(res.data);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setBadgesLoading(false);
    }
  }, [id, isOwnProfile, isAdmin]);

  const fetchCertificates = useCallback(async () => {
    setCertificatesLoading(true);
    try {
      const endpoint = isOwnProfile ? '/certificates/student' : (isAdmin ? `/certificates/view/${id}` : `/certificates/view/${id}`);
      const res = await api.get(endpoint);
      setCertificates(res.data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setCertificatesLoading(false);
    }
  }, [id, isOwnProfile, isAdmin]);

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

  // Image compression utility
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.7 quality
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Rasm hajmi juda katta!");
        return;
      }
      try {
        const compressedBase64 = await compressImage(file);
        setImagePreview(compressedBase64);
        setFormData(prev => ({ ...prev, profile_image: compressedBase64 }));
      } catch (error) {
        console.error("Compression error:", error);
        alert("Rasmni qayta ishlashda xatolik");
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="w-16 h-16 border-4 border-indigo-600/20 rounded-full relative">
        <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse italic">Profil Yuklanmoqda...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 animate-in fade-in duration-700">

      {/* 🚀 HERO SECTION - Mobile Optimized */}
      <div className="relative h-auto md:h-96 overflow-hidden bg-[#1a1c2e] pb-10 md:pb-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 opacity-90"></div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>

        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-[60px]"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex flex-col md:flex-row items-center md:items-end pb-0 md:pb-12 relative z-10 pt-10 md:pt-0">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 w-full">

            {/* 📸 Profile Image with Status Ring */}
            <div className="relative group shrink-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[2.5rem] blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="w-32 h-32 md:w-52 md:h-52 rounded-[2rem] md:rounded-[3rem] border-[6px] md:border-[8px] border-white dark:border-[#1a1c2e] bg-gray-800 shadow-2xl relative overflow-hidden group-hover:rotate-2 transition-transform duration-500">
                {imagePreview || profile?.profile_image ? (
                  <img src={getImageUrl(imagePreview || profile?.profile_image)} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white/50">
                    <User size={48} md:size={80} strokeWidth={1} />
                  </div>
                )}

                {/* Image Edit Overlay - Only on desktop or explicit touch */}
                {isOwnProfile && (
                  <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px]">
                    <Camera className="text-white mb-2" size={24} md:size={32} />
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">Rasmni yangilash</span>
                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                  </label>
                )}
              </div>

              {/* Online Status Badge */}
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl border-4 border-white dark:border-[#1a1c2e] shadow-lg">
                <CheckCircle2 size={16} md:size={24} fill="white" className="text-emerald-500" />
              </div>
            </div>

            {/* 👤 Info Block */}
            <div className="flex-1 text-center md:text-left space-y-3 md:space-y-4 w-full">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2 md:mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-[9px] font-black text-indigo-300 uppercase tracking-widest backdrop-blur-md">
                    Student ID: 00{profile?._id ? profile._id.slice(-3) : '---'}
                  </span>
                  {ranking && (
                    <span className="px-2.5 py-1 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-[9px] font-black text-yellow-400 uppercase tracking-widest backdrop-blur-md flex items-center gap-1">
                      <Trophy size={10} /> Rank #{ranking}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-6xl font-black text-white uppercase italic tracking-normal leading-none drop-shadow-xl truncate px-2 md:px-0">
                  {profile?.full_name}
                </h1>
                <p className="text-white/60 font-bold text-xs md:text-sm mt-2 flex items-center justify-center md:justify-start gap-2">
                  <GraduationCap size={14} />
                  {profile?.group?.name || 'Mustaqil o\'quvchi'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                {isOwnProfile && profile?.phone && (
                  <div className="px-5 py-3 bg-white/5 rounded-2xl flex items-center gap-3 backdrop-blur-sm border border-white/5">
                    <Phone size={14} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-300 tracking-wider tabular-nums">{profile?.phone}</span>
                  </div>
                )}

                {isOwnProfile && (
                  <button onClick={() => setEditModal(true)} className="px-6 py-3 bg-white text-indigo-900 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <Settings size={14} className="animate-spin-slow" /> Profilni Tahrirlash
                  </button>
                )}

                {isOwnProfile && (
                  <button onClick={() => { studentLogout(); navigate('/student-login'); }} className="px-6 py-3 bg-red-500 text-white rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <LogOut size={14} /> Chiqish
                  </button>
                )}

                {isOwnProfile && (
                  <button onClick={() => navigate('/student')} className="md:hidden px-4 py-3 bg-white/10 text-white rounded-2xl font-bold border border-white/10 backdrop-blur-md">
                    <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-6 md:-mt-8 relative z-20 space-y-8 md:space-y-0">
        <div className="grid lg:grid-cols-3 gap-6 md:gap-10">

          {/* LEFT SIDEBAR - Stats & Quick Info */}
          <div className="space-y-6">

            {/* Quick Stats Card */}
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl border border-gray-100 dark:border-gray-700/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-full -mr-10 -mt-10 blur-3xl"></div>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white italic">Faoliyat</h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <Award className="text-amber-500" size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Yutuqlar</span>
                  </div>
                  <span className="text-xl font-black italic tabular-nums dark:text-white">{badges.length}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-emerald-500" size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sertifikatlar</span>
                  </div>
                  <span className="text-xl font-black italic tabular-nums dark:text-white">{certificates.length}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-indigo-500" size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">A'zolik</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider dark:text-white">{profile?.createdAt ? format(new Date(profile.createdAt), 'MMM yyyy', { locale: uz }) : '---'}</span>
                </div>
              </div>
            </div>

            {/* Back Button (Desktop) */}
            {isOwnProfile && (
              <button
                onClick={() => navigate('/student')}
                className="hidden md:flex w-full bg-white dark:bg-gray-800 rounded-[2rem] p-5 text-gray-400 font-black uppercase tracking-widest shadow-lg border border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600 transition-all items-center justify-center gap-3 text-[10px]"
              >
                <ArrowLeft size={16} /> Dashboardga qaytish
              </button>
            )}
          </div>

          {/* RIGHT CONTENT - Tabs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Custom Tab Switcher */}
            <div className="bg-white dark:bg-gray-800 p-2 rounded-[2rem] shadow-lg flex border border-gray-100 dark:border-gray-700/50 relative overflow-hidden">
              <div className={`absolute top-2 bottom-2 w-[48%] bg-indigo-600 rounded-[1.5rem] transition-all duration-500 ease-spring ${activeTab === 'badges' ? 'left-2' : 'left-[50%]'}`}></div>

              <button onClick={() => setActiveTab('badges')} className={`flex-1 py-4 md:py-5 rounded-[1.5rem] text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 relative z-10 transition-colors ${activeTab === 'badges' ? 'text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                <Award size={16} md:size={18} /> Yutuqlar
              </button>
              <button onClick={() => setActiveTab('certificates')} className={`flex-1 py-4 md:py-5 rounded-[1.5rem] text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 relative z-10 transition-colors ${activeTab === 'certificates' ? 'text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                <GraduationCap size={16} md:size={18} /> Sertifikatlar
              </button>
            </div>

            {/* TAB CONTENT */}
            {activeTab === 'badges' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 animate-in slide-in-from-bottom-4 duration-500">
                {badges.length === 0 ? (
                  <div className="col-span-full py-20 text-center bg-gray-100 dark:bg-gray-800/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <Award size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Hozircha yutuqlar yo'q</p>
                  </div>
                ) : (
                  badges.map(badge => (
                    <div key={badge._id} className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col items-center text-center hover:shadow-xl transition-all group">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-500 mb-4 group-hover:scale-110 group-hover:rotate-12 transition-transform">
                        <Award size={32} md:size={40} strokeWidth={2} />
                      </div>
                      <h4 className="font-black text-gray-900 dark:text-white uppercase text-[10px] md:text-xs italic leading-tight mb-2">{badge.badge_id?.name || 'Yutuq'}</h4>
                      <p className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-wider line-clamp-2">{badge.badge_id?.description}</p>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-in slide-in-from-bottom-4 duration-500">
                {certificates.length === 0 ? (
                  <div className="col-span-full py-20 text-center bg-gray-100 dark:bg-gray-800/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <GraduationCap size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Sertifikatlar mavjud emas</p>
                  </div>
                ) : (
                  certificates.map(cert => (
                    <div key={cert._id} className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700/50 relative overflow-hidden group hover:shadow-xl transition-all">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-8 -mt-8"></div>
                      <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/20">
                        <GraduationCap size={24} />
                      </div>
                      <h4 className="font-black text-gray-900 dark:text-white text-lg md:text-xl italic uppercase tracking-tighter mb-1 leading-none">{cert.title || 'Sertifikat'}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">{cert.course_id?.name || 'Kurs nomi'}</p>

                      <a
                        href={cert.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        Yuklab olish <Download size={14} />
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✏️ EDIT MODAL - Optimized */}
      {editModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#1a1c2e] w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative animate-in zoom-in-95">
            <button onClick={() => setEditModal(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-rose-500 transition-colors">
              <X size={24} />
            </button>

            <h3 className="text-2xl font-black mb-8 dark:text-white italic uppercase tracking-tighter text-center">Profilni Tahrirlash</h3>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">ISM FAMILIYA</label>
                <input
                  required
                  type="text"
                  value={formData.full_name}
                  onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-black/20 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-sm font-bold dark:text-white transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">TELEFON RAQAM</label>
                <input
                  required
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-black/20 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-sm font-bold dark:text-white transition-all outline-none"
                />
              </div>

              <div className="pt-4 grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => { setEditModal(false); setPassModal(true); }}
                  className="w-full py-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-[10px] hover:bg-indigo-100 transition-all"
                >
                  XAVFSIZLIK SOZLAMALARI
                </button>
                <button
                  type="submit"
                  disabled={editing}
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black shadow-lg shadow-indigo-600/30 text-xs uppercase tracking-widest disabled:opacity-50 hover:bg-indigo-700 transition-all"
                >
                  {editing ? 'SAQLANMOQDA...' : 'SAQLASH'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔐 PASSWORD MODAL - Optimized */}
      {passModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#1a1c2e] w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative animate-in zoom-in-95">
            <button onClick={() => setPassModal(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-rose-500 transition-colors">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-black mb-8 dark:text-white italic uppercase tracking-tighter text-center">Xavfsizlik</h3>

            <form onSubmit={handleChangePassword} className="space-y-5">
              {['Joriy Parol', 'Yangi Parol', 'Tasdiqlash'].map((label, i) => (
                <div key={i} className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">{label}</label>
                  <input
                    required
                    type="password"
                    value={i === 0 ? passData.oldPassword : i === 1 ? passData.newPassword : passData.confirmPassword}
                    onChange={e => {
                      const key = i === 0 ? 'oldPassword' : i === 1 ? 'newPassword' : 'confirmPassword';
                      setPassData({ ...passData, [key]: e.target.value })
                    }}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-black/20 border-2 border-transparent focus:border-indigo-500 rounded-2xl text-sm font-bold dark:text-white transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={passLoading}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black shadow-lg shadow-indigo-600/30 mt-4 text-xs uppercase tracking-widest disabled:opacity-50 hover:bg-indigo-700 transition-all"
              >
                {passLoading ? 'YANGILANMOQDA...' : 'PAROLNI YANGILASH'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Custom Styles for animation */}
      <style>{`
         @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
         .animate-spin-slow { animation: spin-slow 8s linear infinite; }
         .ease-spring { transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
    </div>
  );
}
