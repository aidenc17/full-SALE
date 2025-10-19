/**
 * StudentDegreePlan.jsx
 *
 * Degree planning tool for students
 *
 * FEATURES:
 * - Pick up to 2 majors and 2 minors
 * - Specify number of semesters (N)
 * - Generate semester-by-semester course plan
 * - Prerequisite enforcement (backend will handle if we decide to do this)
 * - Credit load alerts (less than 11 or over 20 credits)
 * - Extended plan ideas if N semesters aren't enough
 *
 * CURRENT STATE (MVP):
 * - Uses decided upon data for majors/minors (hardcoded options)
 * - generatePlan() gives fake output for demo purposes
 * - Shows overload/underload warnings
 * - Demonstrates how extended plans work
 *
 * FUTURE BACKEND INTEGRATION:
 * - Swap dropdown options with real catalog data
 * - Change generatePlan() to POST to /api/plan
 * - Backend will handle prerequisites and term availability
 * - Keep the UI layout, designed to work with real API responses
 */

import { useState } from "react";

export default function StudentDegreePlan() {
  // Form inputs
  const [majors, setMajors] = useState(["", ""]);
  const [minors, setMinors] = useState(["", ""]);
  const [nSemesters, setNSemesters] = useState("");

  // Generated plan results
  const [plan, setPlan] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [extendedPlan, setExtendedPlan] = useState(null);

  /**
   * Generate degree plan (currently mocked)
   *
   * FUTURE: Replace with API call
   * POST /api/plan { majors, minors, semesters: nSemesters }
   * Response: { plan: [...], warnings: [...], extendedPlan?: [...] }
   */
  function generatePlan() {
    // Mock plan generation for demo
    const mockPlan = [
      {
        term: "Fall 2025",
        credits: 15,
        courses: ["ABC 2211", "ABC 2212", "ABC 2570", "Gen Ed A"],
      },
      {
        term: "Spring 2026",
        credits: 21, // Overload - requires approval
        courses: ["ABC 4435", "ABC 3646", "Gen Ed B"],
      },
      {
        term: "Fall 2026",
        credits: 9, // Underload - requires approval
        courses: ["ABC 3410", "Gen Ed C"],
      },
    ];

    setPlan(mockPlan);
    setExtendedPlan(null);

    // Check for credit load warnings
    const loadWarnings = mockPlan
      .filter((term) => term.credits < 11 || term.credits > 20)
      .map(
        (term) =>
          `${term.term}: ${term.credits} credits (requires faculty approval)`
      );
    setWarnings(loadWarnings);

    // Demo: Show extended plan if N too short
    if (nSemesters < 3) {
      setExtendedPlan([
        ...mockPlan,
        {
          term: "Spring 2027",
          credits: 14,
          courses: ["ABC Capstone", "Gen Ed D"],
        },
        {
          term: "Summer 2027", // Only if needed
          credits: 3,
          courses: ["Elective (summer only if needed)"],
        },
      ]);
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ marginTop: 16, maxWidth: 560 }}>
        <h3 style={{ marginBottom: 10 }}>Degree Plan</h3>

        {/* Plan setup form */}
        <form
          className="form-stack"
          onSubmit={(e) => {
            e.preventDefault();
            generatePlan();
          }}
        >
          {/* Major (required) */}
          <div className="form-field">
            <label className="form-label" htmlFor="major">
              Major<span style={{ color: "var(--accent)" }}> *</span>
            </label>
            <select
              id="major"
              className="select"
              value={majors[0]}
              onChange={(e) => setMajors([e.target.value, majors[1]])}
              required
            >
              <option value="">Select major</option>
              <option value="Business">Business</option>
              <option value="Economics">Economics</option>
            </select>
          </div>

          {/* Minor (optional) */}
          <div className="form-field">
            <label className="form-label" htmlFor="minor">
              Minor
            </label>
            <select
              id="minor"
              className="select"
              value={minors[0]}
              onChange={(e) => setMinors([e.target.value, minors[1]])}
            >
              <option value="">(optional)</option>
              <option value="Marketing">Marketing</option>
              <option value="Entrepreneurship">Entrepreneurship</option>
            </select>
          </div>

          {/* Number of semesters */}
          <div className="full">
            <label className="form-label" htmlFor="semesters">
              Number of Semesters (N)
            </label>
            <input
              id="semesters"
              className="input"
              type="number"
              placeholder="Enter the number of semesters you would like to finish in."
              min={1}
              max={14}
              value={nSemesters}
              onChange={(e) => setNSemesters(e.target.value)}
              required
            />
          </div>

          <div className="full">
            <button
              className="btn btn-primary"
              type="submit"
              style={{ display: "block", margin: "0 auto" }}
            >
              Create a plan
            </button>
          </div>
        </form>

        {/* Credit load warnings */}
        {warnings.length > 0 && (
          <div
            className="card"
            style={{ marginTop: 12, background: "var(--active-bg)" }}
          >
            <strong>⚠️ Credit Load Warnings</strong>
            <ul style={{ marginTop: 8 }}>
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggested Plan */}
        {plan && (
          <div className="card" style={{ marginTop: 12 }}>
            <strong>Suggested Plan</strong>
            <ul style={{ marginTop: 8 }}>
              {plan.map((term, index) => (
                <li key={index}>
                  <b>{term.term}</b>: {term.credits} credits —{" "}
                  {term.courses.join(", ")}
                </li>
              ))}
            </ul>
            <p style={{ opacity: 0.8, marginTop: 8 }}>
              Prerequisites ignored as per requirements.
            </p>
          </div>
        )}

        {/* Extended plan (when N semesters aren't enough) */}
        {extendedPlan && (
          <div className="card" style={{ marginTop: 12 }}>
            <strong>📅 Proposed Extended Plan</strong>
            <p style={{ opacity: 0.9, marginTop: 4 }}>
              Cannot finish in {nSemesters} semesters. Here's an extended plan:
            </p>
            <ul style={{ marginTop: 8 }}>
              {extendedPlan.map((term, index) => (
                <li key={index}>
                  <b>{term.term}</b>: {term.credits} credits —{" "}
                  {term.courses.join(", ")}
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="btn btn-primary">Approve Extension</button>
              <button className="btn btn-ghost">Reject</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
