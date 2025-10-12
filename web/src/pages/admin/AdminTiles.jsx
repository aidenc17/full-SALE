import { Link } from "react-router-dom";

/**
 * AdminTiles
 * - role-specific quick links for admins
 * - mirrors StudentTiles/FacultyTiles structure
 */
export default function AdminTiles() {
  return (
    <div className="grid" style={{ marginTop: 12 }}>
      {/* MANAGE USERS */}
      <section className="card">
        <h3>Manage Users</h3>
        <p style={{ opacity: 0.9 }}>
          Create or delete student, faculty, or admin accounts.
        </p>
        <ul style={{ marginTop: 8 }}>
          <li>Add new users using valid credentials</li>
          <li>Remove existing users when necessary</li>
        </ul>
        <Link to="/admin/users" className="btn btn-primary" style={{ marginTop: 12 }}>
          Open User Management
        </Link>
      </section>

      {/* MANAGE CATALOG */}
      <section className="card">
        <h3>Catalog Editor</h3>
        <p style={{ opacity: 0.9 }}>
          Keep the course catalog updated so majors and minors stay current.
        </p>
        <ul style={{ marginTop: 8 }}>
          <li>Add new courses</li>
          <li>Remove outdated courses</li>
        </ul>
        <Link to="/admin/catalog" className="btn" style={{ marginTop: 12 }}>
          Open Catalog
        </Link>
      </section>
    </div>
  );
}
