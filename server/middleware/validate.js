// Lightweight schema-based validators — no external dependency.
// Each function returns a string (error message) or null (valid).
// Kept pure so they can be composed freely in any route.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Primitives ───────────────────────────────────────────────────────────────

function validateEmail(value) {
  if (typeof value !== "string" || !value.trim()) return "Email is required.";
  if (value.trim().length > 254) return "Email must not exceed 254 characters.";
  if (!EMAIL_REGEX.test(value.trim())) return "Email format is invalid.";
  return null;
}

// Min 8, max 128 — prevents both trivial passwords and bcrypt 72-byte truncation edge cases
function validatePassword(value) {
  if (typeof value !== "string") return "Password must be a string.";
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (value.length > 128) return "Password must not exceed 128 characters.";
  return null;
}

// Non-empty string with an upper bound — use for any required text field
function validateString(value, fieldName, maxLen = 255) {
  if (typeof value !== "string" || !value.trim()) return `${fieldName} is required.`;
  if (value.trim().length > maxLen)
    return `${fieldName} must not exceed ${maxLen} characters.`;
  return null;
}

// Optional string — absent/null/empty is fine; if provided it must satisfy maxLen
function validateOptionalString(value, fieldName, maxLen = 255) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return `${fieldName} must be a string.`;
  if (value.length > maxLen)
    return `${fieldName} must not exceed ${maxLen} characters.`;
  return null;
}

// Phone: 7–20 chars, only digits, spaces, and common separators (+, -, ., parentheses)
function validatePhone(value, required = false) {
  if (!value || (typeof value === "string" && !value.trim())) {
    return required ? "Phone is required." : null;
  }
  if (typeof value !== "string") return "Phone must be a string.";
  const t = value.trim();
  if (t.length < 7 || t.length > 20)
    return "Phone must be between 7 and 20 characters.";
  if (!/^[+\d\s\-().]+$/.test(t)) return "Phone contains invalid characters.";
  return null;
}

// Date string: must match YYYY-MM-DD and be a calendar-valid date
function validateDate(value, fieldName) {
  if (typeof value !== "string" || !value.trim()) return `${fieldName} is required.`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.trim()))
    return `${fieldName} must be in YYYY-MM-DD format.`;
  if (isNaN(new Date(value.trim()).getTime()))
    return `${fieldName} is not a valid date.`;
  return null;
}

// ─── Composition helper ───────────────────────────────────────────────────────

// Returns the first truthy error in the list, or null if all pass.
// Usage: const err = firstError(validateEmail(e), validatePassword(p));
function firstError(...errors) {
  return errors.find(Boolean) || null;
}

module.exports = {
  validateEmail,
  validatePassword,
  validateString,
  validateOptionalString,
  validatePhone,
  validateDate,
  firstError,
};
