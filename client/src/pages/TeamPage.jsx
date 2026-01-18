import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageCircle,
  Code,
  Shield,
  Database,
  Palette,
  Camera,
  Award,
  Star,
  Users,
  BookOpen,
  Clock,
  MapPin
} from 'lucide-react';

const mentors = [
  {
    id: 1,
    name: 'Azizbek Tursunov',
    role: 'Senior Full-Stack Developer',
    position: 'Bosh Mentor',
    specialty: 'MERN Stack, React, Node.js',
    experience: '5+ yil',
    rating: 4.9,
    students: 150,
    image: 'AT',
    bio: 'Full-stack development sohasida 5+ yillik tajriba. 150+ o\'quvchi tarbiyalagan. React, Node.js va MongoDB mutaxassisi.',
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'TypeScript'],
    achievements: [
      '100+ loyihani amalga oshirgan',
      'Google Developer Expert',
      'Open source contributor',
      'Tech conference speaker'
    ],
    contact: {
      phone: '+998 XX XXX XX XX',
      email: 'azizbek@infast-academy.uz',
      telegram: '@azizbek_dev'
    },
    courses: ['Frontend Development', 'Backend Development', 'Full-Stack Bootcamp']
  },
  {
    id: 2,
    name: 'Malika Karimova',
    role: 'Frontend Developer',
    position: 'Frontend Mentor',
    specialty: 'React, Vue.js, UI/UX',
    experience: '4+ yil',
    rating: 4.8,
    students: 120,
    image: 'MK',
    bio: 'Frontend development va UI/UX dizayn bo\'yicha mutaxassis. React va Vue.js framework\'larida professional darajada ishlaydi.',
    skills: ['React', 'Vue.js', 'JavaScript', 'CSS', 'Figma', 'Adobe XD'],
    achievements: [
      '50+ web ilova yaratgan',
      'UI/UX Design sertifikatli',
      'Dribbble featured designer',
      'Tech community leader'
    ],
    contact: {
      phone: '+998 XX XXX XX XX',
      email: 'malika@infast-academy.uz',
      telegram: '@malika_design'
    },
    courses: ['Frontend Development', 'UI/UX Design', 'React Advanced']
  },
  {
    id: 3,
    name: 'Rustam Alimov',
    role: 'Backend Developer',
    position: 'Backend Mentor',
    specialty: 'Node.js, Python, DevOps',
    experience: '6+ yil',
    rating: 5.0,
    students: 90,
    image: 'RA',
    bio: 'Backend development va DevOps bo\'yicha tajribali mutaxassis. Katta miqyosdagi tizimlarni ishlab chiqqan.',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS', 'Linux'],
    achievements: [
      'Enterprise level apps yaratgan',
      'AWS Certified Developer',
      'Open source maintainer',
      'Tech blog writer'
    ],
    contact: {
      phone: '+998 XX XXX XX XX',
      email: 'rustam@infast-academy.uz',
      telegram: '@rustam_dev'
    },
    courses: ['Backend Development', 'Python Programming', 'DevOps Basics']
  },
  {
    id: 4,
    name: 'Nodira Sobirova',
    role: 'UI/UX Designer',
    position: 'Design Mentor',
    specialty: 'Figma, Adobe Suite, Branding',
    experience: '3+ yil',
    rating: 4.7,
    students: 85,
    image: 'NS',
    bio: 'Grafik dizayn va UI/UX bo\'yicha professional. Adobe Suite va Figma mutaxassisi. Ko\'plab brand\'lar uchun ishlagan.',
    skills: ['Figma', 'Photoshop', 'Illustrator', 'InDesign', 'After Effects', 'Principle'],
    achievements: [
      '20+ brand identity yaratgan',
      'Adobe Certified Expert',
      'Behance featured artist',
      'Design conference speaker'
    ],
    contact: {
      phone: '+998 XX XXX XX XX',
      email: 'nodira@infast-academy.uz',
      telegram: '@nodira_design'
    },
    courses: ['Grafik Dizayn', 'UI/UX Design', 'Brand Identity']
  },
  {
    id: 5,
    name: 'Jasurbek Rahimov',
    role: 'Cyber Security Specialist',
    position: 'Cyber Security Mentor',
    specialty: 'Ethical Hacking, Penetration Testing',
    experience: '4+ yil',
    rating: 4.9,
    students: 60,
    image: 'JR',
    bio: 'Kiber xavfsizlik bo\'yicha CEH sertifikatli mutaxassis. Penetration testing va ethical hacking sohasida tajribali.',
    skills: ['Kali Linux', 'Metasploit', 'Wireshark', 'Burp Suite', 'OWASP', 'Python'],
    achievements: [
      'Certified Ethical Hacker (CEH)',
      'Security research publications',
      'Bug bounty hunter',
      'Security consultant'
    ],
    contact: {
      phone: '+998 XX XXX XX XX',
      email: 'jasur@infast-academy.uz',
      telegram: '@jasur_security'
    },
    courses: ['Cyber Security', 'Ethical Hacking', 'Network Security']
  },
  {
    id: 6,
    name: 'Dilnoza Umarova',
    role: 'SMM Specialist',
    position: 'Digital Marketing Mentor',
    specialty: 'Social Media Marketing, Content Creation',
    experience: '3+ yil',
    rating: 4.6,
    students: 95,
    image: 'DU',
    bio: 'SMM va digital marketing bo\'yicha mutaxassis. Ko\'plab brand\'lar uchun social media strategiyasi ishlab chiqqan.',
    skills: ['Facebook Ads', 'Instagram Marketing', 'TikTok', 'Content Strategy', 'Analytics', 'Canva'],
    achievements: [
      '1M+ reach ga erishgan',
      'Meta Certified',
      'Content creator',
      'Marketing consultant'
    ],
    contact: {
      phone: '+998 XX XXX XX XX',
      email: 'dilnoza@infast-academy.uz',
      telegram: '@dilnoza_smm'
    },
    courses: ['SMM Marketing', 'Digital Marketing', 'Content Creation']
  }
];

