import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, ArrowLeft, Sparkles, ShieldCheck, ArrowRight, User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function StudentLogin() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { studentLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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
      setError(err.response?.data?.message || 'Login yoki parol xato');
    } finally {
      setLoading(false);
    }
  };

  return (
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
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center animate-fade-in uppercase tracking-wider">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-14 pr-14 py-5 bg-white/5 border border-white/5 rounded-2xl text-white font-bold focus:ring-4 ring-indigo-500/10 transition-all outline-none placeholder:text-gray-700"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
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
        </p>
      </div>
    </div>
  );
}
