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
  TrendingUp
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('frontend');

  const courses = [
    {
      id: 'frontend',
      title: 'Frontend Development',
      icon: Code,
      price: '300,000',
      duration: '9 oy',
      description: 'React, Vue, Angular kabi zamonaviy frameworklar',
      features: ['HTML/CSS/JavaScript', 'React & Vue.js', 'Responsive Design', 'Git & GitHub']
    },
    {
      id: 'backend',
      title: 'Backend Development',
      icon: Shield,
      price: '500,000',
      duration: '6 oy',
      description: 'Server-side development va database management',
      features: ['Node.js & Express', 'MongoDB & PostgreSQL', 'REST API', 'Authentication']
    },
    {
      id: 'cyber',
      title: 'Cyber Security',
      icon: Shield,
      price: '1,200,000',
      duration: '11 oy',
      description: 'Kiber xavfsizlik va etik hacking',
      features: ['Network Security', 'Ethical Hacking', 'Penetration Testing', 'Security Tools']
    },
    {
      id: 'smm',
      title: 'SMM (Social Media Marketing)',
      icon: TrendingUp,
      price: '300,000',
      duration: '4 oy',
      description: 'Ijtimoiy tarmoqlarda marketing',
      features: ['Content Creation', 'Social Media Strategy', 'Ads Management', 'Analytics']
    },
    {
      id: 'mobile',
      title: 'Mobilografiya',
      icon: Camera,
      price: '300,000',
      duration: '4 oy',
      description: 'Mobil fotografiya va video',
      features: ['Mobile Photography', 'Video Editing', 'Lighting', 'Composition']
    },
    {
      id: 'graphic',
      title: 'Grafik Dizayn',
      icon: Palette,
      price: '300,000',
      duration: '4 oy',
      description: 'Grafik dizayn va branding',
      features: ['Adobe Suite', 'Logo Design', 'Branding', 'Print Design']
    }
  ];

  const stats = [
    { icon: Users, value: '500+', label: 'Bitiruvchilar' },
    { icon: GraduationCap, value: '6+', label: 'Kurslar' },
    { icon: Award, value: '95%', label: 'Ishga joylashish' },
    { icon: Star, value: '4.8', label: 'Reyting' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">InFast IT-Academy</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Admin Login
              </button>
              <button
                onClick={() => navigate('/student-login')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Student Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Kelajagingizni
            <span className="text-blue-600 block">Biz bilan quring!</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            InFast IT-Academy - zamonaviy texnologiyalar va professional ta'lim bilan sizni IT sohasida muvaffaqiyatli karyeraga tayyorlaymiz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('courses').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
            >
              Kurslarni ko'rish <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate('/student-login')}
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg"
            >
              Ro'yxatdan o'tish
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Bizning Kurslar</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Har bir kurs professional mentorlar tomonidan zamonaviy usullar bilan o'tiladi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6">
                <div className="flex items-center mb-4">
                  <course.icon className="h-10 w-10 text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{course.price} so'm</span>
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <ul className="space-y-2">
                  {course.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Biz bilan bog'laning</h2>
            <p className="text-xl text-gray-300">
              Savollaringiz bormi? Biz sizga yordam beramiz!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Manzil</h3>
              <p className="text-gray-300">
                Buloqboshi tumani<br />
                Yangi hokimiyat binosi
              </p>
            </div>
            <div className="text-center">
              <Phone className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Telefon</h3>
              <p className="text-gray-300">
                +998 93 743 52 25<br />
                +998 90 257 01 00
              </p>
            </div>
            <div className="text-center">
              <Mail className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-300">
                info@infast-academy.uz
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-8 w-8 text-blue-400 mr-2" />
            <span className="text-2xl font-bold">InFast IT-Academy</span>
          </div>
          <p className="text-gray-400 mb-4">
            Kelajagingizni biz bilan quring! © 2024 InFast IT-Academy. Barcha huquqlar himoyalangan.
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Telegram
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Instagram
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Facebook
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}