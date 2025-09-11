//import the shared nav
import Nav from '../../components/Nav';

//component for the faculty dashboard page
export default function FacultyDashboard() {
  return (
    <>
      {/* nav bar always shown */}
      <Nav />

      {/* main content area of the faculty dashboard */}
      <div style={{ padding: 16 }}>
        {/* section title */}
        <h3>Faculty Dashboard</h3>

        {/* placeholder list of faculty features. these directly map to sean's req */}
        <ul>
          {/* faculty must be able to see which students they advise, so they can review each student's degree plan */}
          <li>Advisees list</li>

          {/* faculty must be able to approve or deny: under load (< 11 credits) requests, overload (> 20 credits) requests, and co-op requests */}
          <li>Approve under/over-load, co-op</li>

          {/* faculty can send feedback to students. this must appear as notifications for students */}
          <li>Send guidance (shows in student notifications)</li>
        </ul>
      </div>
    </>
  );
}