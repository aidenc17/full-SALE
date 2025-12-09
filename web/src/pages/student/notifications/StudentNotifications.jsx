/**
 * StudentNotifications.jsx
 *
 * Full-page notification center for students
 *
 * FEATURES:
 * - Shows all notifications with unread count
 * - Filter to show unread only
 * - Mark all as read functionality
 * - Click notifications to expand and see full message
 * - Syncs with notification bell via shared store
 *
 * DATA SOURCE:
 * - Uses useNotifications() hook (single source of truth)
 * - Same data as NotificationsBell component
 * - Updates automatically when bell marks items as read
 *
 * FUTURE BACKEND:
 * - Just need to update notifications.store.js
 * - This component won't need any changes
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../../notifications.store";

export default function StudentNotifications() {
  const navigate = useNavigate();

  // Shared notification state from store
  const { items, unread, markAllRead, markRead } = useNotifications();

  // Local UI filter
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  
  // Track which notifications are expanded
  const [expandedIds, setExpandedIds] = useState(new Set());

  const visibleItems = showUnreadOnly ? items.filter((n) => n.unread) : items;
  
  function toggleExpanded(id) {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleNotificationClick(notification) {
    // Toggle expansion
    toggleExpanded(notification.id);
    
    // Mark as read
    if (notification.unread && typeof markRead === "function") {
      markRead(notification.id);
    }

    // Navigate if there's a link (only for certain notification types)
    if (notification.href) {
      navigate(notification.href);
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ marginTop: 16 }}>
        {/* Header with controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h3 style={{ margin: 0 }}>Notifications</h3>
          <span style={{ opacity: 0.8 }}>
            {unread > 0 ? `${unread} unread` : "All caught up!"}
          </span>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {/* Unread filter toggle */}
            <label
              className="btn btn-ghost"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
              />
              Unread only
            </label>

            {/* Mark all read button */}
            <button
              className="btn btn-ghost"
              onClick={markAllRead}
              disabled={unread === 0}
              title="Mark all notifications as read"
            >
              Mark all read
            </button>
          </div>
        </div>

        {/* Notification list or empty state */}
        {visibleItems.length === 0 ? (
          <p style={{ marginTop: 12 }}>
            {items.length === 0
              ? "No notifications yet."
              : "No unread notifications."}
          </p>
        ) : (
          <ul style={{ marginTop: 12, listStyle: "none", padding: 0 }}>
            {visibleItems.map((notification) => {
              const isExpanded = expandedIds.has(notification.id);
              const hasMessage = notification.message || notification.detail;
              
              return (
                <li
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    marginBottom: 8,
                    cursor: "pointer",
                    background: notification.unread
                      ? "var(--active-bg)"
                      : "transparent",
                    transition: "background 0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 8,
                    }}
                  >
                    <strong>
                      {getNotificationLabel(notification.type)} —{" "}
                      {notification.title}
                    </strong>
                    <span style={{ opacity: 0.6, fontSize: 12 }}>
                      {notification.when}
                    </span>
                    {notification.unread && (
                      <span
                        aria-label="unread"
                        style={{
                          marginLeft: "auto",
                          fontSize: 12,
                          padding: "2px 6px",
                          borderRadius: 12,
                          background: "var(--active-bg)",
                        }}
                      >
                        unread
                      </span>
                    )}
                  </div>
                  
                  {/* Expandable message */}
                  {isExpanded && hasMessage && (
                    <div 
                      style={{ 
                        marginTop: 8,
                        paddingTop: 8,
                        borderTop: "1px solid var(--border-color)",
                        opacity: 0.9,
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.5
                      }}
                    >
                      {notification.message || notification.detail}
                    </div>
                  )}
                  
                  {/* Click to expand hint */}
                  {!isExpanded && hasMessage && (
                    <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                      Click to view details
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

/**
 * Get a user-friendly label for the notification type
 * Needs to stay in sync with backend notification types
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
    success: "Info",
    warning: "Warning",
    error: "Error",
    info: "Info",
  };

  return labels[type] || "Info";
}