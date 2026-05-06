/**
 * Validates that a string is non-empty (after trimming whitespace)
 * @param {string} str - The string to validate
 * @returns {boolean} - True if string is non-empty, false otherwise
 */
export function validateString(str) {
  if (typeof str !== "string") {
    return false;
  }
  return str.trim().length > 0;
}

/**
 * Validates and autocorrects pay rate input
 * - Returns 0.00 for non-numeric inputs, negative values, or empty strings
 * - Formats valid inputs to 2 decimal places
 * @param {string|number} input - The pay rate input to validate and correct
 * @returns {number} - Corrected pay rate as a number with 2 decimal places
 */
export function validateAndCorrectPayRate(input) {
  // Handle empty or non-existent input
  if (input === "" || input === null || input === undefined) {
    return 0.0;
  }

  // Convert to number
  let numValue;
  if (typeof input === "string") {
    numValue = parseFloat(input);
  } else if (typeof input === "number") {
    numValue = input;
  } else {
    return 0.0;
  }

  // Check if conversion was successful (NaN means invalid number)
  if (isNaN(numValue)) {
    return 0.0;
  }

  // Check if value is negative
  if (numValue < 0) {
    return 0.0;
  }

  // Return formatted to 2 decimal places
  return Math.round(numValue * 100) / 100;
}

/**
 * Formats a number to 2 decimal places string representation
 * @param {number} value - The value to format
 * @returns {string} - Formatted string with 2 decimal places
 */
export function formatPayRateDisplay(value) {
  const corrected = validateAndCorrectPayRate(value);
  return corrected.toFixed(2);
}
