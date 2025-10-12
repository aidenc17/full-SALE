import { Link } from "react-router-dom";

/**
 * FacultyTiles
 * - Just a simple display: two cards linking to faculty pages.
 * - Uses the same .grid container + .card styles as the student tiles,
 *   so the tiles stack 1-up on small screens and 2-up on larger screens.
 */
export default function FacultyTiles() {
  return (
    // The .grid class is set up in styles.css and takes care of responsive tiling.
    <div className="grid" style={{ marginTop: 12 }}>
      {/* APPROVALS */}
      <section className="card">
        <h3>Approvals</h3>
        <p style={{ opacity: 0.9 }}>
          Check and approve or override student requests:
        </p>
        <ul style={{ marginTop: 8 }}>
          <li>Underload / Overload credit requests</li>
          <li>Co-op semester requests</li>
        </ul>
        <Link
          to="/faculty/approvals"
          className="btn btn-primary"
          style={{ marginTop: 12 }}
          aria-label="Open Approvals"
        >
          Open Approvals
        </Link>
      </section>

      {/* ADVISEES */}
      <section className="card">
        <h3>Advisees</h3>
        <p style={{ opacity: 0.9 }}>
          Check out your assigned students, see their plans, and leave some guidance.
        </p>
        <ul style={{ marginTop: 8 }}>
          <li>Student list and plan status</li>
          <li>Post guidance (shows up in student notifications)</li>
        </ul>
        <Link
          to="/faculty/students"
          className="btn"
          style={{ marginTop: 12 }}
          aria-label="View Advisees"
        >
          View Advisees
        </Link>
      </section>
    </div>
  );
}
