/**
 * App.js
 *
 * Main app component with routing setup
 *
 * ARCHITECTURE:
 * - Single-page app using React Router
 * - Role-based route protection with ProtectedRoute wrapper
 * - Always shows the navigation bar on all pages
 * - Content is centered with side gutters (.page-rails)
 *
 * ROUTE STRUCTURE:
 * - Public: /login
 * - Student: /student/*
 * - Faculty: /faculty/*
 * - Admin: /admin/*
 * - Fallback: Redirect to /login
 *
 * PROTECTION LEVELS:
 * - <ProtectedRoute> - Requires login (any role)
 * - <ProtectedRoute role="student"> - Only for students
 */

import { Routes, Route, Navigate } from "react-router-dom";
import "./styles.css";
import Nav from "./components/Nav";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import StudentDashboard from "./pages/student/StudentDashboard";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentNotifications from "./pages/student/notifications/StudentNotifications";
import StudentDegreePlan from "./pages/student/plan/StudentDegreePlan";
import StudentRequests from "./pages/student/requests/StudentRequests";

/**
 * Placeholder component for pages that aren't finished yet
 * Stops 404 errors for linked features that are still in progress
 */
function Stub({ title }) {
  return (
    <div className="container">
      <div className="card" style={{ marginTop: 16 }}>
        <h3>{title}</h3>
        <p>Coming soon!</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="page-rails">
      {/* Global navigation - appears on all pages */}
      <Nav />

      {/* Main content area */}
      <div className="routes-wrapper">
        <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route path="/login" element={<Login />} />

          {/* ========== STUDENT ROUTES ========== */}
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/plan"
            element={
              <ProtectedRoute role="student">
                <StudentDegreePlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/requests"
            element={
              <ProtectedRoute role="student">
                <StudentRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/notifications"
            element={
              <ProtectedRoute role="student">
                <StudentNotifications />
              </ProtectedRoute>
            }
          />

          {/* ========== FACULTY ROUTES ========== */}
          <Route
            path="/faculty"
            element={
              <ProtectedRoute>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/approvals"
            element={
              <ProtectedRoute>
                <Stub title="Approvals" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/students"
            element={
              <ProtectedRoute>
                <Stub title="Advisees" />
              </ProtectedRoute>
            }
          />

          {/* ========== ADMIN ROUTES ========== */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/catalog"
            element={
              <ProtectedRoute>
                <Stub title="Catalog Admin" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <Stub title="User Admin" />
              </ProtectedRoute>
            }
          />

          {/* ========== FALLBACK ========== */}
          {/* Redirect any unknown routes to the login page */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  );
}
