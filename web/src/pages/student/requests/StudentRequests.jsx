/**
 * StudentRequests.jsx
 *
 * Co-op and credit load request submission
 *
 * FEATURES:
 * - Submit co-op term request
 * - Allow/disallow plan extension checkbox
 * - Preview the adjusted plan after submitting
 * - Creates a notification for the student (shows up in the bell instantly)
 *
 * CURRENT STATE (MVP):
 * - Mock plan adjustment (just frontend)
 * - Adds notification to student's localStorage
 * - Refreshes notification store to update the bell badge
 *
 * FUTURE BACKEND INTEGRATION:
 * - Swap out mock with POST /api/requests/coop
 * - Backend will create notifications for both student and faculty
 * - Backend will calculate the real adjusted plan
 * - Call refreshNotifications() after successful POST
 */

import { useState } from "react";
import {
  getCurrentUser,
  getNotificationsFor,
  setNotificationsFor,
} from "../../../api";
import { refreshNotifications } from "../../../notifications.store";

export default function StudentRequests() {
  const [selectedTerm, setSelectedTerm] = useState("");
  const [allowExtension, setAllowExtension] = useState(true);
  const [adjustedPlan, setAdjustedPlan] = useState(null);
  const [requestSaved, setRequestSaved] = useState(false);

  /**
   * Submit co-op request
   *
   * CURRENT: Mock submission with local notification
   * FUTURE: POST /api/requests/coop then refreshNotifications()
   */
  function handleSubmit(e) {
    e.preventDefault();

    // Mock adjusted plan preview
    const mockAdjustedPlan = [
      {
        term: selectedTerm,
        credits: 0,
        courses: ["Full-time Co-op assignment"],
      },
      {
        term: getNextTerm(selectedTerm),
        credits: 18,
        courses: ["CSE 3xxx", "CSE 3yyy", "Gen Ed B"],
      },
    ];
    setAdjustedPlan(mockAdjustedPlan);

    // Add a notification for the student (demo of the notification system)
    const user = getCurrentUser();
    if (user) {
      const existingNotifications = getNotificationsFor(user) || [];

      const newNotification = {
        id: Date.now(), // Temporary ID for demo
        type: "COOP_REQUEST",
        title: "Co-op request submitted",
        detail: `Requested ${selectedTerm || "—"}${
          allowExtension ? " (extension allowed)" : ""
        }. Waiting for faculty review.`,
        when: "Just now",
        unread: true,
        href: "/student/requests",
      };

      // Add a new notification
      const updatedNotifications = [newNotification, ...existingNotifications];
      setNotificationsFor(user, updatedNotifications);

      // Refresh store to update bell badge
      refreshNotifications();
    }

    // Show success indicator
    setRequestSaved(true);
    setTimeout(() => setRequestSaved(false), 2000);
  }

  return (
    <div className="container">
      <div className="card" style={{ marginTop: 16, maxWidth: 560 }}>
        {/* Header with save indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 6,
          }}
        >
          <h3 style={{ margin: 0 }}>Co-op Request</h3>
          {requestSaved && (
            <span style={{ fontSize: 12, opacity: 0.8 }}>Saved ✅</span>
          )}
        </div>

        {/* Request form */}
        <form className="form-stack" onSubmit={handleSubmit}>
          {/* Co-op term selection */}
          <div className="form-field">
            <label className="form-label" htmlFor="coop-term">
              Term
            </label>
            <select
              id="coop-term"
              className="select"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              required
            >
              <option value="">Select term</option>
              <option value="Fall 2025">Fall 2025</option>
              <option value="Spring 2026">Spring 2026</option>
              <option value="Fall 2026">Fall 2026</option>
              <option value="Spring 2027">Spring 2027</option>
            </select>
          </div>

          {/* Plan extension checkbox */}
          <div className="form-field" style={{ marginTop: 35 }}>
            <label
              className="form-label"
              htmlFor="allow-extension"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontWeight: 500,
              }}
            >
              <input
                id="allow-extension"
                type="checkbox"
                checked={allowExtension}
                onChange={(e) => setAllowExtension(e.target.checked)}
              />
              Allow for plan extension if needed
            </label>
          </div>

          {/* Submit button */}
          <div className="full">
          <button
            className="btn btn-primary"
            type="submit"
            style={{ display: "block", margin: "0 auto" }}
            disabled={!selectedTerm}
            title={!selectedTerm ? "Please pick a term" : "Submit request"}
          >
            Submit Request
          </button>
          </div>
        </form>

        {/* Updated Plan Preview */}
        {adjustedPlan && (
          <div className="card" style={{ marginTop: 12 }}>
            <strong>📋 Updated Plan Preview</strong>
            <ul style={{ marginTop: 8 }}>
              {adjustedPlan.map((term, index) => (
                <li key={index}>
                  <b>{term.term}</b>: {term.credits} credits —{" "}
                  {term.courses.join(", ")}
                </li>
              ))}
            </ul>
            <p style={{ opacity: 0.8, marginTop: 8 }}>
              Your faculty advisor will take a look at this request and either
              give the go-ahead, or suggest other options. You'll get a
              notification once they reply.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Get next academic term
 * Helper for making adjusted plan preview
 */
function getNextTerm(term) {
  if (!term) return "Next Term";

  if (term.includes("Fall")) {
    const year = parseInt(term.match(/\d{4}/)[0]);
    return `Spring ${year + 1}`;
  }

  if (term.includes("Spring")) {
    const year = parseInt(term.match(/\d{4}/)[0]);
    return `Fall ${year}`;
  }

  return "Next Term";
}
