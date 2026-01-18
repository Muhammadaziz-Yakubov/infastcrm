import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Target,
  Users,
  Award,
  Heart,
  Lightbulb,
  TrendingUp,
  Shield,
  Star,
  CheckCircle,
  GraduationCap,
  BookOpen,
  Code,
  Briefcase
} from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Target,
      title: 'Sifatli Ta\'lim',
      description: 'Har bir o\'quvchimiz uchun individual yondashuv va eng yuqori sifatli ta\'lim.',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Jamoaviy Ish',
      description: 'Mentorlar va o\'quvchilar o\'rtasida yaqin hamkorlik va qo\'llab-quvvatlash.',
      color: 'text-green-600'
    },
    {
      icon: Award,
      title: 'Muvaffaqiyat',
      description: '95% dan ortiq bitiruvchilarimiz ish topib, karyerasini muvaffaqiyatli boshlaydi.',
      color: 'text-purple-600'
    },
    {
      icon: Heart,
      title: 'E\'tibor',
      description: 'Har bir o\'quvchimizga g\'amxo\'rlik va professional rivojlanish uchun yordam.',
      color: 'text-red-600'
    }
  ];

  const achievements = [
    { number: '500+', label: 'Bitiruvchi', icon: GraduationCap },
    { number: '6+', label: 'Kurs turi', icon: BookOpen },
    { number: '95%', label: 'Ishga joylashish', icon: Briefcase },
    { number: '4.8', label: 'O\'rtacha baho', icon: Star }
  ];

  const team = [
    {
      name: 'Azizbek Tursunov',
      role: 'Bosh Mentor',
      specialty: 'Full-Stack Development',
      experience: '5+ yil',
      image: 'AT'
    },
    {
      name: 'Malika Karimova',
      role: 'Frontend Mentor',
      specialty: 'React & Vue.js',
      experience: '4+ yil',
      image: 'MK'
    },
    {
      name: 'Rustam Alimov',
      role: 'Backend Mentor',
      specialty: 'Node.js & Python',
      experience: '6+ yil',
      image: 'RA'
    },
    {
      name: 'Nodira Sobirova',
      role: 'UI/UX Dizayner',
      specialty: 'Figma & Adobe XD',
      experience: '3+ yil',
      image: 'NS'
    }
  ];

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
              <h1 className="text-2xl font-bold text-gray-900">Biz haqimizda</h1>
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
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              InFast Academy
            </span>
            <br />
            <span className="text-gray-700">haqida</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            2021-yilda tashkil etilgan InFast IT-Academy - bu zamonaviy texnologiyalar va
            professional ta'lim bilan o'quvchilarini IT sohasida muvaffaqiyatli karyeraga
            tayyorlaydigan yetakchi o'quv markazi.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {achievements.map((achievement, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <achievement.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{achievement.number}</div>
              <div className="text-gray-600 font-medium">{achievement.label}</div>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Bizning Maqsadimiz</h3>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">
              O'zbekiston yoshlarini IT sohasida professional mutaxassislar darajasiga olib chiqish,
              ularni dunyo standartlariga mos keladigan bilim va ko'nikmalar bilan ta'minlash.
              Har bir o'quvchimiz uchun karyera yo'lini ochib berish.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                <Lightbulb className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Bizning Qadriyatlarimiz</h3>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">
              Sifatli ta'lim, innovatsion yondashuv, doimiy rivojlanish va o'quvchilarimizga bo'lgan
              g'amxo'rlik - bu bizning asosiy qadriyatlarimiz. Biz har bir o'quvchimiz uchun
              individual yondashuvni ta'minlaymiz.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Bizning <span className="text-blue-600">Qadriyatlarimiz</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${value.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                  <value.icon className={`h-6 w-6 ${value.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 md:p-12 mb-16 text-white">
          <h2 className="text-4xl font-bold text-center mb-8">Nima uchun bizni tanlash kerak?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Zamonaviy Ta'lim</h3>
              <p className="text-white/80 leading-relaxed">
                Eng so'nggi texnologiyalar va industry standartlariga asosan o'qituvchi professional mentorlar.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Amaliy Tajriba</h3>
              <p className="text-white/80 leading-relaxed">
                Real loyihalar ustida ishlash, portfolio yaratish va haqiqiy mijozlar bilan tajriba orttirish.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Karyera Yordami</h3>
              <p className="text-white/80 leading-relaxed">
                Resume yozish, interviewga tayyorgarlik va ish topishda professional yordam.
              </p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Bizning <span className="text-blue-600">Jamoamiz</span>
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Tajribali mentorlar va professional o'qituvchilar jamoasi sizning muvaffaqiyatingiz uchun harakat qiladi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {member.image}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 mb-2">{member.specialty}</p>
                <p className="text-sm text-gray-500">{member.experience} tajriba</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Karyerangizni biz bilan boshlang!</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Hozir ro'yxatdan o'ting va zamonaviy IT ta'limi bilan kelajagingizni yarating.
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors font-bold text-lg shadow-lg hover:shadow-xl"
          >
            Kurslarni ko'rish
          </button>
        </div>
      </div>
    </div>
  );
}