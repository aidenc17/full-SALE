/**
 * AdminDashboard.jsx
 *
 * Admin landing page after login
 *
 * FEATURES:
 * - Welcome message with admin info
 * - Toggle to show/hide feature tiles
 * - Tile visibility preference saved to localStorage
 *
 * NAVIGATION:
 * Provides entry points for admin features:
 * 1. Catalog - Manage course catalog
 * 2. Users - User management and permissions
 */

import { useState } from "react";
import { getCurrentUser } from "../../api";
import AdminTiles from "./AdminTiles";

export default function AdminDashboard() {
  const user = getCurrentUser();

  // Persist tile visibility preference
  const [showTiles, setShowTiles] = useState(
    () => localStorage.getItem("showAdminTiles") !== "false"
  );

  function toggleTiles() {
    const newValue = !showTiles;
    setShowTiles(newValue);
    localStorage.setItem("showAdminTiles", String(newValue));
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
          Admin Dashboard
          {user?.username && ` — ${user.username}`}
        </h3>
        <p style={{ opacity: 0.8, marginTop: 0 }}>
          Manage users and maintain the course catalog.
        </p>
      </div>

      {/* Feature tiles (conditionally rendered) */}
      {showTiles && <AdminTiles />}
    </div>
  );
}
