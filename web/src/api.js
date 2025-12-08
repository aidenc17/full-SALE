/**
 * api.js
 *
 * Simple API layer for auth and student data
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3309/api";
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

/* ========== NOTIFICATIONS (Backward Compatible) ========== */

/**
 * Get notifications for current user (old signature for compatibility)
 * @param {Object} user - User object
 * @returns {Array} Array of notification objects
 */
export function getNotificationsFor(user) {
  // For now, return empty array - will implement backend later
  return [];
}

/**
 * Save notifications for a user (old signature for compatibility)
 * @param {Object} user - User object
 * @param {Array} items - Array of notification objects
 */
export function setNotificationsFor(user, items) {
  // Placeholder - will implement backend later
  console.log("setNotificationsFor called (not yet implemented)");
}

/**
 * Mark all notifications as read (old signature for compatibility)
 * @param {Object} user - User object
 */
export function markAllReadFor(user) {
  // Placeholder - will implement backend later
  console.log("markAllReadFor called (not yet implemented)");
}

/**
 * Mark a single notification as read (old signature for compatibility)
 * @param {Object} user - User object
 * @param {number} id - Notification ID
 */
export function markReadFor(user, id) {
  // Placeholder - will implement backend later
  console.log("markReadFor called (not yet implemented)");
}