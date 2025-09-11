import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
      <Routes>
        {/* default route: send everyone to /login 1st */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* login page */}
        <Route path="/login" element={<Login />} />

        {/* student dashboard (only for users with role="student") */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* faculty dashboard */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute role="faculty">
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        {/* admin dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* else */}
        <Route path="*" element={<div>Why are you breaking things?</div>} />
      </Routes>
  );
}
export default App;