// src/utils/camelotWheelHelper.js

/**
 * Checks if two Camelot keys are harmonically compatible.
 * @param {string} key1 - The first Camelot key (e.g., "10A").
 * @param {string} key2 - The second Camelot key (e.g., "11A").
 * @returns {boolean} - True if keys are compatible.
 */
export const checkCamelotCompatibility = (key1, key2) => {
  // 1. Basic validation to make sure we have valid key strings.
  if (typeof key1 !== 'string' || typeof key2 !== 'string' || key1.length < 2 || key2.length < 2) {
    return false;
  }

  // 2. Parse the number and letter from each key.
  const num1 = parseInt(key1.slice(0, -1), 10);
  const letter1 = key1.slice(-1).toUpperCase();
  const num2 = parseInt(key2.slice(0, -1), 10);
  const letter2 = key2.slice(-1).toUpperCase();
  
  // 3. Check if parsing failed (e.g., for an empty key).
  if(isNaN(num1) || isNaN(num2)) return false;

  // 4. Apply compatibility rules.
  // Rule A: Same key number (e.g., 8A is compatible with 8B).
  if (num1 === num2) {
    return true;
  }

  // Rule B: Adjacent numbers with the same letter (e.g., 8A is compatible with 7A and 9A).
  // The 'diff === 11' cleverly handles the wrap-around from 12 to 1.
  const diff = Math.abs(num1 - num2);
  if (letter1 === letter2 && (diff === 1 || diff === 11)) {
    return true;
  }

  // 5. If no rules match, they are not compatible.
  return false;
};