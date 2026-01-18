import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Zap,
  Target,
  Heart,
  MessageCircle,
  Calendar,
  Clock
} from 'lucide-react';

export default function Landing() {
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
      name: 'Frontend Development',
      duration: '9 oy',
      price: '1,200,000 so\'m/oy',
      level: 'Boshlang\'ichdan',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      description: 'Zamonaviy veb-saytlar va web-ilovalar yaratishni o\'rganing',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      topics: [
        'HTML5 & CSS3 asoslari',
        'JavaScript (ES6+)',
        'React.js & Redux',
        'TypeScript',
        'Tailwind CSS & Bootstrap',
        'Git & GitHub',
        'Responsive dizayn',
        'Web performance optimizatsiya',
        'REST API integration',
        'Project management'
      ],
      skills: ['Veb-dizayn', 'UI/UX', 'JavaScript', 'React', 'TypeScript']
    },
    {
      id: 'backend',
      name: 'Backend Development',
      duration: '4 oy',
      price: '1,000,000 so\'m/oy',
      level: 'Boshlang\'ichdan',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
      description: 'Server tomoni dasturlash va ma\'lumotlar bazasini boshqarish',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-emerald-50',
      topics: [
        'Node.js & Express.js',
        'Python & Django',
        'MongoDB & PostgreSQL',
        'REST API & GraphQL',
        'Authentication & Authorization',
        'Cloud services (AWS, Azure)',
        'Microservices architecture',
        'Docker & Kubernetes',
        'Security best practices',
        'Testing & Debugging'
      ],
      skills: ['Node.js', 'Python', 'Database', 'API', 'Cloud']
    },
    {
      id: 'design',
      name: 'Grafik Dizayn',
      duration: '4 oy',
      price: '800,000 so\'m/oy',
      level: 'Boshlang\'ichdan',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      description: 'Professional dizayn va UI/UX yaratish san\'atini o\'rganing',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      topics: [
        'Adobe Photoshop',
        'Adobe Illustrator',
        'Figma & Sketch',
        'Color theory & Typography',
        'Logo & Brand design',
        'UI/UX principles',
        'Web design trends',
        'Mobile app design',
        'Portfolio creation',
        'Client communication'
      ],
      skills: ['Photoshop', 'Illustrator', 'Figma', 'UI/UX', 'Branding']
    },
    {
      id: 'smm',
      name: 'SMM Marketing',
      duration: '4 oy',
      price: '600,000 so\'m/oy',
      level: 'Boshlang\'ichdan',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      description: 'Ijtimoiy tarmoqlarda marketing strategiyalari',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      topics: [
        'Social media strategy',
        'Content creation',
        'Instagram marketing',
        'Telegram marketing',
        'Facebook advertising',
        'Analytics & metrics',
        'Community management',
        'Influencer marketing',
        'Crisis management',
        'Personal branding'
      ],
      skills: ['Content Strategy', 'Analytics', 'Advertising', 'Community', 'Branding']
    },
    {
      id: 'videography',
      name: 'Mobilografiya',
      duration: '4 oy',
      price: '700,000 so\'m/oy',
      level: 'Boshlang\'ichdan',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      description: 'Professional video montaj va mobilografiya san\'ati',
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-indigo-50',
      topics: [
        'Mobile photography basics',
        'Video editing (CapCut, VN)',
        'Color grading',
        'Sound design',
        'Storytelling techniques',
        'YouTube optimization',
        'TikTok content creation',
        'Drone photography basics',
        'Portfolio building',
        'Client projects'
      ],
      skills: ['Photography', 'Video Editing', 'Color Grading', 'Storytelling', 'YouTube']
    },
    {
      id: 'cybersecurity',
      name: 'Kiber Xavfsizlik',
      duration: '11 oy',
      price: '1,500,000 so\'m/oy',
      level: 'O\'rta',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      description: 'Raqamli dunyo xavfsizligi va etik xakerlik',
      color: 'from-red-500 to-rose-500',
      bgColor: 'bg-red-50',
      topics: [
        'Network security fundamentals',
        'Ethical hacking',
        'Penetration testing',
        'Cryptography',
        'Security protocols',
        'Incident response',
        'Compliance & regulations',
        'Security tools & software',
        'Risk assessment',
        'Security auditing'
      ],
      skills: ['Network Security', 'Ethical Hacking', 'Penetration Testing', 'Cryptography', 'Risk Assessment']
    }
  ];

  const stats = [
    { number: '500+', label: 'Bitiruvchilar', icon: '🎓' },
    { number: '6', label: 'Yo\'nalishlar', icon: '📚' },
    { number: '4+', label: 'Yillik tajriba', icon: '⭐' },
    { number: '95%', label: 'Ishga joylashish', icon: '💼' }
  ];

  const testimonials = [
    {
      name: 'Alijon Karimov',
      role: 'Frontend Developer',
      company: 'IT Park Tashkent',
      image: 'A',
      text: 'InFast Academy meni noldan professional dasturchiga aylantirdi. 9 oylik kursdan so\'ng Toshkentdagi yirik kompaniyada ish topdim.',
      rating: 5
    },
    {
      name: 'Dilnoza Rahimova',
      role: 'UI/UX Designer',
      company: 'Freelancer',
      image: 'D',
      text: 'Grafik dizayn kursi juda foydali bo\'ldi. Hozir mustaqil dizayner sifatida ishlayapman va oyiga 1000$ dan ortiq daromad qilaman.',
      rating: 5
    },
    {
      name: 'Bobur Toshov',
      role: 'Backend Developer',
      company: 'Udevs',
      image: 'B',
      text: 'Backend kursida Node.js va Python ni chuqur o\'rgandim. Ustozlar juda professional va har doim yordam berishga tayyor.',
      rating: 5
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
          text: `🎓 *Yangi kursga yozilish!*\n\n👤 *Ism:* ${registrationData.name}\n📱 *Telefon:* ${registrationData.phone}\n🎯 *Kurs:* ${courses.find(c => c.id === registrationData.course)?.name}\n💼 *Tajriba:* ${registrationData.experience}\n\n⏰ *Vaqt:* ${new Date().toLocaleString('uz-UZ')}`,
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
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-white/20">
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
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/courses" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Kurslar</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Biz haqimizda</Link>
              <Link to="/team" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">O'qituvchilar</Link>
              <Link to="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Blog</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Aloqa</Link>
            </nav>

            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="hidden sm:inline-flex px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Admin
              </Link>
              <Link
                to="/student-login"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Kirish
              </Link>

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
              <nav className="flex flex-col space-y-3">
                <Link to="/courses" className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Kurslar</Link>
                <Link to="/about" className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Biz haqimizda</Link>
                <Link to="/team" className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2" onClick={() => setIsMenuOpen(false)}>O'qituvchilar</Link>
                <Link to="/blog" className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Blog</Link>
                <Link to="/contact" className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Aloqa</Link>
                <Link
                  to="/login"
                  className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Login
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

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
              <Link to="/register" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <span>Bepul konsultatsiya</span>
              </Link>
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
                    EP
                  </div>
                  <span className="font-medium">EPAM</span>
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
                  {stat.number}
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
              Sizga mos keladigan yo'nalishni tanlang va professional bo'ling
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
                  <div className={`w-16 h-16 bg-gradient-to-r ${course.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    {course.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>Amaliy</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    to="/courses"
                    className="inline-flex items-center gap-2 text-primary-600 font-semibold group-hover:gap-3 transition-all"
                  >
                    <span>Batafsil ma'lumot</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link to="/courses" className="btn-primary inline-flex items-center gap-2 px-8 py-4">
              <span>Barcha kurslarni ko'rish</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
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
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.text}"</p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.image}
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

      {/* About Section */}
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

      {/* Contact Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Biz bilan bog'laning</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Savollaringiz bormi? Biz sizga yordam beramiz! Tez orada javob beramiz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Manzil</h3>
              <p className="text-gray-300 leading-relaxed">
                Buloqboshi tumani<br />
                Yangi hokimiyat binosi<br />
                2-qavat, 201-xona
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Telefon</h3>
              <p className="text-gray-300 leading-relaxed">
                <a href="tel:+998937435225" className="hover:text-blue-400 transition-colors">+998 93 743 52 25</a><br />
                <a href="tel:+998902570100" className="hover:text-blue-400 transition-colors">+998 90 257 01 00</a>
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Email</h3>
              <p className="text-gray-300 leading-relaxed">
                <a href="mailto:info@infast-academy.uz" className="hover:text-blue-400 transition-colors">
                  info@infast-academy.uz
                </a>
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => setShowRegistrationModal(true)}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-blue-500/25"
            >
              <MessageCircle className="h-6 w-6 mr-3" />
              Hoziroq kursga yozilish
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl mr-3">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">InFast Academy</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Zamonaviy IT ta'limi bilan kelajagingizni yarating. Professional mentorlar
                bilan real loyihalarda tajriba orttiring.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Sahifalar</h4>
              <ul className="space-y-2">
                <li><Link to="/courses" className="text-gray-400 hover:text-white transition-colors">Kurslar</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Biz haqimizda</Link></li>
                <li><Link to="/team" className="text-gray-400 hover:text-white transition-colors">O'qituvchilar</Link></li>
                <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Aloqa</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Kurslar</h4>
              <ul className="space-y-2">
                <li><Link to="/courses" className="text-gray-400 hover:text-white transition-colors">Frontend Development</Link></li>
                <li><Link to="/courses" className="text-gray-400 hover:text-white transition-colors">Backend Development</Link></li>
                <li><Link to="/courses" className="text-gray-400 hover:text-white transition-colors">Cyber Security</Link></li>
                <li><Link to="/courses" className="text-gray-400 hover:text-white transition-colors">SMM Marketing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Aloqa</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  Buloqboshi tumani
                </li>
                <li className="flex items-center text-gray-400">
                  <Phone className="h-4 w-4 mr-2" />
                  +998 93 743 52 25
                </li>
                <li className="flex items-center text-gray-400">
                  <Mail className="h-4 w-4 mr-2" />
                  info@infast-academy.uz
                </li>
              </ul>
              <div className="mt-4">
                <h5 className="text-sm font-semibold mb-2 text-gray-300">Ijtimoiy tarmoqlar</h5>
                <div className="flex space-x-3">
                  <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors text-sm">
                    💬
                  </a>
                  <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors text-sm">
                    📸
                  </a>
                  <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors text-sm">
                    📘
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 mb-4">
              © 2024 InFast IT-Academy. Barcha huquqlar himoyalangan.
            </p>
            <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Maxfiylik siyosati</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Foydalanish shartlari</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Biz bilan bog'lanish</a>
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