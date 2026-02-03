import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Azizbek Karimov",
      role: "Frontend Developer",
      company: "TechVision",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "InFast IT-Academy mening hayotimni o'zgartirdi. 6 oy ichida men 0 dan professional frontend developerga aylandim. Hozir TechVision kompaniyasida ishlayman va o'z ishimdan mamnunman.",
      course: "Frontend Development",
      delay: 0.1
    },
    {
      name: "Dilnoza Abdullayeva",
      role: "Backend Developer",
      company: "DataFlow",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Kursdan oldin dasturlash haqida hech narsa bilmasdim. Hozir esa DataFlow kompaniyasida backend developer sifatida ishlayman. Ustozlar juda professional va do'stona muhit yaratishgan.",
      course: "Backend Development",
      delay: 0.2
    },
    {
      name: "Javohir Toshmatov",
      role: "AI Engineer",
      company: "AI Solutions",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Python & AI kursi menga sun'iy intellekt olamiga eshiklarni ochdi. Hozir machine learning loyihalari ishlayman va o'z sohamda rivojlanishda davom etaman.",
      course: "Python & AI",
      delay: 0.3
    },
    {
      name: "Munisa Saidova",
      role: "Freelance Developer",
      company: "Mustaqil",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Startup & Freelance kursi meni o'z biznesimni qurishga o'rgatdi. Hozirda mustaqil ishlayman va o'z mijozlarimga xizmat ko'rsataman. Ozodlik va mustaqillik uchun InFastga rahmat!",
      course: "Startup & Freelance",
      delay: 0.4
    },
    {
      name: "Bekzod Rahimov",
      role: "Full Stack Developer",
      company: "Digital Agency",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Ikki kursni tamomlab, men full stack developerga aylandim. Hozir digital agency da ishlayman va har kuni yangi narsalarni o'rganib boryapman. InFast eng yaxshi tanlov!",
      course: "Frontend + Backend",
      delay: 0.5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
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
            O'quvchilarimiz <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Fikrlari</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Bizning bitiruvchilarimizning muvaffaqiyat hikoyalari
          </p>
        </motion.div>

        {/* Testimonial Slider */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-12"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Image */}
                <div className="flex-shrink-0">
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-orange-100 dark:border-orange-900/30"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  {/* Quote Icon */}
                  <div className="flex justify-center md:justify-start mb-4">
                    <Quote className="w-8 h-8 text-orange-500" />
                  </div>

                  {/* Text */}
                  <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                    "{testimonials[currentIndex].text}"
                  </p>

                  {/* Rating */}
                  <div className="flex justify-center md:justify-start mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>

                  {/* Name and Role */}
                  <div className="mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {testimonials[currentIndex].name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {testimonials[currentIndex].role} @ {testimonials[currentIndex].company}
                    </p>
                  </div>

                  {/* Course */}
                  <div className="inline-flex items-center px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium">
                    Kurs: {testimonials[currentIndex].course}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'bg-orange-500 w-8'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Sizning hikoyangiz ham shu yerda bo'lishi mumkin!
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            IT sohasida o'z o'rningizni toping va muvaffaqiyatga erishing
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

export default Testimonials;
