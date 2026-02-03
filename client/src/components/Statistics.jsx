import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { GraduationCap, Briefcase, Code, Award, TrendingUp, Users } from 'lucide-react';

const Counter = ({ end, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime = null;
      const startCount = 0;
      const endCount = parseInt(end);

      const animate = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(easeOutQuart * (endCount - startCount) + startCount);
        
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const Statistics = () => {
  const stats = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      number: "200",
      suffix: "+",
      label: "O'quvchi",
      description: "Muvaffaqiyatli o'qiyotgan talabalar",
      color: "from-blue-500 to-blue-600",
      delay: 0.1
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      number: "95",
      suffix: "%",
      label: "Ishga joylashgan",
      description: "Kursdan keyin ish topganlar",
      color: "from-green-500 to-green-600",
      delay: 0.2
    },
    {
      icon: <Code className="w-8 h-8" />,
      number: "500",
      suffix: "+",
      label: "Real loyiha",
      description: "O'quvchilar tomonidan yaratilgan",
      color: "from-purple-500 to-purple-600",
      delay: 0.3
    },
    {
      icon: <Award className="w-8 h-8" />,
      number: "20",
      suffix: "+",
      label: "IT kompaniyasi",
      description: "Hamkorlik qiladigan kompaniyalar",
      color: "from-orange-500 to-orange-600",
      delay: 0.4
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      number: "4.9",
      suffix: "",
      label: "O'rtacha reyting",
      description: "O'quvchilar bahosi",
      color: "from-red-500 to-red-600",
      delay: 0.5
    },
    {
      icon: <Users className="w-8 h-8" />,
      number: "8",
      suffix: "+",
      label: "Professional ustoz",
      description: "IT sohasida tajribali mutaxassislar",
      color: "from-indigo-500 to-indigo-600",
      delay: 0.6
    }
  ];

  const achievements = [
    "2025 yilning eng yaxshi IT akademiyasi",
    "200+ dan ortiq muvaffaqiyatli o'quvchi",
    "Andijon viloyatining eng zamonaviy IT markazi",
    "95% ishga joylashish darajasi"
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
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
            Bizning <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Yutuqlarimiz</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Raqamlar bizning sifatimiz va o'quvchilarimizning muvaffaqiyatidan dalolat beradi
          </p>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: stat.delay }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 40px rgba(251, 146, 60, 0.2)"
              }}
              className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-white mb-6`}>
                {stat.icon}
              </div>

              {/* Number */}
              <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                <Counter end={stat.number} duration={2} suffix={stat.suffix} />
              </div>

              {/* Label */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {stat.label}
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Bizning yutuqlarimiz
            </h3>
            <p className="text-orange-100 text-lg">
              InFast IT-Academy sifatida erishgan muhim yutuqlar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <span className="text-lg text-orange-50">{achievement}</span>
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
            Siz ham bizning yutuqlarimiz qatorida bo'lishingiz mumkin!
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            IT sohasida muvaffaqiyatli karyera qurish uchun birinchi qadamni tashlang
          </p>
          <motion.a
            href="#contact"
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:from-orange-600 hover:to-orange-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Hoziroq boshlang
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Statistics;
