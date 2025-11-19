/**
 * api.js
 *
 * Updated to connect to backend API instead of using localStorage/sessionStorage
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// Store auth token in sessionStorage (still cleared on browser close)
const AUTH_TOKEN_KEY = "degreeadmin:token";

/* ========== AUTHENTICATION ========== */

/**
 * Gets the currently logged-in user from session
 * @returns {Object|null} User object { userId, username, email } or null
 */
export function getCurrentUser() {
  const user = sessionStorage.getItem(AUTH_TOKEN_KEY);
  return user ? JSON.parse(user) : null;
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
      throw new Error(`Login failed: ${res.statusText}`);
    }

    const data = await res.json();
    sessionStorage.setItem(AUTH_TOKEN_KEY, data.token);
    return data.user;
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
}

/**
 * Clear user session
 */
export function logout() {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

/**
 * Get auth token for API requests
 * @private
 */
function getAuthHeader() {
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ========== STUDENT SCHEDULE/PLAN ========== */

/**
 * Get student's degree plan
 * @param {number|string} studentId - Student ID
 * @returns {Promise<Object>} Degree plan with courses
 */
export async function getStudentPlan(studentId) {
  try {
    const res = await fetch(`${API_BASE_URL}/students/${studentId}/plan`, {
      headers: getAuthHeader(),
    });

    if (!res.ok) throw new Error("Failed to fetch plan");
    return await res.json();
  } catch (err) {
    console.error("Error fetching plan:", err);
    throw err;
  }
}

/**
 * Update a course in student's plan
 * @param {number|string} studentId
 * @param {number|string} courseId
 * @param {Object} updates - { semester, notes, etc }
 * @returns {Promise<Object>} Updated course
 */
export async function updateCourseInPlan(studentId, courseId, updates) {
  try {
    const res = await fetch(`${API_BASE_URL}/students/${studentId}/plan/${courseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) throw new Error("Failed to update course");
    return await res.json();
  } catch (err) {
    console.error("Error updating course:", err);
    throw err;
  }
}

/**
 * Add a course to student's plan
 * @param {number|string} studentId
 * @param {number|string} courseId
 * @param {Object} details - { semester, notes, etc }
 * @returns {Promise<Object>} Added course
 */
export async function addCourseToPlan(studentId, courseId, details) {
  try {
    const res = await fetch(`${API_BASE_URL}/students/${studentId}/plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ courseId, ...details }),
    });

    if (!res.ok) throw new Error("Failed to add course");
    return await res.json();
  } catch (err) {
    console.error("Error adding course:", err);
    throw err;
  }
}

/**
 * Remove a course from student's plan
 * @param {number|string} studentId
 * @param {number|string} courseId
 * @returns {Promise<void>}
 */
export async function removeCoursFromPlan(studentId, courseId) {
  try {
    const res = await fetch(`${API_BASE_URL}/students/${studentId}/plan/${courseId}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });

    if (!res.ok) throw new Error("Failed to remove course");
  } catch (err) {
    console.error("Error removing course:", err);
    throw err;
  }
}

/* ========== NOTIFICATIONS ========== */

/**
 * Get notifications for current user
 * @returns {Promise<Array>} Array of notification objects
 */
export async function getNotifications() {
  try {
    const res = await fetch(`${API_BASE_URL}/notifications`, {
      headers: getAuthHeader(),
    });

    if (!res.ok) throw new Error("Failed to fetch notifications");
    return await res.json();
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return [];
  }
}

/**
 * Mark notification as read
 * @param {number|string} notifId
 * @returns {Promise<Object>}
 */
export async function markNotificationRead(notifId) {
  try {
    const res = await fetch(`${API_BASE_URL}/notifications/${notifId}/read`, {
      method: "PATCH",
      headers: getAuthHeader(),
    });

    if (!res.ok) throw new Error("Failed to mark read");
    return await res.json();
  } catch (err) {
    console.error("Error marking notification read:", err);
    throw err;
  }
}

/**
 * Mark all notifications as read
 * @returns {Promise<void>}
 */
export async function markAllNotificationsRead() {
  try {
    const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: "PATCH",
      headers: getAuthHeader(),
    });

    if (!res.ok) throw new Error("Failed to mark all read");
  } catch (err) {
    console.error("Error marking all read:", err);
    throw err;
  }
}