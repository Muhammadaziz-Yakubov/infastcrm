import { motion } from 'framer-motion';
import { Facebook, Instagram, Youtube, MessageCircle, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const footerLinks = {
    academy: [
      { name: 'Biz haqimizda', href: '#about' },
      { name: 'Kurslar', href: '#courses' },
      { name: 'Ustozlar', href: '#teachers' },
      { name: 'Natijalar', href: '#statistics' }
    ],
    courses: [
      { name: 'Frontend Development', href: '#courses' },
      { name: 'Backend Development', href: '#courses' },
      { name: 'Python & AI', href: '#courses' },
      { name: 'Startup & Freelance', href: '#courses' }
    ],
    support: [
      { name: 'Bog\'lanish', href: '#contact' },
      { name: 'FAQ', href: '#' },
      { name: 'Qaytarish siyosati', href: '#' },
      { name: 'Shartnoma', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#', name: 'Facebook' },
    { icon: <Instagram className="w-5 h-5" />, href: '#', name: 'Instagram' },
    { icon: <Youtube className="w-5 h-5" />, href: '#', name: 'YouTube' },
    { icon: <MessageCircle className="w-5 h-5" />, href: '#', name: 'Telegram' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <span className="text-xl font-bold">InFast</span>
              <span className="text-xl font-light text-gray-300">IT-Academy</span>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              InFast IT-Academy — 2025 yilning eng zo'r IT markazi! 2025 yil 26 mayda Andijon viloyati Buloqboshi tumani yangi Hokimiyat binosi yonida ochilgan. Zamonaviy texnologiyalar, professional ustozlar va karyera imkoniyatlari.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-3 text-orange-500" />
                <span className="text-sm">+998 90 271 00 27</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-3 text-orange-500" />
                <span className="text-sm">info@infast.uz</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-3 text-orange-500" />
                <span className="text-sm">Andijon viloyati, Buloqboshi tumani, yangi Hokimiyat binosi</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3 mt-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:bg-orange-500 hover:text-white transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Academy Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6">Akademiya</h3>
            <ul className="space-y-3">
              {footerLinks.academy.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Courses Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6">Kurslar</h3>
            <ul className="space-y-3">
              {footerLinks.courses.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6">Yordam</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-orange-500 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 p-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl text-center"
        >
          <h3 className="text-2xl font-bold mb-4">
            IT kelajagini bugun boshlang!
          </h3>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Professional IT ta'limi bilan o'z orzuingizdagi kasbni egallang. 
            Biz sizning muvaffaqiyatingiz uchun shu yerdamiz.
          </p>
          <motion.a
            href="#contact"
            className="inline-flex items-center px-8 py-3 bg-white text-orange-600 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Bepul konsultatsiya
          </motion.a>
        </motion.div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-gray-400 text-sm mb-4 md:mb-0"
            >
              © 2024 InFast IT-Academy. Barcha huquqlar himoyalangan.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-6 text-gray-400 text-sm"
            >
              <a href="#" className="hover:text-orange-500 transition-colors duration-200">
                Maxfiylik siyosati
              </a>
              <a href="#" className="hover:text-orange-500 transition-colors duration-200">
                Foydalanish shartlari
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
};

export default Footer;
