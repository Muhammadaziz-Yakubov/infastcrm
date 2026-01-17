import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Modal from '../components/Modal';
import { 
  FileText, 
  Clock,
  Calendar,
  Timer,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Eye,
  ArrowRight,
  ArrowLeft,
  ArrowLeft as ArrowLeftIcon,
  TrendingUp,
  Award,
  Target
} from 'lucide-react';

export default function StudentExams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [currentExam, setCurrentExam] = useState(null);
  const [examData, setExamData] = useState(null);
  const [examResult, setExamResult] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [examStarted, setExamStarted] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);

  const getStudentAuthHeaders = () => {
    const token = localStorage.getItem('studentToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const statusColors = {
    'NOT_STARTED': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    'STARTED': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'FINISHED': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'TIME_EXPIRED': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  };

  const statusLabels = {
    'NOT_STARTED': 'Boshlanmagan',
    'STARTED': 'Boshlangan',
    'FINISHED': 'Tugagan',
    'TIME_EXPIRED': 'Vaqt tugagan'
  };

  useEffect(() => {
    fetchExams();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && examStarted) {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerInterval(interval);
    } else {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timeLeft, examStarted]);

  const fetchExams = async () => {
    try {
      console.log('📝 Fetching student exams...');
      const token = localStorage.getItem('studentToken');
      console.log('🔑 Student token exists:', !!token);
      
      const response = await api.get('/student/exams', {
        headers: getStudentAuthHeaders()
      });
      
      console.log('📊 Exams response:', response.data);
      setExams(response.data);
    } catch (error) {
      console.error('❌ Error fetching exams:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const startExam = async (exam) => {
    try {
      const response = await api.post(
        `/student/exams/${exam._id}/start`,
        {},
        { headers: getStudentAuthHeaders() }
      );
      setExamData(response.data.exam);
      setExamResult(response.data.result);
      setCurrentExam(exam);
      setCurrentQuestionIndex(0);
      setAnswers(response.data.result?.answers || []);
      
      // Calculate time left
      const startTime = new Date(response.data.result?.started_at);
      const durationInMs = exam.duration * 60 * 1000;
      const elapsed = Date.now() - startTime.getTime();
      const remaining = Math.max(0, Math.floor((durationInMs - elapsed) / 1000));
      
      setTimeLeft(remaining);
      setExamStarted(true);
      setShowExamModal(true);
    } catch (error) {
      console.error('Error starting exam:', error);
      alert('Imtihonni boshlashda xatolik yuz berdi');
    }
  };

  const viewResult = async (exam) => {
    try {
      const response = await api.get(`/student/exams/${exam._id}/result`, {
        headers: getStudentAuthHeaders()
      });

      setExamData({
        ...response.data.exam,
        questions: response.data.questions || []
      });
      setExamResult(response.data.result);
      setCurrentExam(exam);
      setShowResultModal(true);
    } catch (error) {
      console.error('Error fetching result:', error);
      alert('Natijalarni olishda xatolik yuz berdi');
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    const existingAnswerIndex = newAnswers.findIndex(a => a.question_index === questionIndex);
    
    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex].selected_answer = answerIndex;
    } else {
      newAnswers.push({
        question_index: questionIndex,
        selected_answer: answerIndex
      });
    }
    
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < examData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitExam = async () => {
    try {
      await api.post(
        `/student/exams/${currentExam._id}/submit`,
        { answers },
        { headers: getStudentAuthHeaders() }
      );

      setExamStarted(false);
      setShowExamModal(false);

      await viewResult(currentExam);
      fetchExams();
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Imtihonni topshirishda xatolik yuz berdi');
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentAnswer = (questionIndex) => {
    const answer = answers.find(a => a.question_index === questionIndex);
    return answer ? answer.selected_answer : null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 p-6">
      {/* Header with Back Button */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/student')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-4 transition-all duration-200 group"
        >
          <ArrowLeftIcon size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Orqaga</span>
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <FileText className="text-white" size={24} />
              </div>
              Imtihonlar
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Mavjud imtihonlarni ko'rish va topshirish</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">{exams.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Jami imtihonlar</div>
          </div>
        </div>
      </div>

      {/* Exams List */}
      <div className="grid gap-6">
        {exams.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-16 border border-white/20 dark:border-gray-700 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full mb-8">
              <FileText className="text-indigo-500 dark:text-indigo-400" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Hozircha imtihonlar mavjud emas</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Siz uchun tayyorlangan imtihonlar hali yo'q</p>
          </div>
        ) : (
          exams.map((exam) => (
            <div key={exam._id} className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border border-white/30 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700 transform hover:-translate-y-2 hover:scale-[1.02]">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-2xl shadow-md ${
                      exam.status === 'FINISHED' 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                        : exam.status === 'STARTED' 
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                        : 'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}>
                      {exam.status === 'FINISHED' && <Award className="text-white" size={24} />}
                      {exam.status === 'STARTED' && <Target className="text-white" size={24} />}
                      {exam.status === 'NOT_STARTED' && <Clock className="text-white" size={24} />}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {exam.title}
                    </h3>
                  </div>
                  {exam.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-base leading-relaxed">
                      {exam.description}
                    </p>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <Timer size={18} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{exam.duration} daqiqa</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Davomiyligi</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <BarChart3 size={18} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{exam.total_points} ball</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Maksimum</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Calendar size={18} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{new Date(exam.start_date).toLocaleDateString('uz-UZ')}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Sana</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <Clock size={18} className="text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{new Date(exam.start_date).toLocaleTimeString('uz-UZ', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Vaqt</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full shadow-md ${statusColors[exam.status]}`}>
                      {statusLabels[exam.status]}
                    </span>
                    
                    {exam.status === 'FINISHED' && (
                      <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-4 py-2 rounded-xl border border-green-200 dark:border-green-700">
                        <BarChart3 size={16} className="text-green-600 dark:text-green-400" />
                        <span className="font-semibold text-green-700 dark:text-green-300">{(exam.score ?? 0)}/{exam.total_points} ball</span>
                        <span className="text-green-600 dark:text-green-400">({(Number(exam.percentage) || 0).toFixed(1)}%)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {exam.status === 'NOT_STARTED' && exam.canStart && (
                    <button
                      onClick={() => startExam(exam)}
                      className="btn-primary flex items-center gap-2 px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    >
                      <Play size={18} />
                      Boshlash
                    </button>
                  )}
                  
                  {exam.status === 'STARTED' && exam.canStart && (
                    <button
                      onClick={() => startExam(exam)}
                      className="btn-primary flex items-center gap-2 px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      <Play size={18} />
                      Davom ettirish
                    </button>
                  )}
                  
                  {exam.status === 'FINISHED' && exam.canView && (
                    <button
                      onClick={() => viewResult(exam)}
                      className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      <Eye size={18} />
                      Natijani ko'rish
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Exam Modal */}
      <Modal
        isOpen={showExamModal}
        onClose={() => {}}
        title={examData?.title}
        size="xl"
        showCloseButton={false}
      >
        {examData && (
          <div className="space-y-6">
            {/* Header with Timer */}
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Savol {currentQuestionIndex + 1} / {examData.questions.length}
                </div>
                <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${((currentQuestionIndex + 1) / examData.questions.length) * 100}%` }}
                  />
                </div>
              </div>
              <div className={`flex items-center gap-2 font-bold ${
                timeLeft < 300 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
              }`}>
                <Timer size={20} />
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Question */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {examData.questions[currentQuestionIndex].question_text}
              </h3>
              
              <div className="space-y-3">
                {examData.questions[currentQuestionIndex].options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      getCurrentAnswer(currentQuestionIndex) === index
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      checked={getCurrentAnswer(currentQuestionIndex) === index}
                      onChange={() => handleAnswerSelect(currentQuestionIndex, index)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="flex-1 text-gray-900 dark:text-white">
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Ball: {examData.questions[currentQuestionIndex].points}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={16} />
                Oldingi
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: examData.questions.length }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQuestionIndex(i)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      i === currentQuestionIndex
                        ? 'bg-blue-500 text-white'
                        : getCurrentAnswer(i) !== null
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {currentQuestionIndex === examData.questions.length - 1 ? (
                <button
                  onClick={handleSubmitExam}
                  className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
                >
                  <CheckCircle size={16} />
                  Topshirish
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Keyingi
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Result Modal */}
      <Modal
        isOpen={showResultModal}
        onClose={() => {
          setShowResultModal(false);
          setExamData(null);
          setExamResult(null);
          setCurrentExam(null);
        }}
        title={`${currentExam?.title} - Natijalar`}
        size="xl"
      >
        {examData && examResult && (
          <div className="space-y-6">
            {/* Score Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">To'plagan ball</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {examResult.score}/{examData.total_points}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Foiz</p>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {(Number(examResult.percentage) || 0).toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Sarflangan vaqt</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {Math.floor((Number(examResult.time_taken) || 0) / 60)}:{((Number(examResult.time_taken) || 0) % 60).toString().padStart(2, '0')}
                  </p>
                </div>
              </div>
            </div>

            {/* Questions Review */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Savollarni ko'rib chiqish
              </h3>
              <div className="space-y-4">
                {examData.questions.map((question, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {index + 1}. {question.question_text}
                      </h4>
                      <div className="flex items-center gap-2">
                        {question.is_correct ? (
                          <CheckCircle className="text-green-500" size={20} />
                        ) : (
                          <XCircle className="text-red-500" size={20} />
                        )}
                        <span className={`text-sm font-medium ${
                          question.is_correct 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {question.is_correct ? question.points : 0}/{question.points} ball
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-2 rounded text-sm ${
                            optIndex === question.correct_answer
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 font-medium'
                              : optIndex === question.student_answer
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {String.fromCharCode(65 + optIndex)}. {option}
                          {optIndex === question.correct_answer && ' ✅ To\'g\'ri javob'}
                          {optIndex === question.student_answer && optIndex !== question.correct_answer && ' ❌ Sizning javobingiz'}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowResultModal(false);
                  setExamData(null);
                  setExamResult(null);
                  setCurrentExam(null);
                }}
                className="btn-primary px-6 py-2 rounded-lg font-medium"
              >
                Yopish
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
