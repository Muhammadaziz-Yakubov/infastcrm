import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Users,
  Star,
  CheckCircle,
  Code,
  Shield,
  Smartphone,
  Palette,
  Camera,
  TrendingUp,
  Award,
  BookOpen,
  Target
} from 'lucide-react';

const courses = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    icon: Code,
    price: '300,000',
    duration: '9 oy',
    level: 'Boshlang\'ichdan Professional',
    students: 45,
    rating: 4.9,
    description: 'React, Vue, Angular kabi zamonaviy frameworklar bilan zamonaviy web ilovalar yaratishni o\'rganing.',
    features: [
      'HTML5, CSS3, JavaScript ES6+',
      'React.js va Redux state management',
      'Vue.js va Nuxt.js framework',
      'Angular framework asoslari',
      'Responsive design va CSS Grid/Flexbox',
      'Git version control tizimi',
      'REST API bilan ishlash',
      'Real loyihalar ustida ishlash'
    ],
    curriculum: [
      { week: '1-2', title: 'HTML & CSS Asoslari', topics: ['HTML5 semantikasi', 'CSS3 animatsiyalar', 'Responsive design'] },
      { week: '3-4', title: 'JavaScript Asoslari', topics: ['ES6+ features', 'DOM manipulation', 'Async programming'] },
      { week: '5-7', title: 'React Framework', topics: ['Components & Props', 'State & Lifecycle', 'Hooks & Context'] },
      { week: '8-9', title: 'Advanced Topics', topics: ['Testing', 'Performance optimization', 'Deployment'] }
    ],
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'backend',
    title: 'Backend Development',
    icon: Shield,
    price: '500,000',
    duration: '6 oy',
    level: 'Boshlang\'ichdan Advanced',
    students: 32,
    rating: 4.8,
    description: 'Server-side development, database management va API development bo\'yicha to\'liq bilim.',
    features: [
      'Node.js va Express.js framework',
      'MongoDB va PostgreSQL databases',
      'RESTful API design',
      'Authentication & Authorization',
      'JWT tokens va session management',
      'File upload va cloud storage',
      'Testing va debugging',
      'Deployment va DevOps asoslari'
    ],
    curriculum: [
      { week: '1-2', title: 'Backend Asoslari', topics: ['Node.js fundamentals', 'Express.js setup', 'Middleware'] },
      { week: '3-4', title: 'Database Integration', topics: ['MongoDB CRUD', 'PostgreSQL', 'ORM tools'] },
      { week: '5-6', title: 'Advanced Backend', topics: ['Security', 'Caching', 'Microservices intro'] }
    ],
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50'
  },
  {
    id: 'cyber',
    title: 'Cyber Security',
    icon: Shield,
    price: '1,200,000',
    duration: '11 oy',
    level: 'Professional Level',
    students: 18,
    rating: 5.0,
    description: 'Kiber xavfsizlik, penetration testing va etik hacking bo\'yicha chuqur bilim.',
    features: [
      'Network security fundamentals',
      'Ethical hacking methodologies',
      'Penetration testing tools (Kali Linux)',
      'Web application security',
      'Cryptography va encryption',
      'Incident response',
      'Security auditing',
      'Certifications preparation'
    ],
    curriculum: [
      { week: '1-3', title: 'Security Fundamentals', topics: ['Network basics', 'Security concepts', 'Tools introduction'] },
      { week: '4-6', title: 'Ethical Hacking', topics: ['Reconnaissance', 'Scanning', 'Exploitation techniques'] },
      { week: '7-9', title: 'Advanced Security', topics: ['Web security', 'Mobile security', 'Cloud security'] },
      { week: '10-11', title: 'Professional Skills', topics: ['Reporting', 'Certifications', 'Career guidance'] }
    ],
    color: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50'
  },
  {
    id: 'smm',
    title: 'SMM (Social Media Marketing)',
    icon: TrendingUp,
    price: '300,000',
    duration: '4 oy',
    level: 'Boshlang\'ichdan Intermediate',
    students: 67,
    rating: 4.7,
    description: 'Ijtimoiy tarmoqlarda marketing strategiyalari va content yaratish.',
    features: [
      'Social media strategiyasi',
      'Content creation va design',
      'Ads management (Facebook, Instagram)',
      'Analytics va reporting',
      'Influencer marketing',
      'Community management',
      'Crisis management',
      'Tools va automation'
    ],
    curriculum: [
      { week: '1', title: 'SMM Asoslari', topics: ['Platform overview', 'Content strategy', 'Audience analysis'] },
      { week: '2', title: 'Content Creation', topics: ['Visual content', 'Copywriting', 'Video content'] },
      { week: '3', title: 'Ads & Analytics', topics: ['Facebook Ads', 'Instagram Ads', 'Google Analytics'] },
      { week: '4', title: 'Advanced SMM', topics: ['Influencer marketing', 'Crisis management', 'ROI measurement'] }
    ],
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'mobile',
    title: 'Mobilografiya',
    icon: Camera,
    price: '300,000',
    duration: '4 oy',
    level: 'Boshlang\'ichdan Professional',
    students: 28,
    rating: 4.6,
    description: 'Mobil fotografiya va video content yaratish bo\'yicha professional bilim.',
    features: [
      'Mobile photography techniques',
      'Lighting va composition',
      'Video recording va editing',
      'Social media content creation',
      'Brand photography',
      'Product photography',
      'Post-processing',
      'Client management'
    ],
    curriculum: [
      { week: '1', title: 'Photography Basics', topics: ['Camera settings', 'Composition rules', 'Lighting basics'] },
      { week: '2', title: 'Mobile Techniques', topics: ['Phone camera features', 'Apps usage', 'Stabilization'] },
      { week: '3', title: 'Content Creation', topics: ['Social media content', 'Brand shoots', 'Product photography'] },
      { week: '4', title: 'Post-Production', topics: ['Editing apps', 'Color grading', 'Publishing'] }
    ],
    color: 'from-orange-500 to-yellow-500',
    bgColor: 'bg-orange-50'
  },
  {
    id: 'graphic',
    title: 'Grafik Dizayn',
    icon: Palette,
    price: '300,000',
    duration: '4 oy',
    level: 'Boshlang\'ichdan Professional',
    students: 41,
    rating: 4.8,
    description: 'Adobe Creative Suite va grafik dizayn bo\'yicha to\'liq bilim.',
    features: [
      'Adobe Photoshop masterclass',
      'Adobe Illustrator skills',
      'Logo va brand identity design',
      'Print design (brochures, posters)',
      'UI/UX design basics',
      'Typography va color theory',
      'Client presentation skills',
      'Portfolio development'
    ],
    curriculum: [
      { week: '1', title: 'Design Fundamentals', topics: ['Color theory', 'Typography', 'Composition'] },
      { week: '2', title: 'Adobe Photoshop', topics: ['Interface', 'Tools', 'Photo editing', 'Digital art'] },
      { week: '3', title: 'Adobe Illustrator', topics: ['Vector graphics', 'Logo design', 'Illustrations'] },
      { week: '4', title: 'Professional Projects', topics: ['Brand identity', 'Print materials', 'Portfolio'] }
    ],
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50'
  }
];

