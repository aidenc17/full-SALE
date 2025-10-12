/**
 * NotificationsBell.jsx
 *
 * Notification bell component with popover dropdown
 *
 * ARCHITECTURE:
 * - Uses shared notifications store (notifications.store.js) as the main source of truth
 * - Bell and /student/notifications page stay in sync automatically
 * - No need for prop drilling or context
 *
 * FEATURES:
 * - Displays unread count badge
 * - Popover with list of notifications
 * - "Mark all as read" feature
 * - Clicking a notification takes you to the related page
 * - Closes when clicking outside or pressing ESC
 *
 * FUTURE BACKEND:
 * - Just need to update the notifications.store.js fetch logic
 * - This component will stay the same
 */

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleAlert } from "lucide-react";
import { useNotifications } from "../notifications.store";

export default function NotificationsBell() {
  const nav = useNavigate();
  const rootRef = useRef(null);
  const popoverId = "notif-popover";

  // Shared store offers: items, unread count, functions to mark as read
  const { items, unread, markAllRead, markRead } = useNotifications();

  // Local UI state for whether the popover is visible or not
  const [open, setOpen] = useState(false);

  // Close popover when clicking outside or hitting ESC
  useEffect(() => {
    function handleOutsideClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Handle notification click, mark as read and go to it
  function handleNotificationClick(notification) {
    if (typeof markRead === "function") {
      markRead(notification.id);
    }

    setOpen(false);

    if (notification.href) {
      nav(notification.href);
    }
  }

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      {/* Bell icon with unread badge */}
      <button
        type="button"
        aria-label="Notifications"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={popoverId}
        onClick={() => setOpen((prev) => !prev)}
        className="bell"
      >
        <CircleAlert size={22} strokeWidth={2} aria-hidden="true" />
        {unread > 0 && <span className="bell-badge">{unread}</span>}
      </button>

      {/* Notification popover */}
      {open && (
        <div
          id={popoverId}
          role="dialog"
          aria-label="Notifications"
          className="popover"
          style={{ right: 0 }}
        >
          {/* Header with mark all read button */}
          <div className="popover-head">
            <strong>Notifications</strong>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={markAllRead}
              disabled={unread === 0}
              style={{ marginLeft: "auto" }}
            >
              Mark all read
            </button>
          </div>

          {/* Notification list or empty state */}
          {items.length === 0 ? (
            <div className="popover-empty">No notifications</div>
          ) : (
            <ul className="popover-list">
              {items.map((notification) => (
                <li
                  key={notification.id}
                  className="popover-item"
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    cursor: notification.href ? "pointer" : "default",
                    background: notification.unread
                      ? "var(--active-bg)"
                      : "transparent",
                  }}
                >
                  <div className="popover-title-row">
                    <span className="popover-title">
                      {getNotificationLabel(notification.type)} —{" "}
                      {notification.title}
                    </span>
                    <span className="popover-when">{notification.when}</span>
                  </div>
                  <div className="popover-detail">{notification.detail}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Get a user-friendly label for the notification type
 * Update this if backend notification types change
 */
function getNotificationLabel(type) {
  const labels = {
    COOP_REQUEST: "Co-op",
    CREDIT_LOAD_REQUEST: "Credits",
    PLAN_CHANGED: "Plan",
    FACULTY_APPROVED: "Approved",
    FACULTY_REJECTED: "Denied",
    FACULTY_GUIDANCE: "Guidance",
    COURSE_ADDED: "Catalog",
    USER_CREATED: "Users",
  };

  return labels[type] || "Info";
}
