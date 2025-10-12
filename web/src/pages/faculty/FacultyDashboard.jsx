/**
 * FacultyDashboard.jsx
 *
 * Faculty landing page after login
 *
 * FEATURES:
 * - Welcome message with faculty info
 * - Toggle to show/hide feature tiles
 * - Tile visibility preference saved to localStorage
 *
 * NAVIGATION:
 * Provides entry points for faculty features:
 * 1. Approvals - Review student requests
 * 2. Advisees - Manage assigned students
 */

import { useState } from "react";
import { getCurrentUser } from "../../api";
import FacultyTiles from "./FacultyTiles";

export default function FacultyDashboard() {
  const user = getCurrentUser();

  // Persist tile visibility preference
  const [showTiles, setShowTiles] = useState(
    () => localStorage.getItem("showFacultyTiles") !== "false"
  );

  function toggleTiles() {
    const newValue = !showTiles;
    setShowTiles(newValue);
    localStorage.setItem("showFacultyTiles", String(newValue));
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
          Faculty Dashboard
          {user?.username && ` — ${user.username}`}
        </h3>
        <p style={{ opacity: 0.8, marginTop: 0 }}>
          Review student requests, manage advisees, and provide guidance.
        </p>
      </div>

      {/* Feature tiles (conditionally rendered) */}
      {showTiles && <FacultyTiles />}
    </div>
  );
}
