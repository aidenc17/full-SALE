/**
 * validation.js
 *
 * Form validation utilities for authentication
 *
 * VALIDATION RULES (from project requirements):
 * - Username: Exactly 8 lowercase letters
 * - Password: Exactly 12 characters with complexity requirements
 *
 * These rules are checked on the client side before submitting.
 * The backend should also validate to prevent bypassing the client checks.
 */

/**
 * Validate username format
 *
 * RULES:
 * - Must be exactly 8 characters
 * - Must contain only lowercase letters (a-z)
 * - No numbers, symbols, or uppercase allowed
 *
 * @param {string} username - Username to validate
 * @returns {boolean} True if it's valid, false if not
 *
 * @example
 * isValidUsername("abcdefgh") // true
 * isValidUsername("abc12345") // false (contains numbers)
 * isValidUsername("Abcdefgh") // false (contains uppercase)
 */
export function isValidUsername(username) {
  // Regex breakdown: ^[a-z]{8}$
  // ^ = start of string
  // [a-z] = lowercase letter only
  // {8} = exactly 8 characters
  // $ = end of string
  return /^[a-z]{8}$/.test(username || "");
}

/**
 * Validate password complexity
 *
 * RULES:
 * - Must be exactly 12 characters long
 * - Must contain at least 1 lowercase letter (a-z)
 * - Must contain at least 1 uppercase letter (A-Z)
 * - Must contain at least 1 digit (0-9)
 * - Must contain at least 1 symbol (!@#$%^&*()_+)
 *
 * @param {string} password - Password to validate
 * @returns {boolean} True if it's valid, false if not
 *
 * @example
 * isValidPassword("Aa1aaaaaaa!1") // true
 * isValidPassword("password123")  // false (no uppercase, no symbol)
 */
export function isValidPassword(password) {
  // Must be exactly 12 characters
  if (typeof password !== "string" || password.length !== 12) {
    return false;
  }

  // Check for required character types
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*()_+]/.test(password);

  return hasLowercase && hasUppercase && hasDigit && hasSymbol;
}
