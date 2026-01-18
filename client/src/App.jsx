import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import StudentTasks from './pages/StudentTasks';
import StudentCodeEditor from './pages/StudentCodeEditor';
import StudentRating from './pages/StudentRating';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Groups from './pages/Groups';
import Students from './pages/Students';
import Leads from './pages/Leads';
import Marketing from './pages/Marketing';
import Payments from './pages/Payments';
import Attendance from './pages/Attendance';
import Staff from './pages/Staff';
import AdminTasks from './pages/AdminTasks';
import Rating from './pages/Rating';
import Exams from './pages/Exams';
import StudentExams from './pages/StudentExams';
import Layout from './components/Layout';

// PrivateRoute komponenti endi ishlatilmaydi, chunki AppRoutes buni boshqaradi

function AppRoutes() {
  const { user, loading } = useAuth();

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, redirect to appropriate dashboard
  const adminToken = localStorage.getItem('token');
  const studentToken = localStorage.getItem('studentToken');

  if (adminToken || studentToken) {
    // Redirect authenticated users away from login pages
    return (
      <Routes>
        {/* Redirect login pages to dashboard if already authenticated */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/student-login" element={<Navigate to="/student" replace />} />

        {/* Student Routes */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/tasks" element={<StudentTasks />} />
        <Route path="/student/code-editor/:taskId" element={<StudentCodeEditor />} />
        <Route path="/student/rating" element={<StudentRating />} />
        <Route path="/student/exams" element={<StudentExams />} />

        {/* Protected Admin Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="groups" element={<Groups />} />
          <Route path="students" element={<Students />} />
          <Route path="leads" element={<Leads />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="exams" element={<Exams />} />
          <Route path="payments" element={<Payments />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="staff" element={<Staff />} />
          <Route path="tasks" element={<AdminTasks />} />
          <Route path="rating" element={<Rating />} />
        </Route>

        {/* Catch all - redirect to appropriate dashboard */}
        <Route path="*" element={<Navigate to={adminToken ? "/" : "/student"} replace />} />
      </Routes>
    );
  }

  // If not authenticated, show login pages
  return (
    <Routes>
      {/* Login pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/student-login" element={<StudentLogin />} />

      {/* Redirect root to login, but allow student-login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
