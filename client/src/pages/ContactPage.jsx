import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Telefon',
      details: ['+998 93 743 52 25', '+998 90 257 01 00'],
      description: 'Dushanbadan Shanbagacha, 9:00 - 18:00'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@infast-academy.uz', 'support@infast-academy.uz'],
      description: '24/7 javob beramiz'
    },
    {
      icon: MapPin,
      title: 'Manzil',
      details: ['Buloqboshi tumani', 'Yangi hokimiyat binosi', '2-qavat, 201-xona'],
      description: 'Ochiq: Dushanbadan Shanbagacha'
    },
    {
      icon: MessageCircle,
      title: 'Telegram',
      details: ['@infast_academy', '@infast_support'],
      description: 'Tezkor murojaat uchun'
    }
  ];

  const faqs = [
    {
      question: 'Kurslar qancha davom etadi?',
      answer: 'Kurslar davomiyligi 4 oydan 11 oygacha. Frontend - 9 oy, Backend - 6 oy, Cyber Security - 11 oy, qolgan kurslar 4 oy davom etadi.'
    },
    {
      question: 'Kurslar qaysi tillarda o\'tiladi?',
      answer: 'Barcha kurslar o\'zbek tilida o\'tiladi. Lekin dars materiallari va kod namunalari ingliz tilida bo\'ladi.'
    },
    {
      question: 'To\'lov qanday amalga oshiriladi?',
      answer: 'To\'lov naqd pul yoki bank o\'tkazmasi orqali amalga oshiriladi. Bo\'lib-bo\'lib to\'lash imkoni mavjud.'
    },
    {
      question: 'Kurs tugagach sertifikat beriladimi?',
      answer: 'Ha, kursni muvaffaqiyatli tugatgan barcha o\'quvchilarga xalqaro tan olingan sertifikat beriladi.'
    },
    {
      question: 'Kurslar online yoki offline o\'tiladimi?',
      answer: 'Kurslar asosan offline (kelib o\'qish) tarzda o\'tiladi. Lekin ba\'zi kurslar uchun online imkoniyat ham mavjud.'
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
              <h1 className="text-2xl font-bold text-gray-900">Aloqa</h1>
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
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Biz bilan <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">bog'laning</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Savollaringiz bormi? Biz sizga yordam berishdan xursandmiz. Istalgan vaqtda murojaat qiling,
            tez orada javob beramiz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Xabar yuborish</h2>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-green-800 font-medium">Xabar muvaffaqiyatli yuborildi! Tez orada javob beramiz.</span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                <span className="text-red-800 font-medium">Xatolik yuz berdi. Qayta urinib ko'ring.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ism *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Ismingizni kiriting"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="+998 XX XXX XX XX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mavzu *
                </label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">Mavzuni tanlang</option>
                  <option value="course-info">Kurslar haqida ma'lumot</option>
                  <option value="enrollment">Kursga yozilish</option>
                  <option value="pricing">Narxlar</option>
                  <option value="schedule">Dars jadvali</option>
                  <option value="other">Boshqa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xabar *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Savolingizni yozing..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Yuborilmoqda...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-3" />
                    Xabarni yuborish
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <info.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-700 font-medium mb-1">{detail}</p>
                    ))}
                    <p className="text-gray-500 text-sm mt-2">{info.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 md:p-12 mb-16 text-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ish vaqti</h2>
            <p className="text-xl text-white/90">Biz har doim siz bilan bog'lanishga tayyormiz</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <Clock className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Dars vaqti</h3>
              <p className="text-white/90">Dushanba - Shanba</p>
              <p className="text-white font-semibold">10:00 - 17:00</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <Phone className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Telefon</h3>
              <p className="text-white/90">Dushanba - Shanba</p>
              <p className="text-white font-semibold">9:00 - 18:00</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <MessageCircle className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Online yordam</h3>
              <p className="text-white/90">24/7</p>
              <p className="text-white font-semibold">Telegram orqali</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Tez-tez beriladigan <span className="text-blue-600">savollar</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Bizni topish</h2>
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Xarita bu yerda bo'ladi</p>
              <p className="text-gray-400 text-sm">Buloqboshi tumani, Yangi hokimiyat binosi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}