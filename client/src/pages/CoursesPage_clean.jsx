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

export default function Courses() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

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
      skills: ['Veb-dizayn', 'UI/UX', 'JavaScript', 'React', 'TypeScript'],
      certificate: true,
      internship: true,
      jobAssistance: true
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
      skills: ['Node.js', 'Python', 'Database', 'API', 'Cloud'],
      certificate: true,
      internship: true,
      jobAssistance: true
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
      skills: ['Photoshop', 'Illustrator', 'Figma', 'UI/UX', 'Branding'],
      certificate: true,
      internship: false,
      jobAssistance: true
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
      skills: ['Content Strategy', 'Analytics', 'Advertising', 'Community', 'Branding'],
      certificate: true,
      internship: true,
      jobAssistance: true
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
      skills: ['Photography', 'Video Editing', 'Color Grading', 'Storytelling', 'YouTube'],
      certificate: true,
      internship: false,
      jobAssistance: true
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
      skills: ['Network Security', 'Ethical Hacking', 'Penetration Testing', 'Cryptography', 'Risk Assessment'],
      certificate: true,
      internship: true,
      jobAssistance: true
    }
  ];

  const selectedCourseData = courses.find(course => course.id === selectedCourse);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white/90 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-white/20">
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

            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Asosiy</Link>
              <Link to="/courses" className="text-blue-600 font-bold transition-colors">Kurslar</Link>
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
            </div>
          </div>
        </div>
      </div>

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Bizning <span className="gradient-text">Kurslar</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sizga mos keladigan yo'nalishni tanlang va professional bo'ling.
              Har bir kurs amaliy loyihalar va real vazifalarga asoslangan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="card p-8 cursor-pointer hover:scale-105 transition-all duration-300" onClick={() => setSelectedCourse(course.id)}>
                <div className={`w-16 h-16 bg-gradient-to-r ${course.color} rounded-xl flex items-center justify-center text-white mb-6`}>
                  {course.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{course.name}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Davomiyligi:</span>
                    <span className="font-semibold text-primary-600">{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Narxi:</span>
                    <span className="font-semibold text-primary-600">{course.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Daraja:</span>
                    <span className="font-semibold text-primary-600">{course.level}</span>
                  </div>
                </div>
                <button className="w-full btn-primary">
                  Batafsil ma'lumot
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

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
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Asosiy</Link></li>
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
    </div>
  );
}