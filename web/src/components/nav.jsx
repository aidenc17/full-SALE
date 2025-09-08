import { logout, getCurrentUser } from '../api';
import NotificationsBell from './NotificationsBell';

//nav = the top navigation bar shown on every dashboard
export default function Nav() {
  //grab the current user (stored in sessionStorage by login)
  //this lets us display their username in the top right corner
  const user = getCurrentUser();

  return (
    <div
      style={{
        //flexbox layout: puts title on the left, user controls on the right
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid #ddd'
      }}
    >
      {/* left side: app title */}
      <div style={{ fontWeight: 700 }}>DegreeAdmin</div>

      {/* right side: notifications bell, username, logout button */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {/* notifications placeholder, right now count=0 is hard coded. */}
        <NotificationsBell count={0} />

        {/* show the logged in user's username (e.g. saaaaaaa).
            the ? means "safe access", if user is null, it won't crash and be dumb */}
        <span style={{ opacity: 0.8 }}>{user?.username}</span>

        {/* logout button. on click:
            1. call logout(), removes the user from sessionStorage
            2. force redirect to /login by setting window.location.href */}
        <button
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}