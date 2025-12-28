/**
 * Sanitizes user input to prevent XSS attacks
 * Removes potentially dangerous characters and HTML tags
 *
 * @param input - The string to sanitize
 * @returns The sanitized string with dangerous characters removed
 *
 * @example
 * ```typescript
 * const userInput = '<script>alert("XSS")</script>John';
 * const safe = sanitizeInput(userInput); // Returns 'John'
 * ```
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/[<>'"]/g, '') // Remove HTML/script injection chars
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers (onclick=, onload=, etc.)
    .trim();
};
