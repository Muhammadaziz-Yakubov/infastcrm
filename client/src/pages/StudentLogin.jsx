<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, ArrowLeft, Sparkles, ShieldCheck, ArrowRight, User, Lock, AlertTriangle, Moon, Sun, RefreshCw, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
=======
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, ArrowLeft, Sparkles } from 'lucide-react';
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
import api from '../utils/api';

export default function StudentLogin() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const navigate = useNavigate();
  const { studentLogin } = useAuth();
  const { darkMode } = useTheme();

  // Check maintenance status on component mount
  useEffect(() => {
    checkMaintenanceStatus();
    
    // Set up periodic check
    const interval = setInterval(checkMaintenanceStatus, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const checkMaintenanceStatus = async () => {
    try {
      const response = await api.get('/maintenance/status');
      if (response.data.enabled) {
        setMaintenanceMode(true);
        setMaintenanceMessage(response.data.message);
      } else {
        setMaintenanceMode(false);
        setMaintenanceMessage('');
      }
    } catch (error) {
      // If maintenance endpoint fails, assume no maintenance
      setMaintenanceMode(false);
      setMaintenanceMessage('');
    }
  };
=======
  const navigate = useNavigate();
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

<<<<<<< HEAD
    if (!login.trim() || !password.trim()) {
      setError('Barcha maydonlarni to\'ldiring');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/student-auth/login', { login: login.trim(), password });
      const { token, student } = response.data;
      studentLogin(token, student);
      navigate('/student');
    } catch (err) {
      // Check if it's a maintenance error
      if (err.response?.status === 503 && err.response?.data?.maintenance) {
        setMaintenanceMode(true);
        setMaintenanceMessage(err.response.data.message || 'Texnik ishlar olib borilmoqda');
        setError('Tizim vaqtincha texnik ishlarda');
      } else {
        setError(err.response?.data?.message || 'Login yoki parol xato');
      }
=======
    try {
      const response = await api.post('/student-auth/login', { login, password });
      const { token, student } = response.data;
      
      localStorage.setItem('studentToken', token);
      localStorage.setItem('studentData', JSON.stringify(student));
      navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi');
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden font-jakarta">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-lg px-6 relative z-10 py-10">
        <div className="flex justify-center mb-10">
          <Link to="/login" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Admin Panelga o'tish
          </Link>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden group">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-[2rem] bg-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-600/40 relative">
              <GraduationCap className="text-white" size={40} />
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-4 border-gray-900 flex items-center justify-center scale-75">
                <ShieldCheck size={14} className="text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter mb-2">InFast Academy</h1>
            <p className="text-gray-400 font-medium uppercase tracking-[0.2em] text-[10px]">O'quvchi Shaxsiy Kabineti</p>
          </div>

          {error && (
            <div className={`mb-8 p-4 rounded-2xl text-xs font-bold text-center animate-fade-in uppercase tracking-wider ${
              maintenanceMode 
                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' 
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                {maintenanceMode ? <AlertTriangle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              </div>
=======
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Admin panelga o'tish</span>
        </Link>

        <div className="glass rounded-3xl p-8 shadow-2xl animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 mb-4 shadow-lg">
              <GraduationCap className="text-white" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <span>O'quvchi kabineti</span>
              <Sparkles className="text-yellow-400" size={24} />
            </h1>
            <p className="text-white/70">
              Shaxsiy kabinetingizga kiring
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm animate-fade-in-up">
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
              {error}
            </div>
          )}

<<<<<<< HEAD
          {/* Maintenance Mode Overlay */}
          {maintenanceMode && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 rounded-[3rem] p-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-10 h-10 text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-amber-400">Texnik Rejim</h3>
                <p className="text-amber-300 text-lg max-w-md">{maintenanceMessage}</p>
                <div className="space-y-3">
                  <p className="text-amber-200 text-sm">Tizim vaqtincha texnik ishlarda</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-4 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors flex items-center gap-3 mx-auto"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Sahifani Yangilash
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className={`space-y-6 ${maintenanceMode ? 'opacity-30 pointer-events-none' : ''}`}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Login</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-white font-bold focus:ring-4 ring-indigo-500/10 transition-all outline-none placeholder:text-gray-700"
                  placeholder="Loginingizni yozing"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Parol</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
=======
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Login
              </label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                placeholder="Loginingizni kiriting"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Parol
              </label>
              <div className="relative">
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
<<<<<<< HEAD
                  className="w-full pl-14 pr-14 py-5 bg-white/5 border border-white/5 rounded-2xl text-white font-bold focus:ring-4 ring-indigo-500/10 transition-all outline-none placeholder:text-gray-700"
=======
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all pr-12"
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
<<<<<<< HEAD
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
=======
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
<<<<<<< HEAD
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Kirilmoqda...
                </>
              ) : (
                <>
                  Tizimga kirish
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <div className="inline-flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <Sparkles size={14} className="text-yellow-500" />
              Ilm yo'lida omad tilaymiz!
            </div>
          </div>
        </div>

        <p className="text-center mt-10 text-gray-600 text-xs font-medium uppercase tracking-widest">
          Login va parolni markazdan oling
=======
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Kirilmoqda...
                </span>
              ) : (
                'Kirish'
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-white/60 text-sm">
          Login va parolni o'quv markazingizdan oling
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
        </p>
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
