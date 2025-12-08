/**
 * StudentDegreePlan.jsx
 * 
 * Allows students to generate and view their degree plan/schedule
 * with semester-by-semester navigation and notifications
 */

import { useState, useEffect } from "react";
import { getCurrentUser, addNotification } from "../../../api";
import { BookOpen, Calendar, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [currentSemesterIndex, setCurrentSemesterIndex] = useState(0);

  // Group schedule by semester
  const groupedSchedule = schedule ? groupBySemester(schedule) : null;
  const semesterKeys = groupedSchedule ? Object.keys(groupedSchedule) : [];

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
    if (loading) {
      console.log("Already generating, ignoring click");
      return;
    }
    
    setError("");
    setLoading(true);

    const validSelections = selectedDegrees.filter(d => d.degreeFieldOfStudyId !== "");
    
    if (validSelections.length === 0) {
      setError("Please select at least one major or minor");
      setLoading(false);
      return;
    }

    try {
      const studentId = user.userId + 2;
      let endpoint, requestBody;
      
      if (validSelections.length === 1) {
        endpoint = `${API_BASE_URL}/students/${studentId}/plan`;
        requestBody = {
          studentId: studentId,
          degreeFieldOfStudyId: parseInt(validSelections[0].degreeFieldOfStudyId),
          majorMinor: validSelections[0].majorMinor
        };
      } else {
        endpoint = `${API_BASE_URL}/students/${studentId}/plan/multiple`;
        requestBody = {
          degreeSpecialties: validSelections.map(d => ({
            studentId: studentId,
            degreeFieldOfStudyId: parseInt(d.degreeFieldOfStudyId),
            majorMinor: d.majorMinor
          }))
        };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate schedule");
      }

      const data = await response.json();
      setSchedule(data);
      setCurrentSemesterIndex(0);
      
      // Add success notification
      const degreeNames = validSelections.map(d => {
        const option = d.majorMinor === "MAJ" 
          ? DEGREE_OPTIONS.majors.find(m => m.id === parseInt(d.degreeFieldOfStudyId))
          : DEGREE_OPTIONS.minors.find(m => m.id === parseInt(d.degreeFieldOfStudyId));
        return option?.name;
      }).filter(Boolean).join(" + ");
      
      const semesterCount = Object.keys(groupBySemester(data)).length;
      
      addNotification(
        user,
        "Schedule Generated Successfully! 🎓",
        `Your ${degreeNames} schedule has been created with ${data.length} courses across ${semesterCount} semesters.`,
        "success"
      );
      
    } catch (err) {
      console.error("Error generating schedule:", err);
      setError(err.message || "Failed to generate schedule. Please try again.");
      
      // Add error notification
      addNotification(
        user,
        "Schedule Generation Failed",
        err.message || "We couldn't generate your schedule. Please try again or contact your advisor.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Clear schedule
  const handleClearSchedule = async () => {
    if (!window.confirm("Are you sure you want to clear your entire schedule? This cannot be undone.")) {
      return;
    }

    setClearing(true);
    setError("");

    try {
      const studentId = user.userId + 2;
      const response = await fetch(`${API_BASE_URL}/students/${studentId}/plan`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to clear schedule");
      }

      const oldCourseCount = schedule.length;
      setSchedule(null);
      setCurrentSemesterIndex(0);
      
      // Add success notification
      addNotification(
        user,
        "Schedule Cleared",
        `Your previous schedule (${oldCourseCount} courses) has been removed. You can generate a new one anytime.`,
        "info"
      );
      
      console.log("Schedule cleared successfully");
    } catch (err) {
      console.error("Error clearing schedule:", err);
      setError("Failed to clear schedule. Please try again.");
      
      // Add error notification
      addNotification(
        user,
        "Failed to Clear Schedule",
        "We couldn't clear your schedule. Please try again or contact support.",
        "error"
      );
    } finally {
      setClearing(false);
    }
  };

  // Navigate to previous semester
  const goToPreviousSemester = () => {
    if (currentSemesterIndex > 0) {
      setCurrentSemesterIndex(currentSemesterIndex - 1);
    }
  };

  // Navigate to next semester
  const goToNextSemester = () => {
    if (currentSemesterIndex < semesterKeys.length - 1) {
      setCurrentSemesterIndex(currentSemesterIndex + 1);
    }
  };

  // Fetch existing schedule on load
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!user?.userId) return;
      
      try {
        const studentId = user.userId + 2;
        const response = await fetch(`${API_BASE_URL}/students/${studentId}/plan`);
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setSchedule(data);
            
            // Add notification that existing schedule was loaded
            const semesterCount = Object.keys(groupBySemester(data)).length;
            addNotification(
              user,
              "Welcome Back!",
              `Your degree plan with ${data.length} courses across ${semesterCount} semesters is ready to view.`,
              "info"
            );
          }
        }
      } catch (err) {
        console.error("Error fetching schedule:", err);
      }
    };

    fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <BookOpen size={20} />
          Select Your Degrees
        </h2>

        {selectedDegrees.map((degree, index) => (
          <div key={index} style={{ display: "flex", gap: "1rem", marginBottom: "1rem", alignItems: "flex-start" }}>
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
                  ? DEGREE_OPTIONS.majors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)
                  : DEGREE_OPTIONS.minors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)
                }
              </select>
            </div>

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
          <button type="button" className="btn btn-secondary" onClick={addDegreeSelection}>
            <Plus size={16} /> Add Another Degree
          </button>

          <button type="button" className="btn btn-primary" onClick={handleGenerateSchedule} disabled={loading}>
            {loading ? "Generating..." : "Generate Schedule"}
          </button>

          {schedule && schedule.length > 0 && (
            <button
              type="button"
              className="btn"
              onClick={handleClearSchedule}
              disabled={clearing}
              style={{ backgroundColor: "var(--danger, #dc3545)", color: "white", border: "none" }}
            >
              <Trash2 size={16} />
              {clearing ? "Clearing..." : "Clear Schedule"}
            </button>
          )}
        </div>

        {error && <p className="error" style={{ marginTop: "1rem" }}>{error}</p>}
      </div>

      {schedule && schedule.length > 0 && groupedSchedule && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2>Your Course Schedule</h2>
            <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              Total Courses: <strong>{schedule.length}</strong> | Semesters: <strong>{semesterKeys.length}</strong>
            </div>
          </div>

          {/* Semester Navigation */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              padding: "1rem",
              backgroundColor: "var(--background-secondary, #f8f9fa)",
              borderRadius: "8px"
            }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={goToPreviousSemester}
                disabled={currentSemesterIndex === 0}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <ChevronLeft size={20} />
                Previous
              </button>

              <div style={{ textAlign: "center" }}>
                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>
                  {semesterKeys[currentSemesterIndex]}
                </h3>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  {groupedSchedule[semesterKeys[currentSemesterIndex]].length} courses | {
                    groupedSchedule[semesterKeys[currentSemesterIndex]].reduce((sum, c) => sum + (c.creditHours || 0), 0)
                  } credits
                </p>
              </div>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={goToNextSemester}
                disabled={currentSemesterIndex === semesterKeys.length - 1}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Semester dots indicator */}
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: "0.5rem", 
              marginTop: "1rem" 
            }}>
              {semesterKeys.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSemesterIndex(index)}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    border: "none",
                    backgroundColor: index === currentSemesterIndex 
                      ? "var(--primary, #007bff)" 
                      : "var(--border, #dee2e6)",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  aria-label={`Go to ${semesterKeys[index]}`}
                />
              ))}
            </div>
          </div>

          {/* Current Semester Courses */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Course</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Title</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Credits</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Days</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Time</th>
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Instructor</th>
                </tr>
              </thead>
              <tbody>
                {groupedSchedule[semesterKeys[currentSemesterIndex]].map((course, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "0.75rem", fontWeight: "500" }}>
                      {course.courseNum || `Course ${course.courseId}` || "N/A"}
                    </td>
                    <td style={{ padding: "0.75rem" }}>{course.courseName || "Untitled Course"}</td>
                    <td style={{ padding: "0.75rem" }}>{course.creditHours || "N/A"}</td>
                    <td style={{ padding: "0.75rem" }}>{course.days || "TBD"}</td>
                    <td style={{ padding: "0.75rem", fontSize: "0.9rem" }}>
                      {course.startTime && course.endTime 
                        ? `${course.startTime} - ${course.endTime}`
                        : "TBD"}
                    </td>
                    <td style={{ padding: "0.75rem" }}>{course.instructorName || "TBD"}</td>
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

/**
 * Helper function to group courses by semester
 */
function groupBySemester(courses) {
  const grouped = {};
  
  // Sort courses by semester (chronologically)
  const sorted = [...courses].sort((a, b) => {
    const [aYear, bYear] = [parseInt(a.year), parseInt(b.year)];
    if (aYear !== bYear) return aYear - bYear;
    
    // Season order: SPRING (1), SUMMER (2), FALL (3)
    const seasonOrder = { SPRING: 1, SUMMER: 2, FALL: 3 };
    const aSeason = seasonOrder[a.season?.toUpperCase()] || 0;
    const bSeason = seasonOrder[b.season?.toUpperCase()] || 0;
    return aSeason - bSeason;
  });
  
  // Group by semester string
  sorted.forEach(course => {
    const semesterKey = course.semester || "Unknown Semester";
    if (!grouped[semesterKey]) {
      grouped[semesterKey] = [];
    }
    grouped[semesterKey].push(course);
  });
  
  return grouped;
}
