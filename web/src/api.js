/**
 * api.js
 *
 * Simple API layer for auth and student data
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
const USER_KEY = "degreeadmin:user";

/* ========== AUTHENTICATION ========== */

/**
 * Gets the currently logged-in user from session
 * @returns {Object|null} User object or null
 */
export function getCurrentUser() {
  const raw = sessionStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

/**
 * Login with username/password
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Object>} User object
 */
export async function login(username, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Login failed");
    }

    const data = await res.json();

    // Store user in session
    sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));

    return data.user;
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
}

/**
 * Logout - clear session
 */
export function logout() {
  sessionStorage.removeItem(USER_KEY);
}

/* ========== STUDENT SCHEDULE/PLAN ========== */

/**
 * Get student's degree plan
 * @param {number} studentId
 * @returns {Promise<Array>} List of courses in plan
 */
export async function getStudentPlan(studentId) {
  try {
    const res = await fetch(`${API_BASE_URL}/students/${studentId}/plan`);
    if (!res.ok) throw new Error("Failed to fetch plan");
    return await res.json();
  } catch (err) {
    console.error("Error fetching plan:", err);
    throw err;
  }
}

/* ========== NOTIFICATIONS ========== */

/**
 * Get the localStorage key for a user's notifications
 * @private
 */
function getNotificationKey(user) {
  return `degreeadmin:notifications:${user.username}`;
}

/**
 * Get notifications for current user
 * @param {Object} user - User object
 * @returns {Array} Array of notification objects
 */
export function getNotificationsFor(user) {
  if (!user) return [];
  
  const key = getNotificationKey(user);
  const raw = localStorage.getItem(key);
  
  return raw ? JSON.parse(raw) : [];
}

/**
 * Save notifications for a user
 * @param {Object} user - User object
 * @param {Array} items - Array of notification objects
 */
export function setNotificationsFor(user, items) {
  if (!user) return;
  
  const key = getNotificationKey(user);
  localStorage.setItem(key, JSON.stringify(items || []));
}

/**
 * Mark all notifications as read
 * @param {Object} user - User object
 */
export function markAllReadFor(user) {
  if (!user) return;
  
  const notifications = getNotificationsFor(user);
  const updated = notifications.map(n => ({ ...n, unread: false }));
  setNotificationsFor(user, updated);
}

/**
 * Mark a single notification as read
 * @param {Object} user - User object
 * @param {number} id - Notification ID
 */
export function markReadFor(user, id) {
  if (!user) return;
  
  const notifications = getNotificationsFor(user);
  const updated = notifications.map(n => 
    n.id === id ? { ...n, unread: false } : n
  );
  setNotificationsFor(user, updated);
}

/**
 * Add a new notification for a user
 * @param {Object} user - User object
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type ('success', 'info', 'warning', 'error')
 * @param {string} category - Notification category (e.g., 'Academic', 'Administrative')
 */
export function addNotification(user, title, message, type = "info", category = "Academic") {
  if (!user) return;
  
  const notifications = getNotificationsFor(user);
  
  const newNotification = {
    id: Date.now(),
    title,
    message,
    type,
    unread: true,
    timestamp: new Date().toISOString(),
    category
  };
  
  // Add to beginning (newest first)
  const updated = [newNotification, ...notifications];
  
  // Keep only the 5 most recent notifications
  const limited = updated.slice(0, 5);
  
  setNotificationsFor(user, limited);
  
  // Trigger both storage event and custom notification event
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new CustomEvent("notificationAdded", { detail: newNotification }));
  
  return newNotification;
}