import { motion } from 'framer-motion';
import { Award, BookOpen, Code, Users, Star, Calendar, MapPin, Target } from 'lucide-react';

const Teachers = () => {
  const teachers = [
    {
      name: "Muhammadaziz Yakubov",
      role: "Full Stack Developer",
      experience: "5+ yil",
      image: "https://ibb.co/20BXfq6j",
      specialties: ["React", "Vue", "TypeScript"],
      rating: 4.9,
      students: 150,
      courses: "Full Stack Development",
      delay: 0.1
    },
  ];

  const achievements = [
    {
      icon: <Award className="w-6 h-6" />,
      title: "Sertifikatlangan",
      description: "Xalqaro sertifikatga ega mutaxassislar"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "500+ o'quvchi",
      description: "Muvaffaqiyatli bitiruvchilar"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Amaliyotga yo'naltirilgan",
      description: "Real loyihalar bilan tajriba"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "4.8+ reyting",
      description: "O'quvchilar tomonidan yuqori baholangan"
    }
  ];

  return (
    <section id="teachers" className="py-20 bg-white dark:bg-gray-900">
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
            Professional <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Ustozlar Jamoasi</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            IT sohasida katta tajribaga ega, o'z ishini sevadigan va sizning muvaffaqiyatingizga intilayotgan mutaxassislar
          </p>
        </motion.div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {teachers.map((teacher, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: teacher.delay }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 40px rgba(251, 146, 60, 0.2)"
              }}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              {/* Teacher Image */}
              <div className="relative h-48 bg-gradient-to-br from-orange-400 to-orange-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold text-gray-800">{teacher.rating}</span>
                  </div>
                </div>
              </div>

              {/* Teacher Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {teacher.name}
                </h3>
                <p className="text-orange-600 dark:text-orange-400 font-medium mb-3">
                  {teacher.role}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    {teacher.experience} tajriba
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4 mr-2" />
                    {teacher.students} o'quvchi
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mutaxassislik:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {teacher.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Course */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Kurs: <span className="font-medium text-gray-900 dark:text-white">{teacher.courses}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Nima uchun bizning ustozlarimiz eng yaxshilardan?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {achievement.icon}
                </div>
                <h4 className="font-semibold text-lg mb-2">{achievement.title}</h4>
                <p className="text-orange-100 text-sm">{achievement.description}</p>
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
            Eng yaxshi ustozlardan o'rganing!
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Professional jamoa sizning IT kareryangizga asos solishga tayyor
          </p>
          <motion.a
            href="#contact"
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:from-orange-600 hover:to-orange-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ustozlar bilan tanishish
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Teachers;
