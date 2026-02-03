import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    const checkToken = () => {
      const currentToken = localStorage.getItem('token');
      setToken(currentToken);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check token periodically
    const interval = setInterval(checkToken, 1000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    navigate('/');
  };

  const handleDashboard = () => {
    navigate('/admin');
  };

  const navItems = [
    { name: 'Asosiy', href: '#home' },
    { name: 'Biz haqimizda', href: '#about' },
    { name: 'Kurslar', href: '#courses' },
    { name: 'Ustozlar', href: '#teachers' },
    { name: 'Aloqa', href: '#contact' }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                InFast
              </span>
              <span className="text-xl font-light text-gray-600 dark:text-gray-300">
                IT-Academy
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200 font-medium"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
              </motion.a>
            ))}
            
            {/* Auth Button */}
            {token ? (
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={handleDashboard}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200 font-medium"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User size={18} />
                  <span>Dashboard</span>
                </motion.button>
                
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200 font-medium"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut size={18} />
                  <span>Chiqish</span>
                </motion.button>
              </div>
            ) : (
              <motion.a
                href="/login"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-full font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogIn size={18} />
                <span>Kirish</span>
              </motion.a>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isOpen ? 1 : 0, 
            height: isOpen ? 'auto' : 0 
          }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-2 bg-white dark:bg-gray-900 rounded-lg mt-2 shadow-lg">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                whileHover={{ x: 10 }}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </motion.a>
            ))}
            
            {token ? (
              <>
                <motion.button
                  onClick={() => {
                    handleDashboard();
                    setIsOpen(false);
                  }}
                  className="mx-4 mt-4 flex items-center justify-center space-x-2 px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User size={18} />
                  <span>Dashboard</span>
                </motion.button>
                
                <motion.button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="mx-4 mt-2 flex items-center justify-center space-x-2 px-6 py-3 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-full font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut size={18} />
                  <span>Chiqish</span>
                </motion.button>
              </>
            ) : (
              <motion.a
                href="/login"
                className="mx-4 mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(false)}
              >
                <LogIn size={18} />
                <span>Kirish</span>
              </motion.a>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
