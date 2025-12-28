/**
 * Sanitizes user input to prevent XSS attacks
 * Uses multiple passes and stricter pattern matching
 *
 * @param input - The string to sanitize
 * @returns The sanitized string with dangerous content removed
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';

  let sanitized = input;
  let previousLength;

  // Decode HTML entities first to prevent encoded attacks
  const decodeHtmlEntities = (str: string): string => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
  };

  sanitized = decodeHtmlEntities(sanitized);

  // Apply sanitization in multiple passes until no changes occur
  do {
    previousLength = sanitized.length;

    sanitized = sanitized
      // Remove script tags and content (case-insensitive, handles whitespace/newlines)
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<script[\s\S]*?>/gi, '')

      // Remove all HTML tags
      .replace(/<[^>]*>/g, '')

      // Remove event handlers more aggressively (handles spaces, quotes, etc.)
      .replace(/\bon\w+\s*=\s*["']?[^"'>\s]*["']?/gi, '')

      // Remove dangerous protocols
      .replace(/(?:javascript|data|vbscript|file|about):/gi, '')

      // Remove potentially dangerous characters
      .replace(/[<>"'`]/g, '')

      // Remove backslashes that might escape quotes
      .replace(/\\/g, '');
  } while (sanitized.length !== previousLength); // Repeat until stable

  return sanitized.trim();
};
