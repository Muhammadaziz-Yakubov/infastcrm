import { motion } from 'framer-motion';
import { Code, Database, Brain, Rocket, Clock, Users, Star, ArrowRight } from 'lucide-react';

const CoursesPreview = () => {
  const courses = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Frontend Development",
      description: "HTML, CSS, JavaScript, React.js bilan zamonaviy veb-saytlar yaratish",
      duration: "6 oy",
      level: "Boshlang'ich",
      result: "Frontend Developer",
      students: 150,
      rating: 4.9,
      color: "from-blue-500 to-blue-600",
      delay: 0.1
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Backend Development",
      description: "Node.js, MongoDB, Express bilan server tomoni dasturlash",
      duration: "6 oy",
      level: "O'rta",
      result: "Backend Developer",
      students: 120,
      rating: 4.8,
      color: "from-green-500 to-green-600",
      delay: 0.2
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Python & AI",
      description: "Python, Machine Learning, Deep Learning asoslari",
      duration: "8 oy",
      level: "O'rta",
      result: "AI Engineer",
      students: 80,
      rating: 4.9,
      color: "from-purple-500 to-purple-600",
      delay: 0.3
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Startup & Freelance",
      description: "O'z biznesingizni qurish va freelance'da muvaffaqiyat",
      duration: "4 oy",
      level: "Barcha uchun",
      result: "Entrepreneur",
      students: 200,
      rating: 4.7,
      color: "from-orange-500 to-orange-600",
      delay: 0.4
    }
  ];

  return (
    <section id="courses" className="py-20 bg-gray-50 dark:bg-gray-800">
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
            Mashhur <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Kurslar</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            IT sohasidagi eng talab-gir yo'nalishlar bo'yicha professional kurslar
          </p>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: course.delay }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
              }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              {/* Course Header */}
              <div className={`h-2 bg-gradient-to-r ${course.color}`}></div>
              
              <div className="p-6">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${course.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {course.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                  {course.description}
                </p>

                {/* Course Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    {course.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Users className="w-4 h-4 mr-2" />
                    {course.students} o'quvchi
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    {course.rating} rating
                  </div>
                </div>

                {/* Level and Result */}
                <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      DARAJA
                    </span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {course.level}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      NATIJA
                    </span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {course.result}
                    </span>
                  </div>
                </div>

                {/* Button */}
                <motion.button
                  className={`w-full mt-6 py-3 bg-gradient-to-r ${course.color} text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center group`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Batafsil
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 md:p-12 text-white"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            To'g'ri kursni tanlay olmayapsizmi?
          </h3>
          <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
            Bizning mutaxassislarimiz sizning qiziqishlaringiz va maqsadlaringizga mos 
            kursni tanlashda yordam berishadi
          </p>
          <motion.a
            href="#contact"
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-white text-orange-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Bepul maslahat olish
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default CoursesPreview;
