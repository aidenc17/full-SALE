/**
 * Login.jsx
 *
 * Authentication entry point with form validation
 *
 * FEATURES:
 * - Username/password validation (see validation.js)
 * - Password visibility toggle
 * - Inline error messages
 * - Auto-redirect to user's role-specific dashboard
 * - Demo credential autofill for testing
 *
 * VALIDATION RULES:
 * - Username: Exactly 8 lowercase letters
 * - Password: Exactly 12 characters (1 uppercase, 1 lowercase, 1 digit, 1 symbol)
 *
 * SESSION MANAGEMENT:
 * - Uses sessionStorage (auto-clears when you close the browser)
 * - Handled by api.js login() function
 */

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isValidUsername, isValidPassword } from "../utils/validation";
import { login } from "../api";
import { Eye, EyeOff, CalendarHeart } from "lucide-react";

// Demo login info for testing (needs to follow validation rules, makes testing easier)
const DEMO_CREDENTIALS = {
  evantimm: { username: "evantimm", password: "fR7!k9PzL2q#" },
  lauraben: { username: "lauraben", password: "Lb8$hY3mQw" },
  aidencox: { username: "aidencox", password: "Aa1aaaaaaa!1" },
};

export default function Login() {
  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validate username
    if (!isValidUsername(username)) {
      setError("Username has to be exactly 8 lowercase letters.");
      return;
    }

    // Validate password
    if (!isValidPassword(password)) {
      setError(
        "Password must be 8-40 characters with 1 uppercase, 1 lowercase, 1 number, and 1 symbol."
      );
      return;
    }

    try {
      setLoading(true);

      const user = await login(username, password);

      // Redirect to intended destination or role dashboard
      const destination = state?.from?.pathname || `/${user.role}`;
      navigate(destination, { replace: true });
    } catch (err) {
      setError("You aren't in our system. Please contact CATS for help.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemoCredentials(role) {
    const credentials = DEMO_CREDENTIALS[role];
    if (credentials) {
      setUsername(credentials.username);
      setPassword(credentials.password);
    }
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        {/* Header */}
        <h1 className="auth-title">
          <div className="nav-logo">
            <CalendarHeart size={32} aria-hidden="true" />
          </div>
          Sign in
        </h1>
        <p className="auth-subtitle">Log in to access your account.</p>

        {/* Username field */}
        <div className="form-field">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            id="username"
            className="input"
            type="text"
            placeholder="Enter your username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-invalid={!!error}
          />
        </div>

        {/* Password field with visibility toggle */}
        <div className="form-field">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="input-wrap">
            <input
              id="password"
              className="input input-with-icon"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!error}
            />
            <button
              type="button"
              className="input-icon-btn"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}

        {/* Submit button */}
        <div className="actions-center">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>

        {/* Session info */}
        <p className="auth-footnote">
          Sessions end when you log out or close your browser.
        </p>
      </form>

      {/* Demo credentials dropdown */}
      <div className="auth-demo">
        <select
          id="demo"
          className="demo-select"
          onChange={(e) => {
            const role = e.target.value;
            if (role) {
              fillDemoCredentials(role);
              e.target.value = ""; // Reset selection
            }
          }}
          defaultValue=""
        >
          <option value="" disabled>
            Fill demo credentials...
          </option>
          <option value="student">evantimm (evantimm)</option>
          <option value="faculty">lauraben (lauraben)</option>
          <option value="admin">aidencox (aidencox)</option>
        </select>
      </div>
    </div>
  );
}
