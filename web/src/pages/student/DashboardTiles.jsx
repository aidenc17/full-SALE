/**
 * DashboardTiles.jsx
 *
 * Student dashboard feature tiles
 *
 * Pure display component showing the three main student features:
 * 1. Degree Plan - Course planning and prerequisites
 * 2. Requests - Co-op and credit load requests
 * 3. Notifications - Faculty approvals and guidance
 *
 * DESIGN NOTE:
 * - No state or logic, keeps the parent StudentDashboard tidy
 * - Uses global CSS classes for consistent styling
 */

import { Link } from "react-router-dom";

export default function DashboardTiles() {
  return (
    <div className="grid" style={{ marginTop: 12 }}>
      {/* Degree Plan tile */}
      <section className="card">
        <h3>Degree Plan</h3>
        <p style={{ opacity: 0.9 }}>
          Choose your majors and minors to create a semester-by-semester plan,
          with prerequisite checks and details on when courses are available.
        </p>
        <ul style={{ marginTop: 8 }}>
          <li>Flags when credits are under 11 or over 20 for approval</li>
          <li>Recommends a longer plan when needed</li>
        </ul>
        <Link
          to="/student/plan"
          className="btn"
          style={{ marginTop: 12 }}
        >
          Open Degree Plan
        </Link>
      </section>

      {/* Requests tile */}
      <section className="card">
        <h3>Requests</h3>
        <p style={{ opacity: 0.9 }}>
          Request a semester-long co-op or credit load change. The system will
          update your plan and notify your faculty advisor.
        </p>
        <ul style={{ marginTop: 8 }}>
          <li>Pick your co-op term</li>
          <li>Approvals for taking fewer or more credits than usual</li>
        </ul>
        <Link to="/student/requests" className="btn" style={{ marginTop: 12 }}>
          Make a Request
        </Link>
      </section>

      {/* Notifications tile */}
      <section className="card">
        <h3>Notifications</h3>
        <p style={{ opacity: 0.9 }}>
          Take a look at faculty approvals and guidance messages. Also, new
          notifications pop up as a badge on the header bell.
        </p>
        <ul style={{ marginTop: 8 }}>
          <li>Approvals, overrides, and timeline adjustments </li>
          <li>Badge counter updates when you log in.</li>
        </ul>
        <Link
          to="/student/notifications"
          className="btn"
          style={{ marginTop: 12 }}
        >
          View Notifications
        </Link>
      </section>
    </div>
  );
}
