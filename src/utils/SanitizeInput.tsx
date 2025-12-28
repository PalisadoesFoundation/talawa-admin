/**
 * Sanitizes user input to prevent XSS attacks
 * Removes potentially dangerous characters, HTML tags, and dangerous protocols
 *
 * @param input - The string to sanitize
 * @returns The sanitized string with dangerous content removed
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';

  return (
    input
      // Remove <script> blocks
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      // Remove all HTML tags
      .replace(/<.*?>/g, '')
      // Remove event handlers like onclick="..."
      .replace(/on\w+\s*=\s*(['"]).*?\1/gi, '')
      // Remove dangerous URL protocols
      .replace(/(javascript|data|vbscript):/gi, '')
      // Remove leftover dangerous characters
      .replace(/[<>'"]/g, '')
      .trim()
  );
};
