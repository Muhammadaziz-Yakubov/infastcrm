import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  Phone,
  MapPin,
  Mail,
  Star,
  CheckCircle,
  ArrowRight,
  Code,
  Shield,
  Smartphone,
  Palette,
  Camera,
  TrendingUp,
  Menu,
  X,
  Play,
  ChevronDown,
  Zap,
  Target,
  Heart,
  MessageCircle,
  Calendar,
  Clock
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    phone: '',
    course: '',
    experience: ''
  });

  const courses = [
    {
      id: 'frontend',
      title: 'Frontend Development',
      icon: Code,
      price: '300,000',
      duration: '9 oy',
      description: 'React, Vue, Angular kabi zamonaviy frameworklar',
      features: ['HTML/CSS/JavaScript', 'React & Vue.js', 'Responsive Design', 'Git & GitHub'],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'backend',
      title: 'Backend Development',
      icon: Shield,
      price: '500,000',
      duration: '6 oy',
      description: 'Server-side development va database management',
      features: ['Node.js & Express', 'MongoDB & PostgreSQL', 'REST API', 'Authentication'],
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      id: 'cyber',
      title: 'Cyber Security',
      icon: Shield,
      price: '1,200,000',
      duration: '11 oy',
      description: 'Kiber xavfsizlik va etik hacking',
      features: ['Network Security', 'Ethical Hacking', 'Penetration Testing', 'Security Tools'],
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50'
    },
    {
      id: 'smm',
      title: 'SMM Marketing',
      icon: TrendingUp,
      price: '300,000',
      duration: '4 oy',
      description: 'Ijtimoiy tarmoqlarda marketing',
      features: ['Content Creation', 'Social Media Strategy', 'Ads Management', 'Analytics'],
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'mobile',
      title: 'Mobilografiya',
      icon: Camera,
      price: '300,000',
      duration: '4 oy',
      description: 'Mobil fotografiya va video',
      features: ['Mobile Photography', 'Video Editing', 'Lighting', 'Composition'],
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'graphic',
      title: 'Grafik Dizayn',
      icon: Palette,
      price: '300,000',
      duration: '4 oy',
      description: 'Grafik dizayn va branding',
      features: ['Adobe Suite', 'Logo Design', 'Branding', 'Print Design'],
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50'
    }
  ];

  const stats = [
    { icon: Users, value: '500+', label: 'Bitiruvchilar', color: 'text-blue-600' },
    { icon: BookOpen, value: '6+', label: 'Kurslar', color: 'text-green-600' },
    { icon: Award, value: '95%', label: 'Ishga joylashish', color: 'text-purple-600' },
    { icon: Star, value: '4.8', label: 'Reyting', color: 'text-yellow-600' }
  ];

  const testimonials = [
    {
      name: 'Azizbek T.',
      role: 'Frontend Developer',
      company: 'TechCorp',
      content: 'InFast Academy kursi mening hayotimni o\'zgartirdi. Professional mentorlar va zamonaviy o\'quv dasturi.',
      avatar: 'AT'
    },
    {
      name: 'Madina K.',
      role: 'Backend Developer',
      company: 'StartupXYZ',
      content: '6 oy ichida noldan backend developer bo\'ldim. Kurs juda sifatli va amaliy edi.',
      avatar: 'MK'
    },
    {
      name: 'Rustam S.',
      role: 'Cyber Security Specialist',
      company: 'SecureTech',
      content: 'Cyber Security kursi menga yangi karyera yo\'nalishini ochdi. Minnatdorman!',
      avatar: 'RS'
    }
  ];

  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      // Bot token'ini environment variable'dan olish
      const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN';

      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: '-5148910044', // Guruh ID
          text: `🎓 *Yangi kursga yozilish!*\n\n👤 *Ism:* ${registrationData.name}\n📱 *Telefon:* ${registrationData.phone}\n🎯 *Kurs:* ${courses.find(c => c.id === registrationData.course)?.title}\n💼 *Tajriba:* ${registrationData.experience}\n\n⏰ *Vaqt:* ${new Date().toLocaleString('uz-UZ')}`,
          parse_mode: 'Markdown'
        })
      });

      if (response.ok) {
        alert('✅ Muvaffaqiyatli yuborildi! Tez orada siz bilan bog\'lanamiz.');
        setShowRegistrationModal(false);
        setRegistrationData({ name: '', phone: '', course: '', experience: '' });
      } else {
        const errorData = await response.json();
        console.error('Telegram API error:', errorData);
        alert('❌ Xatolik yuz berdi. Qayta urinib ko\'ring.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('❌ Xatolik yuz berdi. Qayta urinib ko\'ring.');
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  InFast Academy
                </span>
                <p className="text-xs text-gray-500">IT Ta'lim Markazi</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/courses" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Kurslar</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Biz haqimizda</Link>
              <Link to="/team" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">O'qituvchilar</Link>
              <Link to="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Blog</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Aloqa</Link>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/login')}
                className="hidden sm:inline-flex px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Admin
              </button>
              <button
                onClick={() => navigate('/student-login')}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Kirish
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <Link to="/courses" className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Kurslar</Link>
                <Link to="/about" className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Biz haqimizda</Link>
                <Link to="/team" className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2" onClick={() => setIsMenuOpen(false)}>O'qituvchilar</Link>
                <Link to="/blog" className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Blog</Link>
                <Link to="/contact" className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Aloqa</Link>
                <button
                  onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                  className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                >
                  Admin Login
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0 premium-bg"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-blue-900/10 to-purple-900/20"></div>

        {/* Floating Premium Elements */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/15 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-gradient-to-br from-emerald-400/15 to-blue-500/10 rounded-full blur-3xl animate-float-slow animate-delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-gradient-to-br from-rose-300/20 to-pink-400/15 rounded-full blur-3xl animate-float-slow animate-delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-amber-300/25 to-orange-400/15 rounded-full blur-3xl animate-pulse-glow"></div>

        {/* Premium Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-particle-1"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-particle-2"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-particle-3"></div>
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-particle-4"></div>
          <div className="absolute bottom-1/3 right-1/2 w-2 h-2 bg-amber-400 rounded-full animate-particle-5"></div>
        </div>

        {/* Decorative Geometric Shapes */}
        <div className="absolute top-32 right-20 w-24 h-24 border-2 border-white/10 rounded-3xl rotate-12 animate-spin-slow opacity-30"></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-gradient-to-br from-blue-400/30 to-purple-600/20 rounded-2xl rotate-45 animate-bounce-slow opacity-40"></div>
        <div className="absolute top-3/4 right-10 w-16 h-16 border border-white/20 rounded-full animate-pulse-slow opacity-50"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl mb-10 animate-fade-in-down">
              <div className="relative">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-sm font-semibold text-white/90 tracking-wide">PREMIUM IT TA'LIM MARKAZI</span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-white/70">Andijon 2024</span>
              </div>
            </div>

            {/* Premium Main Heading */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white mb-8 animate-fade-in-up leading-none">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-2xl">
                IT kasbini
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-lg">
                premium tarzda
              </span>
              <br />
              <span className="text-white drop-shadow-2xl">o'rganing</span>
            </h1>

            {/* Premium Subtitle */}
            <p className="text-xl sm:text-2xl text-white/80 mb-12 max-w-3xl mx-auto animate-fade-in-up animate-delay-300 leading-relaxed font-light">
              Andijon viloyatidagi <span className="font-semibold text-white">eng zamonaviy IT ta'lim markazi</span>.
              Premium kurslar, individual yondashuv va
              <span className="font-semibold text-blue-200"> 100% ishga joylashish</span> kafolati.
            </p>

            {/* Premium CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animate-delay-500">
              <Link to="/courses" className="premium-btn-primary text-lg px-10 py-5 inline-flex items-center justify-center gap-3 group">
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span>Premium Kurslarni Ko'rish</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <button
                onClick={() => setShowRegistrationModal(true)}
                className="premium-btn-secondary text-lg px-10 py-5 inline-flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span>Bepul Konsultatsiya</span>
              </button>
            </div>

            {/* Premium Stats */}
            <div className="mt-20 animate-fade-in-up animate-delay-700">
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-4xl font-black text-white mb-2 drop-shadow-lg">500+</div>
                  <div className="text-sm text-white/70 font-medium">Bitiruvchilar</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-white mb-2 drop-shadow-lg">95%</div>
                  <div className="text-sm text-white/70 font-medium">Ishga joylashish</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-white mb-2 drop-shadow-lg">4.9</div>
                  <div className="text-sm text-white/70 font-medium">Reyting</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
          <div className="w-8 h-14 border-2 border-white/30 rounded-full flex justify-center pt-3 backdrop-blur-sm bg-white/5">
            <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Premium Stats Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(147,51,234,0.1),transparent_50%)]"></div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/5 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse-slow"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Bizning <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">muvaffaqiyatlarimiz</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Minglab o'quvchilarni muvaffaqiyatli karyeraga yo'l oldik
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group relative">
                {/* Premium Card Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 rounded-3xl backdrop-blur-xl border border-white/10 group-hover:border-white/20 transition-all duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border border-white/10">
                    <stat.icon className="h-8 w-8 text-blue-400" />
                  </div>
                  <div className="text-5xl lg:text-6xl font-black text-white mb-3 group-hover:scale-110 transition-transform drop-shadow-lg">
                    {stat.value}
                  </div>
                  <div className="text-white/70 font-medium text-lg">{stat.label}</div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shine"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Courses Section */}
      <section className="py-32 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 relative overflow-hidden">
        {/* Premium Background Elements */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white via-white/50 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23e0f2fe" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-emerald-200/15 to-blue-200/15 rounded-full blur-3xl animate-float-slow animate-delay-1000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <span className="inline-block px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-bold mb-6 shadow-lg border border-blue-200/50">
              ✨ Premium Kurslar
            </span>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Premium ta'lim
              </span>
              <br />
              <span className="text-gray-800">sizning kelajagingiz uchun</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Har bir kurs individual yondashuv, premium materiallar va
              <span className="font-semibold text-blue-600"> 100% amaliy mashg'ulotlar</span> bilan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div
                key={course.id}
                className="group relative"
              >
                {/* Premium Card Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-700 group-hover:-translate-y-4 border border-white/50 backdrop-blur-xl"></div>
                <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-0 group-hover:opacity-10 transition-all duration-700 rounded-3xl`}></div>

                {/* Shine Effect */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine-slow"></div>

                <div className="relative p-10">
                  {/* Premium Icon */}
                  <div className="relative mb-8">
                    <div className={`${course.iconBg} w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-4 border-white/20`}>
                      <course.icon className="w-10 h-10" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">★</span>
                    </div>
                  </div>

                  {/* Premium Badge */}
                  <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-xs font-bold mb-4 border border-blue-200/50">
                    Premium
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed group-hover:text-gray-700 transition-colors">{course.description}</p>

                  {/* Premium Features */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Individual mentor</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Real loyihalar</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Sertifikat</span>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between mb-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700 font-semibold">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-600" />
                      <span className="text-gray-700 font-semibold">Amaliy</span>
                    </div>
                  </div>

                  {/* Premium CTA */}
                  <button
                    onClick={() => {
                      setRegistrationData({...registrationData, course: course.id});
                      setShowRegistrationModal(true);
                    }}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-500 font-bold text-lg shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 group/btn"
                  >
                    <span>Kursga yozilish</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Premium CTA */}
          <div className="text-center mt-20">
            <Link to="/courses" className="premium-btn-secondary inline-flex items-center gap-3 px-10 py-5 text-lg font-bold">
              <span>Barcha premium kurslarni ko'rish</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-50 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
                Afzalliklarimiz
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Nima uchun <br/><span className="gradient-text">InFast Academy</span>?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Biz sizning muvaffaqiyatingiz uchun eng yaxshi sharoitlarni yaratamiz.
                4 yillik tajriba va 500+ bitiruvchi - bu bizning ishonchliligimiz kafolati.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 flex-shrink-0">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Amaliy loyihalar</h3>
                    <p className="text-sm text-gray-600">Har bir kursda real loyihalar ustida ishlaysiz va portfolio yaratasiz</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 flex-shrink-0">
                    <Users className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Malakali mentorlar</h3>
                    <p className="text-sm text-gray-600">Sohaning eng yaxshi mutaxassislaridan individual yordam olasiz</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 flex-shrink-0">
                    <Award className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Ishga joylashish</h3>
                    <p className="text-sm text-gray-600">Bitiruvchilarni hamkor kompaniyalarga ishga joylashtiramiz</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 flex-shrink-0">
                    <Zap className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Zamonaviy dastur</h3>
                    <p className="text-sm text-gray-600">Eng so'ngi texnologiyalar va metodikalar asosida o'qitamiz</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Stats Card */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl p-8 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                </div>

                <div className="relative">
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                      <Award className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Sifat kafolati</h3>
                    <p className="text-white/80">Har bir o'quvchi uchun individual yondashuv</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold mb-1">95%</div>
                      <div className="text-sm text-white/80">Ishga joylashish</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold mb-1">4.9</div>
                      <div className="text-sm text-white/80">O'rtacha baho</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold mb-1">500+</div>
                      <div className="text-sm text-white/80">Bitiruvchilar</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold mb-1">50+</div>
                      <div className="text-sm text-white/80">Hamkorlar</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 animate-float">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sertifikat</div>
                  <div className="text-sm text-gray-500">Rasmiy hujjat</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              Fikrlar
            </span>
            <h2 className="section-title">
              Bitiruvchilar <span className="gradient-text">nima deydi?</span>
            </h2>
            <p className="section-subtitle">
              Bizning o'quvchilarimiz muvaffaqiyat hikoyalari
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-500 relative">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 text-primary-100">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                    <div className="text-xs text-primary-600 font-medium">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Process Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              O'quv jarayoni
            </span>
            <h2 className="section-title">
              Qanday <span className="gradient-text">o'qitamiz?</span>
            </h2>
            <p className="section-subtitle">
              4 bosqichli zamonaviy va samarali ta'lim metodikasi
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200 -translate-y-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Asoslar', desc: 'Dastlabki bosqichda asosiy tushunchalar va nazariy bilimlarni o\'rganasiz', icon: '📖' },
                { step: '02', title: 'Amaliyot', desc: 'Ko\'p mashqlar va real vazifalar orqali bilimlarni mustahkamlaysiz', icon: '💻' },
                { step: '03', title: 'Loyiha', desc: 'Portfolioni to\'ldirish uchun real loyihalar ustida ishlaysiz', icon: '🚀' },
                { step: '04', title: 'Karyera', desc: 'Ishga joylashish uchun resume tayyorlash va intervyuga tayyorgarlik', icon: '💼' }
              ].map((item, index) => (
                <div key={index} className="relative group">
                  <div className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 relative z-10">
                    {/* Step Number */}
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      {item.icon}
                    </div>

                    <div className="text-sm font-bold text-primary-500 mb-2">BOSQICH {item.step}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bizning <span className="gradient-text">hamkorlarimiz</span>
            </h2>
            <p className="text-gray-600">
              Bitiruvchilarimiz ishlaydigan kompaniyalar
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'IT Park', logo: 'IT' },
              { name: 'Udevs', logo: 'UD' },
              { name: 'Exadel', logo: 'EX' },
              { name: 'EPAM', logo: 'EP' },
              { name: 'Softline', logo: 'SL' },
              { name: 'DataArt', logo: 'DA' }
            ].map((partner, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 flex flex-col items-center justify-center h-28 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-all duration-300 mb-2">
                  {partner.logo}
                </div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black"></div>

        {/* Premium Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(147,51,234,0.08),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.06),transparent_60%)]"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/8 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-20 w-[28rem] h-[28rem] bg-gradient-to-br from-emerald-500/8 to-blue-500/6 rounded-full blur-3xl animate-float-slow animate-delay-2000"></div>

        {/* Premium Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-particle-1 opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full animate-particle-2 opacity-60"></div>
          <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-particle-3 opacity-60"></div>
          <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-particle-4 opacity-60"></div>
          <div className="absolute bottom-1/3 right-1/2 w-3 h-3 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full animate-particle-5 opacity-60"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Premium Status Badge */}
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-full border border-white/20 mb-12 shadow-2xl">
            <div className="relative">
              <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <span className="text-sm font-bold text-white tracking-wider">PREMIUM KURSGA YOZILISH</span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-white/70 bg-white/10 px-2 py-1 rounded-full">LIMITED</span>
            </div>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
            Premium IT karyerangizni
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              bugun boshlang!
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Hoziroq premium kursga yoziling va <span className="font-semibold text-white">bepul konsultatsiya</span> oling.
            Biz sizning muvaffaqiyatingiz uchun eng yaxshi sharoitlarni yaratamiz.
          </p>

          {/* Premium CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button
              onClick={() => setShowRegistrationModal(true)}
              className="premium-btn-primary text-xl px-12 py-6 inline-flex items-center justify-center gap-4 group shadow-2xl hover:shadow-blue-500/25"
            >
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <span>Premium kursga yozilish</span>
              <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>

            <a
              href="tel:+998937435225"
              className="premium-btn-outline text-xl px-12 py-6 inline-flex items-center justify-center gap-4"
            >
              <Phone className="w-6 h-6" />
              <span>Shaxsiy konsultatsiya</span>
            </a>
          </div>

          {/* Premium Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                <MapPin className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Manzil</h3>
              <p className="text-white/70 leading-relaxed">
                Andijon viloyati<br />
                Buloqboshi tumani<br />
                Yangi Hokimiyat binosi
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                <Phone className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Telefon</h3>
              <div className="text-white/70 space-y-1">
                <a href="tel:+998937435225" className="block hover:text-white transition-colors font-medium">
                  +998 93 743 52 25
                </a>
                <a href="tel:+998902570100" className="block hover:text-white transition-colors font-medium">
                  +998 90 257 01 00
                </a>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Ish vaqti</h3>
              <p className="text-white/70 leading-relaxed">
                Dushanba - Shanba<br />
                <span className="font-semibold text-white">9:00 - 18:00</span><br />
                <span className="text-sm text-white/60">Yakshanba: Dam olish</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl mr-4">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold">InFast Academy</span>
                  <p className="text-gray-400 text-sm">IT Ta'lim Markazi</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                Zamonaviy IT ta'limi bilan kelajagingizni yarating. Professional mentorlar
                bilan real loyihalarda tajriba orttiring.
              </p>
              <div className="flex space-x-4">
                <a href="https://t.me/InFast_edu" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  💬
                </a>
                <a href="https://www.instagram.com/infast_academy" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors">
                  📸
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Sahifalar</h4>
              <ul className="space-y-3">
                <li><Link to="/courses" className="text-gray-400 hover:text-white transition-colors">Kurslar</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Biz haqimizda</Link></li>
                <li><Link to="/team" className="text-gray-400 hover:text-white transition-colors">O'qituvchilar</Link></li>
                <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Aloqa</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Aloqa</h4>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-400">
                  <MapPin className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span>Buloqboshi tumani, Yangi hokimiyat binosi</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <Phone className="h-5 w-5 mr-3 flex-shrink-0" />
                  <div>
                    <a href="tel:+998937435225" className="hover:text-blue-400 transition-colors block">+998 93 743 52 25</a>
                    <a href="tel:+998902570100" className="hover:text-blue-400 transition-colors block text-sm">+998 90 257 01 00</a>
                  </div>
                </li>
                <li className="flex items-center text-gray-400">
                  <Mail className="h-5 w-5 mr-3 flex-shrink-0" />
                  <a href="mailto:info@infast-academy.uz" className="hover:text-blue-400 transition-colors">info@infast-academy.uz</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                © 2024 InFast IT-Academy. Barcha huquqlar himoyalangan.
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <a href="#" className="hover:text-white transition-colors">Maxfiylik siyosati</a>
                <span>•</span>
                <a href="#" className="hover:text-white transition-colors">Foydalanish shartlari</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Premium Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-hidden border border-white/20">
            {/* Premium Header */}
            <div className="relative p-8 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/30">
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-3">Premium kursga yozilish</h3>
                <p className="text-white/90 font-light">Ma'lumotlaringizni kiriting va bepul konsultatsiya oling</p>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <form onSubmit={handleRegistration} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Ism va familiya *
                  </label>
                  <input
                    type="text"
                    required
                    value={registrationData.name}
                    onChange={(e) => setRegistrationData({...registrationData, name: e.target.value})}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 font-medium"
                    placeholder="Masalan: Azizbek Tursunov"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Telefon raqam *
                  </label>
                  <input
                    type="tel"
                    required
                    value={registrationData.phone}
                    onChange={(e) => setRegistrationData({...registrationData, phone: e.target.value})}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 font-medium"
                    placeholder="+998 XX XXX XX XX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Qiziqishgan kurs *
                  </label>
                  <select
                    required
                    value={registrationData.course}
                    onChange={(e) => setRegistrationData({...registrationData, course: e.target.value})}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-900 font-medium"
                  >
                    <option value="">Kursni tanlang</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Dasturlash tajribasi
                  </label>
                  <select
                    value={registrationData.experience}
                    onChange={(e) => setRegistrationData({...registrationData, experience: e.target.value})}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-900 font-medium"
                  >
                    <option value="">Tajribani tanlang</option>
                    <option value="beginner">Boshlang'ich (hech narsa bilmayman)</option>
                    <option value="basic">Asosiy (HTML/CSS bilaman)</option>
                    <option value="intermediate">O'rta (bir nechta til bilaman)</option>
                    <option value="advanced">Yuqori (professional darajada)</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowRegistrationModal(false)}
                    className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-semibold hover:scale-105 transform"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold shadow-xl hover:shadow-blue-500/25 hover:scale-105 transform"
                  >
                    Premium kursga yozilish
                  </button>
                </div>
              </form>

              {/* Premium Trust Indicators */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Bepul konsultatsiya</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>Individual yondashuv</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span>Premium ta'lim</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
}