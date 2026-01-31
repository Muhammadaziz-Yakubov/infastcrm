import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Rating() {
  const navigate = useNavigate();

  useEffect(() => {
    // Admin reytingini student reytingiga yo'naltirish
    navigate('/student-rating');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Yo'naltirilmoqda...</p>
      </div>
    </div>
  );
}
