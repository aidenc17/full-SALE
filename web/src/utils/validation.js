/**
 * validation.js
 *
 * Form validation utilities
 */

/**
 * Validates username format
 * - Exactly 8 characters
 * - All lowercase letters
 */
export function isValidUsername(username) {
  return /^[a-z]{8}$/.test(username);
}

/**
 * Validates password format
 * - Between 8-40 characters (matches your DB constraint)
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 digit
 * - At least 1 special character
 */
export function isValidPassword(password) {
  if (!password || password.length < 8 || password.length > 40) {
    return false;
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return hasUpperCase && hasLowerCase && hasDigit && hasSpecial;
}