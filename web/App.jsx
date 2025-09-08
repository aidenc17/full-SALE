//import things from react router that handle nav and routes
import { Routes, Route, Navigate } from 'react-router-dom';

//import each page we want to show
import Login from './pages/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

//import our custom wrapper that checks if user is logged in & has the right role
import ProtectedRoute from './components/ProtectedRoute';

//main application component
export default function App() {
  return (
    //routes = container for all <Route> definitions
    <Routes>
      {/* default route: if user goes to "/", automatically redirect them to "/login" */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ruote for the login page */}
      <Route path="/login" element={<Login />} />

      {/* student dashboard: PR checks if the logged in user has role="student"
          1 = show <StudentDashboard/>
          0 = go somewhere else */}
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* faculty dashboard: same, but only users with role="faculty" can see this */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute role="faculty">
            <FacultyDashboard />
          </ProtectedRoute>
        }
      />

      {/* admin dashboard: only users with role="admin" can see this */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* else route: if user tries to go to a url that doesn't exist, show a 404 message */}
      <Route path="*" element={<div style={{ padding: 16 }}>This is not the droid you're looking for.</div>} />
    </Routes>
  );
}