//NotificationsBell is a reusable component that shows a bell icon and (optionally) a red badge with the number of notifications
export default function NotificationsBell({ count = 0 }) {
  return (
    <div style={{ position: 'relative' }}>
      {/* the bell icon itself. right now it's just an emoji */}
      <span>🔔</span>

      {/* if count > 0, show the red badge. otherwise, show nothing */}
      {count > 0 && (
        <span
          style={{
            //position the badge in the top right corner of the bell
            position: 'absolute',
            top: -6,
            right: -8,
            background: '#d00',       //red background
            color: '#fff',            //white text
            borderRadius: 12,         //makes it pill shaped
            padding: '0 6px',         //space left/right around number
            fontSize: 12              //small text
          }}
        >
          +{count}
        </span>
      )}
    </div>
  );
}