export default function TeamPage() {
  const navigate = useNavigate();
  const [selectedMentor, setSelectedMentor] = useState(null);

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
              <h1 className="text-2xl font-bold text-gray-900">O'qituvchilar Jamoasi</h1>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {selectedMentor ? (
          // Mentor Detail View
          <div className="space-y-8">
            <button
              onClick={() => setSelectedMentor(null)}
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Jamoaga qaytish
            </button>

            {(() => {
              const mentor = mentors.find(m => m.id === selectedMentor);
              if (!mentor) return null;

              return (
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-48 relative">
                    <div className="absolute -bottom-16 left-8">
                      <div className="w-32 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center text-4xl font-bold text-gray-700">
                        {mentor.image}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-20 px-8 pb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Main Info */}
                      <div className="lg:col-span-2 space-y-6">
                        <div>
                          <h1 className="text-3xl font-bold text-gray-900 mb-2">{mentor.name}</h1>
                          <p className="text-xl text-blue-600 font-medium mb-2">{mentor.position}</p>
                          <p className="text-lg text-gray-600 mb-4">{mentor.role}</p>
                          <p className="text-gray-700 leading-relaxed">{mentor.bio}</p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">{mentor.experience}</div>
                            <div className="text-sm text-gray-600">Tajriba</div>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">{mentor.rating}</div>
                            <div className="text-sm text-gray-600">Reyting</div>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">{mentor.students}+</div>
                            <div className="text-sm text-gray-600">O'quvchi</div>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-orange-600">{mentor.courses.length}</div>
                            <div className="text-sm text-gray-600">Kurs</div>
                          </div>
                        </div>

                        {/* Skills */}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Ko'nikmalar</h3>
                          <div className="flex flex-wrap gap-2">
                            {mentor.skills.map((skill, index) => (
                              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Courses */}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">O'tiladigan Kurslar</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {mentor.courses.map((course, index) => (
                              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-xl">
                                <BookOpen className="h-5 w-5 text-blue-600 mr-3" />
                                <span className="text-gray-700 font-medium">{course}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Sidebar */}
                      <div className="space-y-6">
                        {/* Contact */}
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-4">Aloqa</h3>
                          <div className="space-y-3">
                            <a href={`tel:${mentor.contact.phone}`} className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                              <Phone className="h-5 w-5 mr-3" />
                              <span>{mentor.contact.phone}</span>
                            </a>
                            <a href={`mailto:${mentor.contact.email}`} className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                              <Mail className="h-5 w-5 mr-3" />
                              <span>{mentor.contact.email}</span>
                            </a>
                            <a href={`https://t.me/${mentor.contact.telegram.slice(1)}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                              <MessageCircle className="h-5 w-5 mr-3" />
                              <span>{mentor.contact.telegram}</span>
                            </a>
                          </div>
                        </div>

                        {/* Achievements */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                          <h3 className="text-lg font-bold text-gray-900 mb-4">Yutuqlar</h3>
                          <div className="space-y-3">
                            {mentor.achievements.map((achievement, index) => (
                              <div key={index} className="flex items-start">
                                <Award className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700 text-sm">{achievement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          // Team Grid View
          <div className="space-y-12">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Bizning <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Jamoamiz</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Tajribali mentorlar va professional o'qituvchilar jamoasi sizning muvaffaqiyatingiz uchun
                harakat qiladi. Har bir mentor o'z sohasida yetakchi mutaxassis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mentors.map((mentor) => (
                <div key={mentor.id} className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 group hover:-translate-y-2">
                  {/* Avatar */}
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold shadow-lg">
                      {mentor.image}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{mentor.name}</h3>
                    <p className="text-blue-600 font-medium mb-2">{mentor.position}</p>
                    <p className="text-gray-600 text-sm">{mentor.role}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{mentor.experience}</div>
                      <div className="text-xs text-gray-500">Tajriba</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{mentor.rating}</div>
                      <div className="text-xs text-gray-500">Reyting</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{mentor.students}</div>
                      <div className="text-xs text-gray-500">O'quvchi</div>
                    </div>
                  </div>

                  {/* Specialty */}
                  <div className="mb-6">
                    <p className="text-gray-700 text-center font-medium">{mentor.specialty}</p>
                  </div>

                  {/* Skills */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {mentor.skills.slice(0, 4).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                      {mentor.skills.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          +{mentor.skills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => setSelectedMentor(mentor.id)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                  >
                    Batafsil ko'rish
                  </button>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-12 text-white text-center">
              <h2 className="text-4xl font-bold mb-4">O'z mentoringizni toping!</h2>
              <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
                Har bir mentor o'z sohasida yetakchi mutaxassis. Sizning qiziqishlaringizga mos mentorni tanlang
                va professional rivojlanishingizni boshlang.
              </p>
              <button
                onClick={() => navigate('/courses')}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
              >
                Kurslarni ko'rish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}