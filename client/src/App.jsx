import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
<<<<<<< HEAD
=======
import Home from './pages/Home';
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
import Login from './pages/Login';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import StudentTasks from './pages/StudentTasks';
import StudentCodeEditor from './pages/StudentCodeEditor';
import StudentRating from './pages/StudentRating';
<<<<<<< HEAD
import StudentProfile from './pages/StudentProfile';
import Classmates from './pages/Classmates';
=======
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Groups from './pages/Groups';
import Students from './pages/Students';
import Leads from './pages/Leads';
<<<<<<< HEAD
import Marketing from './pages/Marketing';
=======
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
import Payments from './pages/Payments';
import Attendance from './pages/Attendance';
import Staff from './pages/Staff';
import AdminTasks from './pages/AdminTasks';
import Rating from './pages/Rating';
<<<<<<< HEAD
import Exams from './pages/Exams';
import Quizzes from './pages/Quizzes';
import StudentExams from './pages/StudentExams';
import Certificates from './pages/Certificates';
import Sms from './pages/Sms';
import Referrals from './pages/Referrals';
import AdminCoins from './pages/AdminCoins';
import AdminMarket from './pages/AdminMarket';
import StudentMarket from './pages/StudentMarket';
import AdminEvents from './pages/AdminEvents';
import Maintenance from './pages/Maintenance';
import Layout from './components/Layout';

// PrivateRoute komponenti endi ishlatilmaydi, chunki AppRoutes buni boshqaradi

function AppRoutes() {
  const { user, student, loading } = useAuth();

  // Show loading screen while checking authentication
=======
import Layout from './components/Layout';

function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  
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
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check admin-only routes
  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }
  
  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
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

<<<<<<< HEAD
  // If user is authenticated, show protected routes
  if (user || student) {
    return (
      <Routes>
        {/* Admin Routes with Layout - MUST be first to prevent /students matching /student/:tab */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="groups" element={<Groups />} />
          <Route path="students" element={<Students />} />
          <Route path="leads" element={<Leads />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="exams" element={<Exams />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="payments" element={<Payments />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="staff" element={<Staff />} />
          <Route path="tasks" element={<AdminTasks />} />
          <Route path="rating" element={<Rating />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="sms" element={<Sms />} />
          <Route path="referrals" element={<Referrals />} />
          <Route path="coins" element={<AdminCoins />} />
          <Route path="market" element={<AdminMarket />} />
          <Route path="maintenance" element={<Maintenance />} />
        </Route>

        {/* Events route without Layout */}
        <Route path="/events" element={<AdminEvents />} />

        {/* Student Routes - after admin routes */}
        <Route path="/student/code-editor/:taskId" element={<StudentCodeEditor />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/profile/:id" element={<StudentProfile />} />
        <Route path="/student/classmates" element={<Classmates />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/overview" element={<StudentDashboard />} />
        <Route path="/student/tasks" element={<StudentDashboard />} />
        <Route path="/student/rating" element={<StudentDashboard />} />
        <Route path="/student/exams" element={<StudentDashboard />} />
        <Route path="/student/market" element={<StudentDashboard />} />
        <Route path="/student/events" element={<StudentDashboard />} />
        <Route path="/student/attendance" element={<StudentDashboard />} />
        <Route path="/student/payments" element={<StudentDashboard />} />

        {/* Catch all - redirect to appropriate dashboard */}
        <Route path="*" element={<Navigate to={user ? "/" : "/student"} replace />} />
      </Routes>
    );
  }

  // If not authenticated, show login pages
  return (
    <Routes>
      {/* Login pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/student-login" element={<StudentLogin />} />

      {/* Redirect student routes to student-login */}
      <Route path="/student" element={<Navigate to="/student-login" replace />} />

      {/* Redirect all other routes to admin login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
=======
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={user ? <Navigate to="/admin" /> : <Home />} 
      />
      <Route path="/login" element={<Login />} />
      <Route path="/student-login" element={<StudentLogin />} />
      
      {/* Student Routes */}
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/student/tasks" element={<StudentTasks />} />
      <Route path="/student/code-editor/:taskId" element={<StudentCodeEditor />} />
      <Route path="/student/rating" element={<StudentRating />} />
      
      {/* Protected Routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="courses" element={
          <PrivateRoute adminOnly>
            <Courses />
          </PrivateRoute>
        } />
        <Route path="groups" element={<Groups />} />
        <Route path="students" element={<Students />} />
        <Route path="leads" element={
          <PrivateRoute adminOnly>
            <Leads />
          </PrivateRoute>
        } />
        <Route path="payments" element={<Payments />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="staff" element={
          <PrivateRoute adminOnly>
            <Staff />
          </PrivateRoute>
        } />
        <Route path="tasks" element={<AdminTasks />} />
        <Route path="rating" element={<Rating />} />
      </Route>
>>>>>>> f76e6b7a4f867ecdb448a60fb5faf9d6925d5c88
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
