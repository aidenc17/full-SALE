/**
 * StudentGPACalculator.jsx
 * 
 * Comprehensive GPA calculator with what-if scenarios and semester planning
 */

import { useState } from "react";
import { Calculator, TrendingUp, Plus, Trash2, Award, Target } from "lucide-react";

export default function StudentGPACalculator() {
  
  // Current GPA state
  const [currentGPA, setCurrentGPA] = useState("");
  const [completedCredits, setCompletedCredits] = useState("");
  
  // Planned courses
  const [plannedCourses, setPlannedCourses] = useState([
    { id: 1, name: "", credits: 3, expectedGrade: "" }
  ]);
  
  // What-if scenarios
  const [targetGPA, setTargetGPA] = useState("");
  const [remainingCredits, setRemainingCredits] = useState("");

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

  // Calculate projected GPA with planned courses
  const calculateProjectedGPA = () => {
    if (!currentGPA || !completedCredits) return null;

    const validCourses = plannedCourses.filter(c => 
      c.credits > 0 && c.expectedGrade && gradePoints[c.expectedGrade] !== undefined
    );

    if (validCourses.length === 0) return null;

    const currentPoints = parseFloat(currentGPA) * parseFloat(completedCredits);
    const plannedCredits = validCourses.reduce((sum, c) => sum + parseFloat(c.credits), 0);
    const plannedPoints = validCourses.reduce((sum, c) => 
      sum + (gradePoints[c.expectedGrade] * parseFloat(c.credits)), 0
    );

    const totalCredits = parseFloat(completedCredits) + plannedCredits;
    const totalPoints = currentPoints + plannedPoints;
    const projectedGPA = totalPoints / totalCredits;

    return {
      projectedGPA: projectedGPA.toFixed(3),
      plannedCredits,
      totalCredits,
      change: (projectedGPA - parseFloat(currentGPA)).toFixed(3)
    };
  };

  // Calculate required GPA for target
  const calculateRequiredGPA = () => {
    if (!currentGPA || !completedCredits || !targetGPA || !remainingCredits) return null;

    const currentPoints = parseFloat(currentGPA) * parseFloat(completedCredits);
    const totalCredits = parseFloat(completedCredits) + parseFloat(remainingCredits);
    const targetPoints = parseFloat(targetGPA) * totalCredits;
    const requiredPoints = targetPoints - currentPoints;
    const requiredGPA = requiredPoints / parseFloat(remainingCredits);

    return {
      requiredGPA: requiredGPA.toFixed(3),
      feasible: requiredGPA <= 4.0 && requiredGPA >= 0,
      difficulty: requiredGPA >= 3.7 ? "Very Difficult (mostly A's needed)" :
                  requiredGPA >= 3.3 ? "Challenging (mostly A's and B's)" :
                  requiredGPA >= 3.0 ? "Achievable (mix of A's, B's)" :
                  requiredGPA >= 2.0 ? "Moderate (avoid D's and F's)" :
                  "Easy (minimal effort needed)"
    };
  };

  const projected = calculateProjectedGPA();
  const required = calculateRequiredGPA();

  // Add a new planned course
  const addCourse = () => {
    setPlannedCourses([
      ...plannedCourses,
      { id: Date.now(), name: "", credits: 3, expectedGrade: "" }
    ]);
  };

  // Remove a course
  const removeCourse = (id) => {
    if (plannedCourses.length > 1) {
      setPlannedCourses(plannedCourses.filter(c => c.id !== id));
    }
  };

  // Update course
  const updateCourse = (id, field, value) => {
    setPlannedCourses(plannedCourses.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  // Get workload indicator
  const getWorkloadIndicator = () => {
    const totalCredits = plannedCourses
      .filter(c => c.credits > 0)
      .reduce((sum, c) => sum + parseFloat(c.credits || 0), 0);
    
    if (totalCredits === 0) return { label: "No Load", color: "#6c757d", level: "none" };
    if (totalCredits >= 18) return { label: "Heavy Load", color: "#dc3545", level: "heavy", warning: "⚠️ This is a very heavy course load!" };
    if (totalCredits >= 15) return { label: "Full Load", color: "#ffc107", level: "full", warning: "Standard full-time load" };
    if (totalCredits >= 12) return { label: "Moderate Load", color: "#28a745", level: "moderate", warning: "Good balanced load" };
    return { label: "Light Load", color: "#007bff", level: "light", warning: "Below full-time status" };
  };

  const workload = getWorkloadIndicator();

  return (
    <div className="container">
      {/* Header */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <Calculator size={32} color="#007bff" />
          <div>
            <h1 style={{ margin: 0 }}>GPA Calculator</h1>
            <p style={{ margin: "0.25rem 0 0 0", color: "var(--text-secondary)" }}>
              Plan your courses and calculate your projected GPA
            </p>
          </div>
        </div>
      </div>

      {/* Current GPA Section */}
      <div className="card">
        <h2 style={{ marginTop: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Award size={24} color="#007bff" />
          Current Academic Standing
        </h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label className="form-label">Current Cumulative GPA</label>
            <input
              type="number"
              className="input"
              value={currentGPA}
              onChange={(e) => setCurrentGPA(e.target.value)}
              placeholder="e.g., 3.25"
              step="0.01"
              min="0"
              max="4"
            />
          </div>
          
          <div>
            <label className="form-label">Completed Credit Hours</label>
            <input
              type="number"
              className="input"
              value={completedCredits}
              onChange={(e) => setCompletedCredits(e.target.value)}
              placeholder="e.g., 60"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Planned Courses Section */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <TrendingUp size={24} color="#28a745" />
            Plan Your Semester
          </h2>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={addCourse}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Plus size={16} />
            Add Course
          </button>
        </div>

        {/* Workload Indicator */}
        <div style={{
          padding: "1rem",
          backgroundColor: workload.color + "22",
          borderLeft: `4px solid ${workload.color}`,
          borderRadius: "4px",
          marginBottom: "1rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{
              padding: "0.5rem 1rem",
              backgroundColor: workload.color,
              color: "white",
              borderRadius: "20px",
              fontWeight: "600",
              fontSize: "0.875rem"
            }}>
              {workload.label}
            </span>
            <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              Total: <strong>
                {plannedCourses.reduce((sum, c) => sum + parseFloat(c.credits || 0), 0)} credit hours
              </strong> | {workload.warning}
            </span>
          </div>
        </div>

        {/* Course List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {plannedCourses.map((course) => (
            <div 
              key={course.id} 
              style={{ 
                display: "grid", 
                gridTemplateColumns: "2fr 1fr 1fr auto", 
                gap: "0.75rem",
                alignItems: "end",
                padding: "1rem",
                backgroundColor: "var(--background-secondary, #f8f9fa)",
                borderRadius: "8px"
              }}
            >
              <div>
                <label className="form-label" style={{ fontSize: "0.875rem" }}>Course Name</label>
                <input
                  type="text"
                  className="input"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                  placeholder="e.g., MATH 2300"
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: "0.875rem" }}>Credits</label>
                <input
                  type="number"
                  className="input"
                  value={course.credits}
                  onChange={(e) => updateCourse(course.id, "credits", e.target.value)}
                  min="0"
                  max="6"
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: "0.875rem" }}>Expected Grade</label>
                <select
                  className="input"
                  value={course.expectedGrade}
                  onChange={(e) => updateCourse(course.id, "expectedGrade", e.target.value)}
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
              </div>

              <button
                type="button"
                onClick={() => removeCourse(course.id)}
                disabled={plannedCourses.length === 1}
                style={{
                  padding: "0.5rem",
                  backgroundColor: plannedCourses.length === 1 ? "#e9ecef" : "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: plannedCourses.length === 1 ? "not-allowed" : "pointer"
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Projected GPA */}
        {projected && (
          <div style={{
            marginTop: "1.5rem",
            padding: "1.5rem",
            backgroundColor: "#d4edda",
            border: "2px solid #28a745",
            borderRadius: "8px"
          }}>
            <h3 style={{ marginTop: 0, marginBottom: "1rem", color: "#155724" }}>
              📊 Projected Results
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.875rem", color: "#155724", marginBottom: "0.25rem" }}>
                  Current GPA
                </div>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#155724" }}>
                  {parseFloat(currentGPA).toFixed(3)}
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.875rem", color: "#155724", marginBottom: "0.25rem" }}>
                  Projected GPA
                </div>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#155724" }}>
                  {projected.projectedGPA}
                </div>
                <div style={{ 
                  fontSize: "0.875rem", 
                  color: parseFloat(projected.change) >= 0 ? "#28a745" : "#dc3545",
                  fontWeight: "600"
                }}>
                  {parseFloat(projected.change) >= 0 ? "↑" : "↓"} {Math.abs(projected.change)} change
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.875rem", color: "#155724", marginBottom: "0.25rem" }}>
                  Total Credits
                </div>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#155724" }}>
                  {projected.totalCredits}
                </div>
                <div style={{ fontSize: "0.875rem", color: "#155724" }}>
                  +{projected.plannedCredits} new
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* What-If Scenario Section */}
      <div className="card">
        <h2 style={{ marginTop: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Target size={24} color="#ffc107" />
          What-If Scenario: Target GPA
        </h2>
        
        <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
          Calculate what GPA you need to achieve your target cumulative GPA
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          <div>
            <label className="form-label">Target Cumulative GPA</label>
            <input
              type="number"
              className="input"
              value={targetGPA}
              onChange={(e) => setTargetGPA(e.target.value)}
              placeholder="e.g., 3.50"
              step="0.01"
              min="0"
              max="4"
            />
          </div>
          
          <div>
            <label className="form-label">Remaining Credit Hours</label>
            <input
              type="number"
              className="input"
              value={remainingCredits}
              onChange={(e) => setRemainingCredits(e.target.value)}
              placeholder="e.g., 30"
              min="0"
            />
          </div>
        </div>

        {required && (
          <div style={{
            padding: "1.5rem",
            backgroundColor: required.feasible ? "#fff3cd" : "#f8d7da",
            border: `2px solid ${required.feasible ? "#ffc107" : "#dc3545"}`,
            borderRadius: "8px"
          }}>
            <h3 style={{ 
              marginTop: 0, 
              marginBottom: "1rem", 
              color: required.feasible ? "#856404" : "#721c24" 
            }}>
              {required.feasible ? "🎯 Target Analysis" : "⚠️ Infeasible Target"}
            </h3>
            
            {required.feasible ? (
              <>
                <div style={{ 
                  fontSize: "1.125rem", 
                  marginBottom: "0.75rem",
                  color: "#856404"
                }}>
                  To reach a <strong>{targetGPA}</strong> cumulative GPA, you need to maintain a{" "}
                  <strong style={{ fontSize: "1.5rem", color: "#ffc107" }}>
                    {required.requiredGPA}
                  </strong>{" "}
                  GPA over your next <strong>{remainingCredits}</strong> credit hours.
                </div>
                
                <div style={{
                  padding: "1rem",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  marginTop: "1rem"
                }}>
                  <strong>Assessment:</strong> {required.difficulty}
                </div>
              </>
            ) : (
              <div style={{ color: "#721c24" }}>
                {parseFloat(required.requiredGPA) > 4.0 ? (
                  <>
                    <p style={{ marginBottom: "0.5rem" }}>
                      <strong>This target is mathematically impossible.</strong>
                    </p>
                    <p style={{ margin: 0 }}>
                      Even with a perfect 4.0 GPA in your remaining {remainingCredits} credits, 
                      you cannot reach a {targetGPA} cumulative GPA. Consider a more realistic target.
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ marginBottom: "0.5rem" }}>
                      <strong>This target requires a negative GPA ({required.requiredGPA}).</strong>
                    </p>
                    <p style={{ margin: 0 }}>
                      Your current GPA is already above your target! You're doing great! 🎉
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="card" style={{ backgroundColor: "#e7f3ff" }}>
        <h3 style={{ marginTop: 0 }}> GPA Tips</h3>
        <ul style={{ marginBottom: 0, paddingLeft: "1.5rem" }}>
          <li style={{ marginBottom: "0.5rem" }}>
            Focus on courses early in your degree - early grades have more impact on your GPA
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Consider retaking courses where you earned below a C if your institution allows grade replacement
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Balance difficult courses with easier ones to maintain a good GPA while challenging yourself
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Use office hours and tutoring services - small improvements in grades make a big difference
          </li>
          <li>
            Remember: GPA is important, but learning and skill development matter more in the long run!
          </li>
        </ul>
      </div>
    </div>
  );
}