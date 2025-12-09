/**
 * StudentCoopRequest.jsx
 * 
 * Co-op request and earnings calculator for students
 */

import { useState } from "react";
import { getCurrentUser, addNotification } from "../../api";
import { Briefcase, Calculator, DollarSign, Calendar } from "lucide-react";

export default function StudentCoopRequest() {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    hourlyRate: "",
    hoursPerWeek: 40,
    description: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Calculate earnings
  const calculateEarnings = () => {
    if (!formData.startDate || !formData.endDate || !formData.hourlyRate) {
      return null;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const weeks = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 7));
    
    const weeklyEarnings = parseFloat(formData.hourlyRate) * parseFloat(formData.hoursPerWeek);
    const totalEarnings = weeklyEarnings * weeks;
    
    return {
      weeks,
      weeklyEarnings: weeklyEarnings.toFixed(2),
      totalEarnings: totalEarnings.toFixed(2)
    };
  };

  const earnings = calculateEarnings();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const user = getCurrentUser();

    try {
      // Simulate API call with timeout (demo mode - no backend yet)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Uncomment when backend endpoint is ready
      /*
      const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
      const studentId = user.userId + 2;
      
      const response = await fetch(`${API_BASE_URL}/coop-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentId,
          ...formData,
          estimatedEarnings: earnings?.totalEarnings,
          status: "PENDING"
        })
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }
      */

      // Show success
      addNotification(
        user,
        "Co-op Request Submitted!",
        `Your co-op request for ${formData.position} at ${formData.company} has been submitted for review.`,
        "success"
      );
      
      setSubmitted(true);
      setFormData({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        hourlyRate: "",
        hoursPerWeek: 40,
        description: ""
      });
      
      setTimeout(() => setSubmitted(false), 5000);

    } catch (err) {
      console.error("Error submitting co-op request:", err);
      addNotification(
        user,
        "Submission Failed",
        "Unable to submit co-op request. Please try again or contact your advisor.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <Briefcase size={32} color="#007bff" />
          <div>
            <h1 style={{ margin: 0 }}>Co-op Request</h1>
            <p style={{ margin: "0.25rem 0 0 0", color: "var(--text-secondary)" }}>
              Submit your co-op opportunity for approval
            </p>
          </div>
        </div>

        {submitted && (
          <div style={{
            padding: "1rem",
            backgroundColor: "#d4edda",
            color: "#155724",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            border: "1px solid #c3e6cb"
          }}>
            ✅ <strong>Success!</strong> Your co-op request has been submitted and is pending review.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label className="form-label">Company/Organization *</label>
              <input
                type="text"
                name="company"
                className="input"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g., Google, Wright-Patterson AFB"
                required
              />
            </div>

            <div>
              <label className="form-label">Position Title *</label>
              <input
                type="text"
                name="position"
                className="input"
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g., Software Engineering Intern"
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label className="form-label">Start Date *</label>
              <input
                type="date"
                name="startDate"
                className="input"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label">End Date *</label>
              <input
                type="date"
                name="endDate"
                className="input"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label className="form-label">Hourly Rate ($) *</label>
              <input
                type="number"
                name="hourlyRate"
                className="input"
                value={formData.hourlyRate}
                onChange={handleChange}
                placeholder="25.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div>
              <label className="form-label">Hours per Week</label>
              <input
                type="number"
                name="hoursPerWeek"
                className="input"
                value={formData.hoursPerWeek}
                onChange={handleChange}
                min="1"
                max="40"
              />
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label className="form-label">Job Description</label>
            <textarea
              name="description"
              className="input"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of your role and responsibilities..."
              rows="4"
              style={{ resize: "vertical" }}
            />
          </div>

          {/* Earnings Calculator */}
          {earnings && (
            <div style={{
              padding: "1.5rem",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              border: "2px solid #007bff"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <Calculator size={24} color="#007bff" />
                <h3 style={{ margin: 0 }}>Estimated Earnings</h3>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                <div style={{
                  padding: "1rem",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  textAlign: "center"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <Calendar size={20} color="#6c757d" />
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Duration</span>
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#007bff" }}>
                    {earnings.weeks} weeks
                  </div>
                </div>

                <div style={{
                  padding: "1rem",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  textAlign: "center"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <DollarSign size={20} color="#6c757d" />
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Weekly</span>
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#28a745" }}>
                    ${earnings.weeklyEarnings}
                  </div>
                </div>

                <div style={{
                  padding: "1rem",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  textAlign: "center"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <DollarSign size={20} color="#6c757d" />
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Total</span>
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#28a745" }}>
                    ${earnings.totalEarnings}
                  </div>
                </div>
              </div>

              <p style={{ 
                marginTop: "1rem", 
                marginBottom: 0, 
                fontSize: "0.875rem", 
                color: "var(--text-secondary)",
                fontStyle: "italic"
              }}>
                This estimate is based on {formData.hoursPerWeek} hours/week at ${formData.hourlyRate}/hour for {earnings.weeks} weeks
              </p>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={submitting}
            style={{ width: "100%" }}
          >
            {submitting ? "Submitting..." : "Submit Co-op Request for Approval"}
          </button>
        </form>

        <div style={{
          marginTop: "2rem",
          padding: "1rem",
          borderRadius: "8px",
          fontSize: "0.875rem"
        }}>
          <strong>Note:</strong> Co-op requests must be approved by your academic advisor before you can begin. 
          You'll receive a notification once your request has been reviewed.
        </div>
      </div>
    </div>
  );
}