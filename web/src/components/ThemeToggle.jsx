/**
 * ThemeToggle.jsx
 *
 * Light/dark theme toggle button
 *
 * HOW IT WORKS:
 * - Stores your theme choice in localStorage
 * - Sets data-theme attribute on the <html> element
 * - CSS styles change based on [data-theme="dark"]
 *
 * INTEGRATION:
 * - styles.css defines :root and :root[data-theme="dark"] variables
 * - All theme colors automatically update when the attribute changes
 */

import { useEffect, useState } from "react";
import { Sun, MoonStar } from "lucide-react";

export default function ThemeToggle() {
  // Initialize from localStorage or just use the default light mode.
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  // Update DOM and localStorage when theme changes
  useEffect(() => {
    const isDark = theme === "dark";

    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );

    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="btn theme-toggle icon-btn"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={toggleTheme}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <Sun size={18} /> : <MoonStar size={18} />}
    </button>
  );
}
