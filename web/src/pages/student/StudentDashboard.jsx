//import the shared nav bar
import Nav from '../../components/Nav';

//component for the student dashboard page
export default function StudentDashboard() {
  return (
    <>
      {/* always show the nav bar at the top */}
      <Nav />

      {/* main content area of the student dashboard */}
      <div style={{ padding: 16 }}>
        {/* section title */}
        <h3>Student Dashboard</h3>

        {/* placeholder list of features the student will use, these directly tie to the project req */}
        <ul>
          {/* req: students choose 2 majors and 2 minors (or a cert) */}
          <li>Select majors/minors</li>

          {/* req: generate an n semester plan that respects prereqs, caps, and offerings */}
          <li>Set N semesters, Generate Plan</li>

          {/* req: allow students to request a semester long co-op, which shifts their plan and needs faculty approval */}
          <li>Request Co-op</li>

          {/* req: students must be able to see notifications */}
          <li>View Notifications</li>
        </ul>
      </div>
    </>
  );
}