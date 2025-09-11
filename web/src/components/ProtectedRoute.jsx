import { Navigate } from 'react-router-dom'; 
import { getCurrentUser } from '../api';

//ProtectedRoute literally wraps any component that should be role-protected
//usage in App.jsx looks like:
//<ProtectedRoute role="student"><StudentDashboard/></ProtectedRoute>
export default function ProtectedRoute({ role, children }) {
  //grab the current user from sessionStorage (fake login data for now)
  const user = getCurrentUser();

  //case 1: if there's no user at all, redirect to /login
  //"replace" means don't leave the blocked URL in browser history
  if (!user) return <Navigate to="/login" replace />;

  //case 2: user exists, but their role doesn't match the req role
  //example: a faculty tries to hit /student, they get bounced to /faculty
  if (role && user.role !== role) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  //case 3: user exists *and* has the right role, then render the child component
  //example: a student on /student sees <StudentDashboard/>
  return children;
}