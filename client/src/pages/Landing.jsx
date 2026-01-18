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
        {/* Background Elements */}
        <div className="absolute inset-0 mesh-bg"></div>
        <div className="absolute inset-0 bg-pattern opacity-30"></div>

        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary-400/30 to-primary-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-secondary-400/20 to-primary-500/20 rounded-full blur-3xl animate-float animate-delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-amber-300/20 to-orange-400/20 rounded-full blur-3xl animate-pulse-slow"></div>

        {/* Decorative Elements */}
        <div className="absolute top-32 right-20 w-20 h-20 border-4 border-primary-200 rounded-2xl rotate-12 animate-spin-slow opacity-50"></div>
        <div className="absolute bottom-40 left-20 w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl rotate-45 animate-bounce-slow opacity-30"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary-100 shadow-lg mb-8 animate-fade-in-down">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-sm font-medium text-gray-700">Yangi guruhlar ochilmoqda!</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-6 animate-fade-in-up leading-tight">
              <span className="gradient-text">IT kasbini</span> o'rganing
              <br />
              <span className="text-gray-800">kelajakni quring</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in-up animate-delay-200 leading-relaxed">
              Andijon viloyatidagi <span className="font-semibold text-primary-600">yetakchi IT ta'lim markazi</span>.
              Zamonaviy kasblarni professional ustozlardan o'rganing va
              <span className="font-semibold"> muvaffaqiyatli karyera</span> boshlang!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-300">
              <Link to="/courses" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2 group">
                <span>Kurslarni ko'rish</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <button
                onClick={() => setShowRegistrationModal(true)}
                className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <span>Kursga yozilish</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 animate-fade-in-up animate-delay-500">
              <p className="text-sm text-gray-500 mb-4">Bizga ishonishadi:</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-sm">
                    IT
                  </div>
                  <span className="font-medium">IT Park</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-sm">
                    UD
                  </div>
                  <span className="font-medium">Udevs</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-sm">
                    EX
                  </div>
                  <span className="font-medium">Exadel</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(249,115,22,0.3),transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(239,68,68,0.2),transparent_50%)]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-5xl lg:text-6xl font-black text-white mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-24 bg-gray-50 relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              O'quv dasturlari
            </span>
            <h2 className="section-title">
              Bizning <span className="gradient-text">Kurslar</span>
            </h2>
            <p className="section-subtitle">
              Sizga mos keladigan yo'nalishni tanlang va professional mutaxassis bo'ling
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div
                key={course.id}
                className="group bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 border border-gray-100 relative overflow-hidden"
              >
                {/* Hover Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                <div className="relative">
                  {/* Icon */}
                  <div className={`${course.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    <course.icon className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-2">{course.description}</p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>Amaliy</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => {
                      setRegistrationData({...registrationData, course: course.id});
                      setShowRegistrationModal(true);
                    }}
                    className="inline-flex items-center gap-2 text-primary-600 font-semibold group-hover:gap-3 transition-all"
                  >
                    <span>Batafsil ma'lumot</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link to="/courses" className="btn-primary inline-flex items-center gap-2 px-8 py-4">
              <span>Barcha kurslarni ko'rish</span>
              <ArrowRight className="w-5 h-5" />
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

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(249,115,22,0.4),transparent_40%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(239,68,68,0.3),transparent_40%)]"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-white/90">Yangi guruhlar tez orada boshlanadi</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            IT karyerangizni <span className="text-primary-400">bugun</span> boshlang!
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Hoziroq ro'yxatdan o'ting va bepul konsultatsiya oling.
            Biz sizning muvaffaqiyatingiz uchun barcha sharoitlarni yaratamiz.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowRegistrationModal(true)}
              className="btn-primary text-lg px-10 py-5 inline-flex items-center justify-center gap-2 group"
            >
              <span>Kursga yozilish</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="tel:+998937435225"
              className="btn-outline text-lg px-10 py-5 inline-flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              <span>Qo'ng'iroq qiling</span>
            </a>
          </div>

          {/* Contact Info */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Andijon, Buloqboshi tumani</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>+998 93 743 52 25</span>
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

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Kursga yozilish</h3>
                <p className="text-gray-600">Ma'lumotlaringizni kiriting va tez orada siz bilan bog'lanamiz</p>
              </div>

              <form onSubmit={handleRegistration} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ism va familiya *
                  </label>
                  <input
                    type="text"
                    required
                    value={registrationData.name}
                    onChange={(e) => setRegistrationData({...registrationData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Masalan: Azizbek Tursunov"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon raqam *
                  </label>
                  <input
                    type="tel"
                    required
                    value={registrationData.phone}
                    onChange={(e) => setRegistrationData({...registrationData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="+998 XX XXX XX XX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qiziqishgan kurs *
                  </label>
                  <select
                    required
                    value={registrationData.course}
                    onChange={(e) => setRegistrationData({...registrationData, course: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Kursni tanlang</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dasturlash tajribasi
                  </label>
                  <select
                    value={registrationData.experience}
                    onChange={(e) => setRegistrationData({...registrationData, experience: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Tajribani tanlang</option>
                    <option value="beginner">Boshlovchi (hech narsa bilmayman)</option>
                    <option value="basic">Asosiy (HTML/CSS bilaman)</option>
                    <option value="intermediate">O'rta (bir nechta til bilaman)</option>
                    <option value="advanced">Yuqori (professional darajada)</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRegistrationModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg"
                  >
                    Yuborish
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
}