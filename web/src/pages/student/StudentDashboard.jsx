/**
 * StudentDashboard.jsx
 * 
 * Student landing page after login
 * 
 * FEATURES:
 * - Welcome message with user info
 * - Toggle to show/hide feature tiles
 * - Tile visibility preference saved to localStorage
 * 
 * NAVIGATION:
 * Provides three main entry points:
 * 1. Degree Plan - Course planning
 * 2. Requests - Co-op and credit requests
 * 3. Notifications - Faculty communications
 */

import { useState } from "react";
import { getCurrentUser } from "../../api";
import DashboardTiles from "./DashboardTiles";

export default function StudentDashboard() {
  const user = getCurrentUser();

  // Persist tile visibility preference
  const [showTiles, setShowTiles] = useState(
    () => localStorage.getItem("showStudentTiles") !== "false"
  );

  function toggleTiles() {
    const newValue = !showTiles;
    setShowTiles(newValue);
    localStorage.setItem("showStudentTiles", String(newValue));
  }

  return (
    <div className="container">
      {/* Tile toggle button */}
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}
      >
        <button className="btn btn-ghost" onClick={toggleTiles}>
          {showTiles ? "Hide tiles" : "Show tiles"}
        </button>
      </div>

      {/* Welcome card */}
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginBottom: 4 }}>
          Student Dashboard
          {user?.username && (
            <span style={{ fontSize: "0.9em", opacity: 0.7 }}>
              {` — ${user.username} (${user.role})`}
            </span>
          )}
        </h3>
        <p style={{ opacity: 0.8, marginTop: 0 }}>
          Start with your degree plan, make requests, and check notifications.
        </p>
      </div>

      {/* Feature tiles (conditionally rendered) */}
      {showTiles && <DashboardTiles />}
    </div>
  );
}