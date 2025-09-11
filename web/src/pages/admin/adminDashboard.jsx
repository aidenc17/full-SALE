//import the shared nav
import Nav from '../../components/Nav';

//component for the admin dashboard page
export default function AdminDashboard() {
  return (
    <>
      {/* nav bar always shown */}
      <Nav />

      {/* main content area of the admin dashboard */}
      <div style={{ padding: 16 }}>
        {/* section title */}
        <h3>Admin Dashboard</h3>

        {/* placeholder list of admin features. these directly map to sean's req */}
        <ul>
          {/* admins must be able to manage users. min: add and remove students/faculty accounts. this covers the req that different user roles can be created */}
          <li>Manage users (seeded)</li>

          {/* admins must be able to add/remove from the catalog. this allows them to update courses or req */}
          <li>Catalog editor (add/remove courses, requirements)</li>
        </ul>
      </div>
    </>
  );
}