export default function CoursesPage() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleEnroll = (courseId) => {
    navigate('/', { state: { selectedCourse: courseId, showRegistration: true } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Kurslar</h1>
            </div>
            <button
              onClick={() => navigate('/student-login')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Kirish
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedCourse ? (
          // Course Detail View
          <div className="space-y-8">
            <button
              onClick={() => setSelectedCourse(null)}
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Kurslarga qaytish
            </button>

            {(() => {
              const course = courses.find(c => c.id === selectedCourse);
              if (!course) return null;

              return (
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                  {/* Course Header */}
                  <div className={`relative h-64 bg-gradient-to-r ${course.color} p-8`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-4 bg-white/10 backdrop-blur-sm rounded-2xl`}>
                          <course.icon className="h-12 w-12 text-white" />
                        </div>
                        <div>
                          <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
                          <div className="flex items-center space-x-4 text-white/80">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{course.students} talaba</span>
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 mr-1 fill-current" />
                              <span>{course.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-white mb-2">{course.price}</div>
                        <div className="text-white/80">so'm</div>
                      </div>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-8">
                    {/* Tabs */}
                    <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-xl">
                      {[
                        { id: 'overview', label: 'Umumiy ma\'lumot' },
                        { id: 'curriculum', label: 'O\'quv reja' },
                        { id: 'features', label: 'Imkoniyatlar' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                            activeTab === tab.id
                              ? 'bg-white text-blue-600 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">Kurs haqida</h3>
                          <p className="text-gray-600 leading-relaxed text-lg">{course.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className={`p-6 rounded-2xl ${course.bgColor} border border-gray-100`}>
                            <Target className="h-8 w-8 text-blue-600 mb-3" />
                            <h4 className="font-bold text-gray-900 mb-2">Daraja</h4>
                            <p className="text-gray-600">{course.level}</p>
                          </div>
                          <div className={`p-6 rounded-2xl ${course.bgColor} border border-gray-100`}>
                            <Clock className="h-8 w-8 text-green-600 mb-3" />
                            <h4 className="font-bold text-gray-900 mb-2">Davomiyligi</h4>
                            <p className="text-gray-600">{course.duration}</p>
                          </div>
                          <div className={`p-6 rounded-2xl ${course.bgColor} border border-gray-100`}>
                            <Award className="h-8 w-8 text-purple-600 mb-3" />
                            <h4 className="font-bold text-gray-900 mb-2">Sertifikat</h4>
                            <p className="text-gray-600">Xalqaro tan olingan</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'curriculum' && (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900">O'quv reja</h3>
                        {course.curriculum.map((week, index) => (
                          <div key={index} className="border border-gray-200 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-bold text-gray-900">{week.week}-hafta: {week.title}</h4>
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {week.week}
                              </span>
                            </div>
                            <ul className="space-y-2">
                              {week.topics.map((topic, topicIndex) => (
                                <li key={topicIndex} className="flex items-center text-gray-600">
                                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'features' && (
                      <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900">Kurs imkoniyatlari</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {course.features.map((feature, index) => (
                            <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                              <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
                              <span className="text-gray-700 font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Enroll Button */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                      <button
                        onClick={() => handleEnroll(course.id)}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
                      >
                        Kursga yozilish - {course.price} so'm
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          // Courses Grid View
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Bizning <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Kurslar</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Har bir kurs professional mentorlar tomonidan zamonaviy usullar bilan o'tiladi.
                O'zingizga mos kursni toping va karyerangizni boshlang!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div key={course.id} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 group-hover:-translate-y-2 border border-white/50">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-4 bg-gradient-to-r ${course.color} rounded-2xl shadow-lg`}>
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
                      <p className="text-gray-600 mb-4 leading-relaxed">{course.description}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{course.students} talaba</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={() => setSelectedCourse(course.id)}
                        className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-semibold"
                      >
                        Batafsil ko'rish
                      </button>
                      <button
                        onClick={() => handleEnroll(course.id)}
                        className={`w-full py-3 bg-gradient-to-r ${course.color} text-white rounded-xl hover:opacity-90 transition-all font-semibold shadow-lg`}
                      >
                        Kursga yozilish
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}