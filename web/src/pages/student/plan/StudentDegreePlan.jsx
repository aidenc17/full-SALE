/**
 * StudentDegreePlan.jsx
 * 
 * Allows students to generate and view their degree plan/schedule
 */

import { useState, useEffect } from "react";
import { getCurrentUser } from "../../../api";
import { BookOpen, Calendar, Plus, Trash2 } from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

// Available majors and minors
const DEGREE_OPTIONS = {
  majors: [
    { id: 15, name: "Business" },
    { id: 19, name: "Economics" }
  ],
  minors: [
    { id: 18, name: "Marketing" },
    { id: 38, name: "Entrepreneurship" }
  ]
};

export default function StudentDegreePlan() {
  const user = getCurrentUser();
  const [selectedDegrees, setSelectedDegrees] = useState([
    { degreeFieldOfStudyId: "", majorMinor: "MAJ" }
  ]);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState("");

  // Add a new degree selection
  const addDegreeSelection = () => {
    setSelectedDegrees([
      ...selectedDegrees,
      { degreeFieldOfStudyId: "", majorMinor: "MAJ" }
    ]);
  };

  // Remove a degree selection
  const removeDegreeSelection = (index) => {
    if (selectedDegrees.length > 1) {
      setSelectedDegrees(selectedDegrees.filter((_, i) => i !== index));
    }
  };

  // Update a degree selection
  const updateDegreeSelection = (index, field, value) => {
    const updated = [...selectedDegrees];
    updated[index][field] = value;
    setSelectedDegrees(updated);
  };

  // Generate schedule
  const handleGenerateSchedule = async () => {
    setError("");
    setLoading(true);

    // Validate selections
    const validSelections = selectedDegrees.filter(d => d.degreeFieldOfStudyId !== "");
    if (validSelections.length === 0) {
      setError("Please select at least one major or minor");
      setLoading(false);
      return;
    }

    try {
      // Get student ID from user (assuming it's stored in user object)
      const studentId = user.userId; // Adjust if your user object has different structure

      // Determine endpoint and body based on number of selections
      let endpoint, requestBody;
      
      console.log("Using Student ID:", studentId, "(User ID:", user.userId, "+ 2)");
      
      if (validSelections.length === 1) {
        // Single degree - send just the degree object
        endpoint = `${API_BASE_URL}/students/${studentId}/plan`;
        requestBody = {
          studentId: studentId,  // This is now the correct Student_Id (User_Id + 2)
          degreeFieldOfStudyId: parseInt(validSelections[0].degreeFieldOfStudyId),
          majorMinor: validSelections[0].majorMinor
        };
      } else {
        // Multiple degrees - send degreeSpecialties array
        endpoint = `${API_BASE_URL}/students/${studentId}/plan/multiple`;
        requestBody = {
          degreeSpecialties: validSelections.map(d => ({
            studentId: studentId,  // This is now the correct Student_Id (User_Id + 2)
            degreeFieldOfStudyId: parseInt(d.degreeFieldOfStudyId),
            majorMinor: d.majorMinor
          }))
        };
      }

      console.log("Generating schedule with:", requestBody);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate schedule");
      }

      const data = await response.json();
      setSchedule(data);
      console.log("Schedule generated:", data);
    } catch (err) {
      console.error("Error generating schedule:", err);
      setError(err.message || "Failed to generate schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch existing schedule on load (only once)
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!user?.userId) return;
      
      try {
        // IMPORTANT: Convert User_Id to Student_Id (Student_Id = User_Id + 2)
        const studentId = user.userId + 2;
        const response = await fetch(`${API_BASE_URL}/students/${studentId}/plan`);
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setSchedule(data);
          }
        }
      } catch (err) {
        console.error("Error fetching schedule:", err);
      }
    };

    fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Calendar size={28} />
            My Degree Plan
          </h1>
          <p className="page-subtitle">
            Generate your personalized course schedule based on your major(s) and minor(s)
          </p>
        </div>
      </div>

      {/* Degree Selection Form */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <BookOpen size={20} />
          Select Your Degrees
        </h2>

        {selectedDegrees.map((degree, index) => (
          <div key={index} style={{ 
            display: "flex", 
            gap: "1rem", 
            marginBottom: "1rem",
            alignItems: "flex-start"
          }}>
            {/* Major/Minor Type */}
            <div className="form-field" style={{ flex: "0 0 150px" }}>
              <label className="form-label">Type</label>
              <select
                className="input"
                value={degree.majorMinor}
                onChange={(e) => updateDegreeSelection(index, "majorMinor", e.target.value)}
              >
                <option value="MAJ">Major</option>
                <option value="MIN">Minor</option>
              </select>
            </div>

            {/* Degree Selection */}
            <div className="form-field" style={{ flex: "1" }}>
              <label className="form-label">
                {degree.majorMinor === "MAJ" ? "Major" : "Minor"}
              </label>
              <select
                className="input"
                value={degree.degreeFieldOfStudyId}
                onChange={(e) => updateDegreeSelection(index, "degreeFieldOfStudyId", e.target.value)}
              >
                <option value="">Select a {degree.majorMinor === "MAJ" ? "major" : "minor"}</option>
                {degree.majorMinor === "MAJ" 
                  ? DEGREE_OPTIONS.majors.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))
                  : DEGREE_OPTIONS.minors.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))
                }
              </select>
            </div>

            {/* Remove Button */}
            {selectedDegrees.length > 1 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => removeDegreeSelection(index)}
                style={{ marginTop: "1.75rem" }}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addDegreeSelection}
          >
            <Plus size={16} />
            Add Another Degree
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleGenerateSchedule}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Schedule"}
          </button>

          {schedule && schedule.length > 0 && (
            <button
              type="button"
              className="btn"
              onClick={handleClearSchedule}
              disabled={clearing}
              style={{ 
                backgroundColor: "var(--danger, #dc3545)", 
                color: "white",
                border: "none"
              }}
            >
              <Trash2 size={16} />
              {clearing ? "Clearing..." : "Clear Schedule"}
            </button>
          )}
        </div>

        {error && (
          <p className="error" style={{ marginTop: "1rem" }}>
            {error}
          </p>
        )}
      </div>

      {/* Schedule Display */}
      {schedule && schedule.length > 0 && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2>Your Course Schedule</h2>
            <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              Total Courses: <strong>{schedule.length}</strong>
            </div>
          </div>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Course</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Title</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Credits</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Semester</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((course, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "0.75rem" }}>
                      {course.courseNum || `Course ${course.courseId}` || "N/A"}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      {course.courseName || "Untitled Course"}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      {course.creditHours || "N/A"}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      {course.semester || "TBD"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {schedule && schedule.length === 0 && (
        <div className="card">
          <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>
            No schedule generated yet. Select your degrees above and click "Generate Schedule".
          </p>
        </div>
      )}
    </div>
  );
}