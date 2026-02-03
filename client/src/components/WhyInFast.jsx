import { motion } from 'framer-motion';
import { Award, Users, Target, Zap, Clock, CheckCircle } from 'lucide-react';

const WhyInFast = () => {
  const features = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Sertifikatlangan ustozlar",
      description: "IT sohasida 5+ yillik tajribaga ega professional mutaxassislar",
      delay: 0.1
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Amaliyotga yo'naltirilgan",
      description: "Nazariy bilimlarni real loyihalar orqali mustahkamlash",
      delay: 0.2
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Kichik guruhlar",
      description: "Har bir o'quvchiga individual yondashuv va qo'llab-quvvatlash",
      delay: 0.3
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Zamonaviy texnologiyalar",
      description: "Eng so'ngi IT texnologiyalari va asboblar bilan tanishish",
      delay: 0.4
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Qulay jadval",
      description: "Ish va o'qish bilan birga keladigan dars jadvallari",
      delay: 0.5
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Ishga joylashish yordami",
      description: "Kursni tugatgandan so'ng karyera markazi orqali ish topish",
      delay: 0.6
    }
  ];

  const stats = [
    { number: "500+", label: "Bitiruvchi" },
    { number: "95%", label: "Ishga joylashgan" },
    { number: "20+", label: "IT kompaniyasi" },
    { number: "4.9", label: "Reyting" }
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Nima uchun <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">InFast</span>?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Biz eng yaxshi IT ta'limini taklif qilamiz, chunki har bir o'quvchining muvaffaqiyati bizning muvaffaqiyatimizdir
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: feature.delay }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 40px rgba(251, 146, 60, 0.2)"
              }}
              className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-orange-100">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Kelajak kasbingizni bugun boshlang!
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Bizning mutaxassislarimiz sizga to'g'ri yo'nalishni tanlashda yordam berishadi
          </p>
          <motion.a
            href="#contact"
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:from-orange-600 hover:to-orange-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Bepul konsultatsiya
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyInFast;
