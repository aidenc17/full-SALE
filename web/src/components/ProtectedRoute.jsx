/**
 * ProtectedRoute.jsx
 * 
 * Route wrapper for authentication and role-based access control
 * 
 * BEHAVIOR:
 * 1. If not logged in -> redirect to /login (remembers intended destination)
 * 2. If logged in but wrong role -> redirect to user's home dashboard
 * 3. If logged in with correct role -> render children
 * 
 * USAGE:
 * <Route path="/student" element={
 *   <ProtectedRoute role="student">
 *     <StudentDashboard />
 *   </ProtectedRoute>
 * } />
 */

import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../api";

export default function ProtectedRoute({ role, children }) {
  const user = getCurrentUser();
  const location = useLocation();

  // Not authenticated - redirect to login with return path
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated but wrong role - redirect to their dashboard
  if (role && user.role !== role) {
    const userHome = {
      student: "/student",
      faculty: "/faculty",
      admin: "/admin",
    }[user.role] || "/login";

    return <Navigate to={userHome} replace />;
  }

  // Authorized - render protected content
  return children;
}