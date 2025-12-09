/**
 * Nav.jsx
 *
 * Global navigation bar with role-based menus
 *
 * FEATURES:
 * - Shows up on every page (whether you're logged in or not)
 * - Role-aware navigation links (student/faculty/admin)
 * - Highlights the active page using aria-current
 * - Notification bell with unread badge
 * - Theme toggle (light/dark mode)
 * - User info display and logout option
 *
 * UNAUTHENTICATED STATE:
 * - Just shows the logo and login button
 * - Theme toggle still available
 *
 * AUTHENTICATED STATE:
 * - Full navigation with links tailored to your role
 * - Notifications, user info, and logout
 *
 * CUSTOMIZATION:
 * - Edit the byRole object to add or remove nav links
 * - Swap out the CalendarHeart icon with our own logo or SVG if we want to
 * - Styling for the active link is managed via CSS with [aria-current="page"]
 */

import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../api";
import NotificationsBell from "./NotificationsBell";
import ThemeToggle from "./ThemeToggle";
import { CalendarHeart } from "lucide-react";

export default function Nav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  /* ========== UNAUTHENTICATED VIEW ========== */

  if (!user) {
    return (
      <header className="app-header">
        {/* Logo */}
        <div className="nav-logo">
          <CalendarHeart size={22} aria-hidden="true" />
          DegreeAdmin
        </div>

        {/* Theme toggle and login button */}
        <nav className="nav-right">
          <ThemeToggle />
          <Link to="/login" className="btn btn-ghost">
            Login
          </Link>
        </nav>
      </header>
    );
  }

  /* ========== AUTHENTICATED VIEW ========== */

  const role = user.role;

  /**
   * Role-specific navigation links
   *
   * EDIT HERE to add new pages for each role
   * Each link object: { to: string, label: string }
   */
  const byRole = {
    student: [
      { to: "/student", label: "Dashboard" },
      { to: "/student/plan", label: "Degree Plan" },
      //{ to: "/student/gpa-calculator", label: "GPA Calculator" },
      { to: "/student/coop-request", label: "Co-op Request" },
      //{ to: "/student/requests", label: "Requests" },
      { to: "/student/notifications", label: "Notifications" },
    ],
    faculty: [
      { to: "/faculty", label: "Dashboard" },
      { to: "/faculty/approvals", label: "Approvals" },
      { to: "/faculty/students", label: "Advisees" },
    ],
    admin: [
      { to: "/admin", label: "Dashboard" },
      { to: "/admin/catalog", label: "Catalog" },
      { to: "/admin/users", label: "Users" },
    ],
  };

  const links = byRole[role] || byRole.student;

  // Role-specific homepage for the logo link
  const homePage =
    {
      student: "/student",
      faculty: "/faculty",
      admin: "/admin",
    }[role] || "/student";

  /**
   * Handle logout
   * Clears session and redirects to login page
   */
  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  /**
   * Check if a nav link is active
   * Dashboard links match exactly, sub-pages by prefix
   */
  function isLinkActive(linkPath) {
    const isDashboard = linkPath.endsWith(role);

    if (isDashboard) {
      return pathname === linkPath;
    }

    return pathname === linkPath || pathname.startsWith(linkPath + "/");
  }

  return (
    <header className="app-header">
      {/* Logo - links to role-specific home */}
      <Link to={homePage} className="nav-logo">
        <CalendarHeart size={22} aria-hidden="true" />
        <span>DegreeAdmin</span>
      </Link>

      {/* Navigation links (role-specific) */}
      <nav className="nav-links">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="nav-link"
            aria-current={isLinkActive(link.to) ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Right section: theme, notifications, user, logout */}
      <div className="nav-right">
        <ThemeToggle />
        <NotificationsBell />
        <span className="user-tag">
          {user.username} ({role})
        </span>
        <button onClick={handleLogout} className="btn btn-ghost">
          Logout
        </button>
      </div>
    </header>
  );
}