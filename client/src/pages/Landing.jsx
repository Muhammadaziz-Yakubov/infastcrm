import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
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
              <button onClick={() => navigate('/courses')} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Kurslar</button>
              <button onClick={() => navigate('/about')} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Biz haqimizda</button>
              <button onClick={() => navigate('/team')} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">O'qituvchilar</button>
              <button onClick={() => navigate('/blog')} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Blog</button>
              <button onClick={() => navigate('/contact')} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Aloqa</button>
            </nav>

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
              <nav className="flex flex-col space-y-3">
                <button onClick={() => { navigate('/courses'); setIsMenuOpen(false); }} className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">Kurslar</button>
                <button onClick={() => { navigate('/about'); setIsMenuOpen(false); }} className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">Biz haqimizda</button>
                <button onClick={() => { navigate('/team'); setIsMenuOpen(false); }} className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">O'qituvchilar</button>
                <button onClick={() => { navigate('/blog'); setIsMenuOpen(false); }} className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">Blog</button>
                <button onClick={() => { navigate('/contact'); setIsMenuOpen(false); }} className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">Aloqa</button>
                <button
                  onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                  className="text-left text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                >
                  Admin Login
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
            <Zap className="h-4 w-4 mr-2" />
            500+ dan ortiq bitiruvchi muvaffaqiyatga erishdi
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Kelajagingizni
            </span>
            <br />
            <span className="text-gray-900">Biz bilan quring!</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            InFast IT-Academy - zamonaviy texnologiyalar va professional ta'lim bilan sizni
            <span className="font-semibold text-blue-600"> IT sohasida muvaffaqiyatli karyeraga</span> tayyorlaymiz.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => document.getElementById('courses').scrollIntoView({ behavior: 'smooth' })}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-blue-500/25 flex items-center gap-3 hover:scale-105 transform"
            >
              Kurslarni ko'rish
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setShowRegistrationModal(true)}
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 font-bold text-lg hover:scale-105 transform"
            >
              Kursga yozilish
            </button>

            <button
              onClick={() => navigate('/student-login')}
              className="px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transform border border-gray-200"
            >
              Kirish
            </button>
          </div>

          {/* Video Preview */}
          <div className="mt-16 relative">
            <div className="relative mx-auto max-w-4xl">
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group">
                    <Play className="h-8 w-8 text-white ml-1 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm font-medium opacity-80">Bizning akademiyamiz haqida</p>
                  <p className="text-lg font-bold">Video prezentatsiya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bizning <span className="text-blue-600">natijalarimiz</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Minglab o'quvchilarni muvaffaqiyatli karyeraga yo'l oldik
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                    <stat.icon className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Bizning <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Kurslar</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Har bir kurs professional mentorlar tomonidan zamonaviy usullar bilan o'tiladi.
              <span className="font-semibold text-blue-600"> Real loyihalar</span> va
              <span className="font-semibold text-purple-600"> amaliy mashg'ulotlar</span> bilan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 group-hover:-translate-y-2 border border-white/50">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${course.color} shadow-lg`}>
                      <course.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{course.price}</div>
                      <div className="text-sm text-gray-500">so'm</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        <span>Amaliy</span>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{course.description}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {course.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <button
                    onClick={() => {
                      setRegistrationData({...registrationData, course: course.id});
                      setShowRegistrationModal(true);
                    }}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group-hover:scale-105 transform"
                  >
                    Kursga yozilish
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Bitiruvchilarimiz <span className="text-blue-600">sharhlari</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Minglab o'quvchilarimiz muvaffaqiyatga erishdi va o'z karyerasini o'zgartirdi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-blue-600 font-medium">{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Biz haqimizda</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              InFast IT-Academy - bu sizning kelajagingiz uchun sarmoya. Biz nafaqat dasturlashni, balki
              to'g'ri fikrlash, muammo hal qilish va jamoada ishlash ko'nikmalarini ham o'rgatamiz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Zamonaviy Ta'lim</h3>
              <p className="text-white/80 leading-relaxed">
                Eng so'nggi texnologiyalar va industry standartlariga asosan o'qituvchi mentorlar
                tomonidan professional ta'lim.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Kichik Guruhlar</h3>
              <p className="text-white/80 leading-relaxed">
                Har bir o'quvchi individual e'tiborga ega. 10-15 kishilik guruhlar mentor bilan
                yaqindan ishlash imkonini beradi.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Sertifikat</h3>
              <p className="text-white/80 leading-relaxed">
                Kursni muvaffaqiyatli tugatgan barcha bitiruvchilarga xalqaro tan olingan sertifikat
                beriladi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
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
                <li><button onClick={() => navigate('/courses')} className="text-gray-400 hover:text-white transition-colors">Kurslar</button></li>
                <li><button onClick={() => navigate('/about')} className="text-gray-400 hover:text-white transition-colors">Biz haqimizda</button></li>
                <li><button onClick={() => navigate('/team')} className="text-gray-400 hover:text-white transition-colors">O'qituvchilar</button></li>
                <li><button onClick={() => navigate('/blog')} className="text-gray-400 hover:text-white transition-colors">Blog</button></li>
                <li><button onClick={() => navigate('/contact')} className="text-gray-400 hover:text-white transition-colors">Aloqa</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Kurslar</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/courses')} className="text-gray-400 hover:text-white transition-colors">Frontend Development</button></li>
                <li><button onClick={() => navigate('/courses')} className="text-gray-400 hover:text-white transition-colors">Backend Development</button></li>
                <li><button onClick={() => navigate('/courses')} className="text-gray-400 hover:text-white transition-colors">Cyber Security</button></li>
                <li><button onClick={() => navigate('/courses')} className="text-gray-400 hover:text-white transition-colors">SMM Marketing</button></li>
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