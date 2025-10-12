/**
 * api.js
 *
 * Mock API layer for auth and notifications.  
 *
 * CURRENT STATE (MVP):
 * - Auth uses sessionStorage (clears when you close the browser)
 * - Notifications use localStorage (sticks around across sessions per user)
 *
 * FUTURE BACKEND INTEGRATION:
 * - Swap out login() with fetch('/api/auth/login')  
 * - Swap out getNotificationsFor() with fetch('/api/notifications')
 * - Keep the function signatures the same so you don't break the UI code
 */

const USER_KEY = "degreeadmin:user";
const NOTIF_KEY_PREFIX = "degreeadmin:notifs:";

/* ========== AUTHENTICATION ========== */

/**
 * Gets the currently logged-in user from the session  
 * @returns {Object|null} User object { username: string, role: string } or null
 */
export function getCurrentUser() {
  const raw = sessionStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

/**
 * Mock login - figures out role based on username prefix
 *
 * Role assignment logic (for demo):
 * - Username starts with 'a' -> admin
 * - Username starts with 'f' -> faculty
 * - All others -> student
 *
 * @param {string} username - User's username
 * @param {string} password - User's password (checked in UI, not used here)
 * @returns {Promise<Object>} Resolves with user object
 */
export function login(username, password) {
  let role = "student";
  const u = (username || "").toLowerCase();

  if (u.startsWith("a")) role = "admin";
  else if (u.startsWith("f")) role = "faculty";

  const user = { username, role };
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));

  // Seed demo notifications the first time you log in
  ensureSeedNotifications(user);

  return Promise.resolve(user);
}

/**
 * Clear user session
 * Note: Notifications stay in localStorage and will show up again when you log back in
 */
export function logout() {
  sessionStorage.removeItem(USER_KEY);
}

/* ========== NOTIFICATIONS ========== */

/**
 * Get notifications for current user
 *
 * @param {Object} user - User object
 * @returns {Array} Array of notification objects with shape:
 *   { id, type, title, detail, when, unread, href? }
 */
export function getNotificationsFor(user) {
  if (!user) return [];

  const key = buildNotificationKey(user);
  const raw = localStorage.getItem(key);

  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Save notifications for a user (update read/unread status)
 *
 * @param {Object} user - User object
 * @param {Array} items - Array of notification objects
 */
export function setNotificationsFor(user, items) {
  if (!user) return;

  const key = buildNotificationKey(user);
  localStorage.setItem(key, JSON.stringify(items || []));
}

/**
 * Mark all notifications as read for a user
 *
 * @param {Object} user - User object
 */
export function markAllReadFor(user) {
  if (!user) return;

  const items = getNotificationsFor(user).map((n) => ({
    ...n,
    unread: false,
  }));

  setNotificationsFor(user, items);
}

/**
 * Mark a single notification as read
 *
 * @param {Object} user - User object
 * @param {number} id - Notification ID
 */
export function markReadFor(user, id) {
  if (!user || id == null) return;

  const items = getNotificationsFor(user).map((n) =>
    n.id === id ? { ...n, unread: false } : n
  );

  setNotificationsFor(user, items);
}

/* ========== INTERNAL HELPERS ========== */

/**
 * Create a localStorage key for the user's notifications
 * @private
 */
function buildNotificationKey(user) {
  return `${NOTIF_KEY_PREFIX}${user.username}`;
}

/**
 * Seed demo notifications on first login (role-specific)
 * @private
 */
function ensureSeedNotifications(user) {
  const key = buildNotificationKey(user);

  // Uncomment to stop re-seeding on each login:
  // if (localStorage.getItem(key)) return;

  let items = [];

  if (user.role === "student") {
    items = [
      {
        id: 1,
        type: "PLAN_CHANGED",
        title: "Plan updated",
        detail: "CSE 3220 got moved to Spring to meet the prerequisites.",
        when: "2h ago",
        unread: true,
        href: "/student/plan",
      },
      {
        id: 2,
        type: "FACULTY_GUIDANCE",
        title: "Advisor note",
        detail: "Think about a lighter load with the upcoming co-op.",
        when: "Yesterday",
        unread: true,
        href: "/student/requests",
      },
    ];
  } else if (user.role === "faculty") {
    items = [
      {
        id: 101,
        type: "CREDIT_LOAD_REQUEST",
        title: "Overload request",
        detail: "Student asks to take 21 credits in Spring.",
        when: "3h ago",
        unread: true,
        href: "/faculty/approvals",
      },
    ];
  } else if (user.role === "admin") {
    items = [
      {
        id: 201,
        type: "COURSE_ADDED",
        title: "Catalog change",
        detail: "Added CEG 4xxx Experimental Networks.",
        when: new Date().toLocaleString(),
        unread: false,
        href: "/admin/catalog",
      },
      {
        id: 202,
        type: "USER_CREATED",
        title: "New faculty",
        detail: "Onboarded jsmith (faculty).",
        when: "Yesterday",
        unread: true,
        href: "/admin/users",
      },
    ];
  }

  localStorage.setItem(key, JSON.stringify(items));
}
