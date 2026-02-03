import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import {
  Code,
  Play,
  Send,
  ArrowLeft,
=======
import { 
  Code, 
  Play, 
  Send, 
  ArrowLeft, 
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
  Eye,
  Maximize2,
  Minimize2,
  FileCode,
<<<<<<< HEAD
  CheckCircle,
  Terminal,
  Settings,
  ChevronRight,
  Sparkles,
  Info,
  X
=======
  CheckCircle
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
} from 'lucide-react';
import api from '../utils/api';

export default function StudentCodeEditor() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const iframeRef = useRef(null);
<<<<<<< HEAD

=======
  
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState(`<!DOCTYPE html>
<html lang="uz">
<head>
<<<<<<< HEAD
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mening Loyiham</title>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
        }
        .container {
            padding: 2rem;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 2rem;
            border: 1px solid rgba(255,255,255,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Salom, Dunyo! 👋</h1>
        <p>InFast Academy o'quvchisi tomonidan tayyorlandi.</p>
    </div>
=======
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mening sahifam</title>
  <style>
    /* CSS kodingizni shu yerga yozing */
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
    }
  </style>
</head>
<body>
  <!-- HTML kodingizni shu yerga yozing -->
  <h1>Salom dunyo!</h1>
  
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
</body>
</html>`);
  const [description, setDescription] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
<<<<<<< HEAD
  const [showTaskInfo, setShowTaskInfo] = useState(true);
=======
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  useEffect(() => {
<<<<<<< HEAD
    if (iframeRef.current && showPreview) {
=======
    // Update preview when code changes
    if (iframeRef.current) {
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
      const doc = iframeRef.current.contentDocument;
      doc.open();
      doc.write(code);
      doc.close();
    }
  }, [code, showPreview]);

  const fetchTask = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const response = await api.get(`/student-auth/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTask(response.data);
<<<<<<< HEAD
      if (response.data.submission?.code) setCode(response.data.submission.code);
=======
      
      // Load existing code if available
      if (response.data.submission?.code) {
        setCode(response.data.submission.code);
      }
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
    } catch (error) {
      console.error('Error fetching task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('studentToken');
<<<<<<< HEAD
      await api.post(`/student-auth/tasks/${taskId}/submit`,
=======
      await api.post(`/student-auth/tasks/${taskId}/submit`, 
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
        { code, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmitted(true);
<<<<<<< HEAD
      setTimeout(() => navigate('/student'), 2000);
    } catch (error) {
=======
      setShowSubmitModal(false);
      setTimeout(() => {
        navigate('/student/tasks');
      }, 2000);
    } catch (error) {
      console.error('Error submitting:', error);
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
      alert(error.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  };

<<<<<<< HEAD
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 gap-4">
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs animate-pulse">Muhit tayyorlanmoqda...</p>
    </div>
  );

  if (submitted) return (
    <div className="flex items-center justify-center h-screen bg-gray-950 font-jakarta">
      <div className="text-center space-y-6 animate-fade-in px-6">
        <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
          <CheckCircle size={48} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter mb-2 italic">MUVAFFAQIYAT!</h1>
          <p className="text-gray-400 font-medium tracking-wide">Vazifa muvaffaqiyatli topshirildi. Endi ustoz ko'rib chiqishi kutilmoqda.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`h-screen flex flex-col bg-gray-950 font-jakarta ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header - Premium Navigation */}
      <div className="h-18 bg-gray-900 border-b border-white/5 px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/student')} className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-gray-400 hover:text-white group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="h-8 w-px bg-white/5 mx-2 hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-500 flex items-center justify-center">
              <Code size={20} />
            </div>
            <div>
              <span className="font-black text-white truncate max-w-[150px] sm:max-w-xs block leading-none">{task?.title || 'Kod Muharriri'}</span>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1 block">InFast Studio IDE</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setShowTaskInfo(!showTaskInfo)}
            className={`p-2.5 rounded-xl transition-all ${showTaskInfo ? 'text-indigo-500 bg-indigo-500/10' : 'text-gray-400 hover:text-white'}`}
            title="Vazifa ma'lumoti"
          >
            <Info size={20} />
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${showPreview ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
          >
            <Eye size={16} />
            <span className="hidden md:inline">Live Preview</span>
          </button>
          <div className="h-8 w-px bg-white/5 mx-1 hidden sm:block"></div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-gray-400 hover:text-white hidden sm:block"
=======
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-orange-500 to-red-600">
        <div className="text-center text-white animate-fade-in-up">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Vazifa topshirildi!</h1>
          <p className="text-white/80">Tez orada natijani ko'rasiz</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/student/tasks')}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <FileCode className="text-orange-500" size={20} />
            <span className="font-medium text-white">{task?.title || 'Vazifa'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showPreview 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Eye size={18} />
            <span className="hidden sm:inline">Ko'rish</span>
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
          <button
            onClick={() => setShowSubmitModal(true)}
<<<<<<< HEAD
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Send size={16} />
            Topshirish
=======
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <Send size={18} />
            <span>Topshirish</span>
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
          </button>
        </div>
      </div>

<<<<<<< HEAD
      {/* IDE Workspace */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Sidebar with Task Info */}
        {showTaskInfo && (
          <div className="w-80 bg-gray-900 border-r border-white/5 p-6 overflow-y-auto shrink-0 animate-fade-in hidden lg:block">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-white italic uppercase tracking-tighter text-xl">Vazifa</h3>
              <button onClick={() => setShowTaskInfo(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-6">
              <div className="bg-indigo-600/10 border border-indigo-600/20 p-5 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2"><Sparkles size={14} className="text-indigo-500" /></div>
                <p className="text-sm font-medium text-gray-300 leading-relaxed italic">"{task?.description || "Loyihani ko'rsatilgan talablar bo'yicha yakunlang."}"</p>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Talablar</p>
                <div className="space-y-2">
                  {['Toza kod yozish', 'Responsive dizayn', 'Semantik HTML'].map((req, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                      <CheckCircle size={14} className="text-emerald-500" />
                      <span className="text-xs font-bold text-gray-300">{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Code Editor Part */}
        <div className={`flex flex-col ${showPreview ? 'w-full lg:w-1/2' : 'w-full'} bg-gray-950 relative group`}>
          <div className="bg-gray-900/50 px-6 py-2 flex items-center justify-between border-b border-white/5 shrink-0">
            <div className="flex items-center gap-3">
              <Terminal size={14} className="text-indigo-500" />
              <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">source_code.html</span>
            </div>
            <Settings size={14} className="text-gray-700 hover:text-gray-400 cursor-pointer transition-colors" />
=======
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className={`flex flex-col ${showPreview ? 'w-1/2' : 'w-full'} border-r border-gray-700`}>
          <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
            <Code size={16} className="text-orange-500" />
            <span className="text-sm text-gray-400">HTML / CSS / JavaScript</span>
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
<<<<<<< HEAD
            className="flex-1 bg-transparent text-indigo-100 p-8 font-mono text-sm resize-none focus:outline-none leading-relaxed selection:bg-indigo-500/30 no-scrollbar"
            spellCheck={false}
            autoFocus
          />

          {/* Editor Stats Footer */}
          <div className="h-8 bg-indigo-600 flex items-center justify-between px-6 text-[9px] font-black text-white/80 uppercase tracking-widest shrink-0">
            <div className="flex items-center gap-4">
              <span>UTF-8</span>
              <span>Spaces: 4</span>
              <span className="text-white">Active</span>
            </div>
            <div>Line: {code.split('\n').length}</div>
          </div>
        </div>

        {/* Live Preview Part */}
        {showPreview && (
          <div className="hidden lg:flex lg:w-1/2 flex-col bg-white overflow-hidden shadow-2xl relative group">
            <div className="bg-gray-50 px-6 py-2 flex items-center justify-between border-b border-gray-200 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                </div>
                <div className="h-4 w-px bg-gray-200 mx-2"></div>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Output Preview</span>
              </div>
              <Maximize2 size={12} className="text-gray-400" />
            </div>
            <div className="flex-1 relative">
=======
            className="flex-1 bg-gray-900 text-gray-100 p-4 font-mono text-sm resize-none focus:outline-none"
            spellCheck={false}
            placeholder="Kodingizni shu yerga yozing..."
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="w-1/2 flex flex-col">
            <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
              <Play size={16} className="text-green-500" />
              <span className="text-sm text-gray-400">Natija</span>
            </div>
            <div className="flex-1 bg-white">
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
              <iframe
                ref={iframeRef}
                title="Preview"
                className="w-full h-full"
                sandbox="allow-scripts"
              />
<<<<<<< HEAD
              <div className="absolute bottom-4 right-4 group-hover:opacity-100 opacity-0 transition-opacity">
                <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    <span className="text-[10px] font-black tracking-widest uppercase">Live Sync</span>
                  </div>
                </div>
              </div>
=======
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
            </div>
          </div>
        )}
      </div>

<<<<<<< HEAD
      {/* Submit Modal - Premium Style */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-xl animate-fade-in">
          <div className="bg-gray-900 border border-white/10 rounded-[3rem] max-w-lg w-full p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>

            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-600/20">
                <Send size={28} className="text-white" />
              </div>
              <h2 className="text-2xl font-black text-white italic tracking-tighter">VAZIFANI TOPSHIRISH</h2>
              <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Barcha o'zgarishlarni tasdiqlaysizmi?</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Izoh (ixtiyoriy)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-3xl text-white font-medium text-sm focus:ring-4 ring-indigo-500/10 transition-all outline-none placeholder:text-gray-700 resize-none h-32"
                  placeholder="Ustozga qisqacha xabar yozing..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 py-5 bg-white/5 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-colors"
                >
                  Orqaga qaytish
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {submitting ? 'Yuborilmoqda...' : 'Tasdiqlash'}
                </button>
              </div>
=======
      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6 animate-fade-in-up">
            <h2 className="text-xl font-bold text-white mb-4">
              Vazifani topshirish
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Izoh (ixtiyoriy)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                placeholder="Vazifa haqida qo'shimcha ma'lumot..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-4 py-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-colors font-medium"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {submitting ? 'Yuborilmoqda...' : 'Topshirish'}
              </button>
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
<<<<<<< HEAD
=======

>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
