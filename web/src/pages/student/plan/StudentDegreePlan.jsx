/**
 * StudentDegreePlan.jsx
 * 
 * Allows students to generate and view their degree plan/schedule
 * with semester-by-semester navigation and notifications
 */

import { useState, useEffect } from "react";
import { getCurrentUser, addNotification } from "../../../api";
import { BookOpen, Calendar, Plus, Trash2, ChevronLeft, ChevronRight, Download } from "lucide-react";

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
  const [includeSummer, setIncludeSummer] = useState(true); // Option to include/exclude summer
  const [targetGraduation, setTargetGraduation] = useState(""); // Target graduation semester (format: "SPRING-2030" or empty for ASAP)
  const [numberOfCoops, setNumberOfCoops] = useState(0); // Number of co-op semesters (0-3)
  const [searchQuery, setSearchQuery] = useState(""); // Search filter for courses
  const [grades, setGrades] = useState({}); // Track grades for GPA calculation { "courseId-sectionId": "A" }

  // Grade point values
  const gradePoints = {
    "A": 4.0,
    "A-": 3.7,
    "B+": 3.3,
    "B": 3.0,
    "B-": 2.7,
    "C+": 2.3,
    "C": 2.0,
    "C-": 1.7,
    "D+": 1.3,
    "D": 1.0,
    "F": 0.0
  };

  // Calculate GPA for a semester or overall
  const calculateGPA = (courses) => {
    const gradedCourses = courses.filter(c => {
      const key = `${c.courseId}-${c.sectionId}`;
      return grades[key] && c.creditHours > 0 && c.courseNum !== "COOP";
    });

    if (gradedCourses.length === 0) return null;

    const totalPoints = gradedCourses.reduce((sum, c) => {
      const key = `${c.courseId}-${c.sectionId}`;
      const grade = grades[key];
      return sum + (gradePoints[grade] * c.creditHours);
    }, 0);

    const totalCredits = gradedCourses.reduce((sum, c) => sum + c.creditHours, 0);

    return (totalPoints / totalCredits).toFixed(2);
  };

  // Get workload indicator for a semester
  const getWorkloadIndicator = (courses) => {
    const totalCredits = courses
      .filter(c => c.courseNum !== "COOP")
      .reduce((sum, c) => sum + (c.creditHours || 0), 0);
    
    if (totalCredits === 0) return { label: "Co-op", color: "#17a2b8", level: "info" };
    if (totalCredits >= 18) return { label: "Heavy Load", color: "#dc3545", level: "heavy" };
    if (totalCredits >= 15) return { label: "Full Load", color: "#ffc107", level: "full" };
    if (totalCredits >= 12) return { label: "Moderate Load", color: "#28a745", level: "moderate" };
    return { label: "Light Load", color: "#007bff", level: "light" };
  };
  
  // Generate graduation options (next 10 years, 3 semesters per year)
  const graduationOptions = [];
  const currentYear = 2026;
  for (let year = currentYear; year < currentYear + 10; year++) {
    graduationOptions.push({ value: `SPRING-${year}`, label: `Spring ${year}` });
    graduationOptions.push({ value: `SUMMER-${year}`, label: `Summer ${year}` });
    graduationOptions.push({ value: `FALL-${year}`, label: `Fall ${year}` });
  }

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
          majorMinor: validSelections[0].majorMinor,
          includeSummer: includeSummer,
          targetGraduation: targetGraduation || null,
          numberOfCoops: numberOfCoops
        };
      } else {
        endpoint = `${API_BASE_URL}/students/${studentId}/plan/multiple`;
        requestBody = {
          degreeSpecialties: validSelections.map(d => ({
            studentId: studentId,
            degreeFieldOfStudyId: parseInt(d.degreeFieldOfStudyId),
            majorMinor: d.majorMinor
          })),
          includeSummer: includeSummer,
          targetGraduation: targetGraduation || null,
          numberOfCoops: numberOfCoops
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
      
      // Add success notification with optimization info
      const degreeNames = validSelections.map(d => {
        const option = d.majorMinor === "MAJ" 
          ? DEGREE_OPTIONS.majors.find(m => m.id === parseInt(d.degreeFieldOfStudyId))
          : DEGREE_OPTIONS.minors.find(m => m.id === parseInt(d.degreeFieldOfStudyId));
        return option?.name;
      }).filter(Boolean).join(" + ");
      
      const grouped = groupBySemester(data);
      const semesterCount = Object.keys(grouped).length;
      const avgCoursesPerSemester = (data.length / semesterCount).toFixed(1);
      
      // Calculate graduation timeline
      const semesters = Object.keys(grouped).sort();
      const lastSemester = semesters[semesters.length - 1];
      
      // Check for heavy semesters (>15 credit hours)
      const heavySemesters = [];
      Object.keys(grouped).forEach(semKey => {
        const semesterCredits = grouped[semKey].reduce((sum, c) => sum + (c.creditHours || 0), 0);
        if (semesterCredits > 15) {
          heavySemesters.push({ semester: semKey, credits: semesterCredits });
        }
      });
      
      // Base notification message
      let message = `Your ${degreeNames} schedule is optimized for efficiency: ${data.length} courses across ${semesterCount} semesters (${avgCoursesPerSemester} avg per semester). Expected completion: ${lastSemester}.`;
      
      // Add warning if there are heavy semesters
      if (heavySemesters.length > 0) {
        const heavyList = heavySemesters.map(s => `${s.semester} (${s.credits} credits)`).join(", ");
        message += ` ⚠️ Note: Some semesters exceed 15 credits: ${heavyList}. Consider adjusting your workload.`;
      }
      
      addNotification(
        user,
        "Schedule Generated Successfully!",
        message,
        heavySemesters.length > 0 ? "warning" : "success"
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

  // Check if a course matches the search query
  const courseMatchesSearch = (course) => {
    if (!searchQuery.trim()) return true; // No search = show all
    
    const query = searchQuery.toLowerCase();
    const courseName = (course.courseName || "").toLowerCase();
    const courseNum = (course.courseNum || "").toLowerCase();
    const instructor = (course.instructorName || "").toLowerCase();
    
    return courseName.includes(query) || 
           courseNum.includes(query) || 
           instructor.includes(query);
  };

  // Find first semester with matching courses
  const findFirstMatchingSemester = () => {
    if (!searchQuery.trim() || !groupedSchedule) return;
    
    for (let i = 0; i < semesterKeys.length; i++) {
      const semesterCourses = groupedSchedule[semesterKeys[i]];
      if (semesterCourses.some(courseMatchesSearch)) {
        setCurrentSemesterIndex(i);
        return;
      }
    }
  };

  // Auto-jump to first match when search changes
  useEffect(() => {
    if (searchQuery.trim() && groupedSchedule) {
      findFirstMatchingSemester();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, groupedSchedule]);

  // Handle grade change for a course
  const handleGradeChange = (courseId, sectionId, grade) => {
    const key = `${courseId}-${sectionId}`;
    setGrades(prev => ({
      ...prev,
      [key]: grade
    }));
  };

  // Export schedule to PDF
  const handleExportPDF = () => {
    if (!schedule || !groupedSchedule) return;

    // Create a simple HTML document for printing
    const printWindow = window.open('', '', 'width=800,height=600');
    
    const degreeNames = selectedDegrees
      .filter(d => d.degreeFieldOfStudyId)
      .map(d => {
        const option = d.majorMinor === "MAJ" 
          ? DEGREE_OPTIONS.majors.find(m => m.id === parseInt(d.degreeFieldOfStudyId))
          : DEGREE_OPTIONS.minors.find(m => m.id === parseInt(d.degreeFieldOfStudyId));
        return option?.name;
      })
      .filter(Boolean)
      .join(" + ");

    const totalCredits = schedule.reduce((sum, c) => sum + (c.creditHours || 0), 0);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Degree Plan - ${user?.username || 'Student'}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              max-width: 1000px;
              margin: 0 auto;
            }
            h1 {
              color: #333;
              border-bottom: 3px solid #007bff;
              padding-bottom: 10px;
            }
            .header-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              padding: 15px;
              background: #f8f9fa;
              border-radius: 5px;
            }
            .semester {
              page-break-inside: avoid;
              margin-bottom: 30px;
            }
            .semester-title {
              background: #007bff;
              color: white;
              padding: 10px 15px;
              font-size: 18px;
              font-weight: bold;
              border-radius: 5px 5px 0 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th {
              background: #e9ecef;
              padding: 10px;
              text-align: left;
              border: 1px solid #dee2e6;
              font-weight: bold;
            }
            td {
              padding: 8px 10px;
              border: 1px solid #dee2e6;
            }
            tr:nth-child(even) {
              background: #f8f9fa;
            }
            .coop-row {
              background: #e7f3ff !important;
              font-weight: bold;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #6c757d;
              font-size: 12px;
              border-top: 1px solid #dee2e6;
              padding-top: 10px;
            }
            @media print {
              body { padding: 20px; }
              .semester { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>Course Schedule - ${degreeNames || 'Degree Plan'}</h1>
          
          <div class="header-info">
            <div>
              <strong>Student:</strong> ${user?.username || 'N/A'}<br>
              <strong>Total Courses:</strong> ${schedule.length}<br>
              <strong>Total Credits:</strong> ${totalCredits}
            </div>
            <div style="text-align: right;">
              <strong>Semesters:</strong> ${semesterKeys.length}<br>
              <strong>Generated:</strong> ${new Date().toLocaleDateString()}<br>
              <strong>Co-ops:</strong> ${numberOfCoops}
            </div>
          </div>

          ${semesterKeys.map(semKey => {
            const courses = groupedSchedule[semKey];
            const semesterCredits = courses.reduce((sum, c) => sum + (c.creditHours || 0), 0);
            
            return `
              <div class="semester">
                <div class="semester-title">
                  ${semKey} - ${courses.length} Course${courses.length !== 1 ? 's' : ''} (${semesterCredits} Credits)
                </div>
                <table>
                  <thead>
                    <tr>
                      <th style="width: 12%;">Course</th>
                      <th style="width: 35%;">Title</th>
                      <th style="width: 10%;">Credits</th>
                      <th style="width: 10%;">Days</th>
                      <th style="width: 18%;">Time</th>
                      <th style="width: 15%;">Instructor</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${courses.map(course => {
                      const isCoop = course.courseNum === "COOP";
                      return `
                        <tr class="${isCoop ? 'coop-row' : ''}">
                          <td>${course.courseNum || 'N/A'}</td>
                          <td>${course.courseName || 'Untitled Course'}</td>
                          <td>${course.creditHours || 0}</td>
                          <td>${course.days || (isCoop ? 'Full-time' : 'TBD')}</td>
                          <td>${course.startTime && course.endTime ? course.startTime + ' - ' + course.endTime : (isCoop ? 'Work Experience' : 'TBD')}</td>
                          <td>${course.instructorName || 'TBD'}</td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            `;
          }).join('')}

          <div class="footer">
            Generated by DegreeAdmin on ${new Date().toLocaleString()}<br>
            This schedule is subject to change. Please verify with your academic advisor.
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait a moment for content to load, then trigger print dialog
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 250);
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

        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={includeSummer}
              onChange={(e) => setIncludeSummer(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            <span>Include summer semesters (uncheck to take summers off)</span>
          </label>
        </div>

        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <label className="form-label">Target Graduation (optional)</label>
          <select
            className="input"
            value={targetGraduation}
            onChange={(e) => setTargetGraduation(e.target.value)}
            style={{ maxWidth: "300px" }}
          >
            <option value="">As soon as possible (ASAP)</option>
            {graduationOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Select a target semester to graduate by. Max 6 courses per semester.
          </p>
        </div>

        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <label className="form-label">Number of Co-op Semesters</label>
          <select
            className="input"
            value={numberOfCoops}
            onChange={(e) => setNumberOfCoops(parseInt(e.target.value))}
            style={{ maxWidth: "300px" }}
          >
            <option value={0}>0 - No co-ops</option>
            <option value={1}>1 co-op semester</option>
            <option value={2}>2 co-op semesters</option>
            <option value={3}>3 co-op semesters</option>
          </select>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Co-op semesters have no classes - you'll work full-time instead.
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button type="button" className="btn btn-secondary" onClick={addDegreeSelection}>
            <Plus size={16} /> Add Another Degree
          </button>

          <button type="button" className="btn btn-primary" onClick={handleGenerateSchedule} disabled={loading}>
            {loading ? "Generating..." : "Generate Schedule"}
          </button>

          {schedule && schedule.length > 0 && (
            <>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleExportPDF}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Download size={16} />
                Export PDF
              </button>
              
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
            </>
          )}
        </div>

        {error && <p className="error" style={{ marginTop: "1rem" }}>{error}</p>}
      </div>

      {schedule && schedule.length > 0 && groupedSchedule && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2>Your Course Schedule</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleExportPDF}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Download size={16} />
                Export PDF
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                {(() => {
                  const cumulativeGPA = calculateGPA(schedule);
                  const totalCredits = schedule.filter(c => c.courseNum !== "COOP").reduce((sum, c) => sum + (c.creditHours || 0), 0);
                  const completedCredits = schedule.filter(c => {
                    const key = `${c.courseId}-${c.sectionId}`;
                    return grades[key] && c.courseNum !== "COOP";
                  }).reduce((sum, c) => sum + (c.creditHours || 0), 0);
                  
                  return (
                    <>
                      {cumulativeGPA && (
                        <div style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "8px",
                          backgroundColor: "#28a745",
                          color: "white",
                          fontSize: "0.9rem",
                          fontWeight: "600"
                        }}>
                          Cumulative GPA: {cumulativeGPA}
                        </div>
                      )}
                      <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                        {cumulativeGPA && `${completedCredits}/${totalCredits} credits | `}
                        <strong>{schedule.length}</strong> courses | <strong>{semesterKeys.length}</strong> semesters
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* GPA Calculator Instructions */}
          {Object.keys(grades).length === 0 && (
            <div style={{
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              fontSize: "0.9rem"
            }}>
            </div>
          )}

          {/* Search Box */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ position: "relative", maxWidth: "500px" }}>
              <input
                type="text"
                className="input"
                placeholder="🔍 Search courses by name, number, or instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  paddingRight: searchQuery ? "2.5rem" : "1rem",
                  width: "100%"
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: "0.5rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    fontSize: "1.2rem",
                    padding: "0.25rem 0.5rem"
                  }}
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>
            {searchQuery && (() => {
              const totalMatches = schedule.filter(courseMatchesSearch).length;
              const semestersWithMatches = semesterKeys.filter(semKey => 
                groupedSchedule[semKey].some(courseMatchesSearch)
              ).length;
              
              return (
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
                  Found <strong>{totalMatches}</strong> course{totalMatches !== 1 ? 's' : ''} 
                  {' '}across <strong>{semestersWithMatches}</strong> semester{semestersWithMatches !== 1 ? 's' : ''}
                  {totalMatches > 0 && " (highlighted in yellow)"}
                </p>
              );
            })()}
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

              <div style={{ textAlign: "center", flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>
                  {semesterKeys[currentSemesterIndex]}
                </h3>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  gap: "1rem",
                  marginTop: "0.5rem",
                  flexWrap: "wrap"
                }}>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    {groupedSchedule[semesterKeys[currentSemesterIndex]].length} courses | {
                      groupedSchedule[semesterKeys[currentSemesterIndex]].reduce((sum, c) => sum + (c.creditHours || 0), 0)
                    } credits
                  </p>
                  
                  {(() => {
                    const currentCourses = groupedSchedule[semesterKeys[currentSemesterIndex]];
                    const workload = getWorkloadIndicator(currentCourses);
                    const semesterGPA = calculateGPA(currentCourses);
                    
                    return (
                      <>
                        <span style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "12px",
                          backgroundColor: workload.color,
                          color: "white",
                          fontSize: "0.75rem",
                          fontWeight: "600"
                        }}>
                          {workload.label}
                        </span>
                        
                        {semesterGPA && (
                          <span style={{
                            padding: "0.25rem 0.75rem",
                            borderRadius: "12px",
                            backgroundColor: "#6c757d",
                            color: "white",
                            fontSize: "0.75rem",
                            fontWeight: "600"
                          }}>
                            GPA: {semesterGPA}
                          </span>
                        )}
                      </>
                    );
                  })()}
                </div>
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
              {semesterKeys.map((semKey, index) => {
                const hasMatches = searchQuery.trim() && 
                                   groupedSchedule[semKey].some(courseMatchesSearch);
                
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentSemesterIndex(index)}
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      border: hasMatches ? "2px solid var(--warning, #ffc107)" : "none",
                      backgroundColor: index === currentSemesterIndex 
                        ? "var(--primary, #007bff)" 
                        : hasMatches
                          ? "var(--warning, #ffc107)"
                          : "var(--border, #dee2e6)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      transform: hasMatches ? "scale(1.3)" : "scale(1)"
                    }}
                    aria-label={`Go to ${semesterKeys[index]}${hasMatches ? ' (has matches)' : ''}`}
                    title={hasMatches ? `${semKey} - Has matching courses` : semKey}
                  />
                );
              })}
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
                  <th style={{ padding: "0.75rem", textAlign: "left" }}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {groupedSchedule[semesterKeys[currentSemesterIndex]]
                  .filter(course => courseMatchesSearch(course))
                  .map((course, index) => {
                    const isCoop = course.courseNum === "COOP" || course.courseName === "Co-op";
                    const isMatch = searchQuery.trim() && courseMatchesSearch(course);
                    
                    return (
                      <tr 
                        key={index} 
                        style={{ 
                          borderBottom: "1px solid var(--border)",
                          backgroundColor: isCoop 
                            ? "var(--info-bg, #e7f3ff)" 
                            : isMatch 
                              ? "var(--warning-bg, #fff3cd)" 
                              : "transparent",
                          transition: "background-color 0.2s"
                        }}
                      >
                        <td style={{ 
                          padding: "0.75rem", 
                          fontWeight: (isCoop || isMatch) ? "600" : "500" 
                        }}>
                          {course.courseNum || `Course ${course.courseId}` || "N/A"}
                        </td>
                        <td style={{ 
                          padding: "0.75rem", 
                          fontWeight: (isCoop || isMatch) ? "600" : "normal" 
                        }}>
                          {course.courseName || "Untitled Course"}
                        </td>
                        <td style={{ padding: "0.75rem" }}>{course.creditHours || "N/A"}</td>
                        <td style={{ padding: "0.75rem" }}>{course.days || (isCoop ? "Full-time" : "TBD")}</td>
                        <td style={{ padding: "0.75rem", fontSize: "0.9rem" }}>
                          {course.startTime && course.endTime 
                            ? `${course.startTime} - ${course.endTime}`
                            : (isCoop ? "Work Experience" : "TBD")}
                        </td>
                        <td style={{ padding: "0.75rem" }}>{course.instructorName || "TBD"}</td>
                        <td style={{ padding: "0.75rem" }}>
                          {!isCoop ? (
                            <select
                              value={grades[`${course.courseId}-${course.sectionId}`] || ""}
                              onChange={(e) => handleGradeChange(course.courseId, course.sectionId, e.target.value)}
                              style={{
                                padding: "0.25rem 0.5rem",
                                borderRadius: "4px",
                                border: "1px solid var(--border)",
                                backgroundColor: "white",
                                fontSize: "0.875rem",
                                cursor: "pointer"
                              }}
                            >
                              <option value="">-</option>
                              <option value="A">A (4.0)</option>
                              <option value="A-">A- (3.7)</option>
                              <option value="B+">B+ (3.3)</option>
                              <option value="B">B (3.0)</option>
                              <option value="B-">B- (2.7)</option>
                              <option value="C+">C+ (2.3)</option>
                              <option value="C">C (2.0)</option>
                              <option value="C-">C- (1.7)</option>
                              <option value="D+">D+ (1.3)</option>
                              <option value="D">D (1.0)</option>
                              <option value="F">F (0.0)</option>
                            </select>
                          ) : (
                            <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>N/A</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                {searchQuery.trim() && 
                 groupedSchedule[semesterKeys[currentSemesterIndex]].filter(courseMatchesSearch).length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
                      No courses found in this semester matching "{searchQuery}"
                    </td>
                  </tr>
                )}
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