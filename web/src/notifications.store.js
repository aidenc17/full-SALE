/**
 * notifications.store.js
 *
 * Lightweight notification state management using React's useSyncExternalStore
 *
 * WHY THIS APPROACH:
 * - Keeps NotificationsBell and /student/notifications page in sync
 * - No need for a Context Provider - keeps things simpler
 * - Works smoothly with Create React App
 * - Easy to swap mock data for real API calls later
 *
 * HOW IT WORKS:
 * - Single shared state object holding notifications and unread count
 * - Components subscribe through useNotifications() hook
 * - When state updates, only subscribed components re-render
 * - Saves to localStorage via api.js (will switch to API calls)
 */

import { useEffect, useSyncExternalStore } from "react";
import {
  getCurrentUser,
  getNotificationsFor,
  setNotificationsFor,
  markAllReadFor,
  markReadFor,
} from "./api";

/* ========== INTERNAL STATE ========== */

// Shared notification state (single source of truth)
let state = {
  items: [], // Array of notification objects
  unread: 0, // Number of unread notifications calculated
};

// Set of subscriber functions (React components)
const listeners = new Set();

/**
 * Check how many notifications you haven't read yet
 * @private
 */
function computeUnread(items) {
  return items.reduce((count, item) => count + (item.unread ? 1 : 0), 0);
}

/**
 * Let everyone who's subscribed know about the state change.
 * @private
 */
function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}

/* ========== PUBLIC API ========== */

/**
 * Load notifications for the current user and update the store
 * Do this after login, logout, or whenever the data changes
 */
export function refreshNotifications() {
  const user = getCurrentUser();
  const items = user ? getNotificationsFor(user) : [];

  state = {
    items,
    unread: computeUnread(items),
  };

  notifyListeners();
}

/**
 * Subscribe to store updates (needed for useSyncExternalStore)
 * @param {Function} listener - Callback to run when state changes
 * @returns {Function} Unsubscribe function
 */
export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Get the current state snapshot (needed by useSyncExternalStore)
 * @returns {Object} Current state
 */
export function getSnapshot() {
  return state;
}

/**
 * Server-side snapshot for SSR (needed by useSyncExternalStore)
 * Not used in Create React App but still required by the API
 * @returns {Object} Current state
 */
export function getServerSnapshot() {
  return state;
}

/**
 * React hook to get notification state
 *
 * RETURNS:
 * - items: Array of notification objects
 * - unread: Count of unread notifications
 * - markAllRead(): Mark all notifications as read
 * - markRead(id): Mark specific notification as read
 * - refresh(): Manually reload notifications
 * - setItemsFromServer(items): Update with data from API
 *
 * @example
 * const { items, unread, markAllRead } = useNotifications();
 */
export function useNotifications() {
  const currentState = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  // Sync up with authentication updates (support for across tabs)
  useEffect(() => {
    function handleStorageChange(e) {
      // If the user logs in or out in another tab, refresh notifications.
      if (e.key === "degreeadmin:user") {
        refreshNotifications();
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Load notifications when it first loads if needed
  useEffect(() => {
    if (currentState.items.length === 0) {
      refreshNotifications();
    }
  }, [currentState.items.length]);

  /**
   * Mark all notifications as read
   */
  function markAllRead() {
    const user = getCurrentUser();
    if (!user) return;

    // Update persistent storage
    markAllReadFor(user);

    // Update local state
    const items = getNotificationsFor(user);
    state = {
      items,
      unread: computeUnread(items),
    };

    notifyListeners();
  }

  /**
   * Mark single notification as read
   * @param {number} id - Notification ID
   */
  function markRead(id) {
    const user = getCurrentUser();
    if (!user) return;

    // Update persistent storage
    markReadFor(user, id);

    // Update local state
    const items = getNotificationsFor(user);
    state = {
      items,
      unread: computeUnread(items),
    };

    notifyListeners();
  }

  /**
   * Override notifications using server data 
   * Used when hooking up with a real API
   * @param {Array} items - Notification array from API
   */
  function setItemsFromServer(items) {
    const user = getCurrentUser();
    if (!user) return;

    setNotificationsFor(user, items || []);

    state = {
      items: items || [],
      unread: computeUnread(items || []),
    };

    notifyListeners();
  }

  return {
    items: currentState.items,
    unread: currentState.unread,
    markAllRead,
    markRead,
    refresh: refreshNotifications,
    setItemsFromServer, // For future API integration
  };
}

/* ========== INITIALIZATION ========== */

// Load initial notifications
refreshNotifications();
