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
    const entityMap: { [key: string]: string } = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x27;': "'",
      '&#x2F;': '/',
      '&#x60;': '`',
      '&#x3D;': '=',
    };
    return str.replace(
      /&[a-zA-Z0-9#]+;/g,
      (entity) => entityMap[entity] || entity,
    );
  };

  sanitized = decodeHtmlEntities(sanitized);

  // Apply sanitization in multiple passes until no changes occur
  do {
    previousLength = sanitized.length;

    sanitized = sanitized

      // Remove dangerous protocols
      .replace(/(?:javascript|data|vbscript|file|about):/gi, '')

      // Remove potentially dangerous characters
      .replace(/[<>"'`]/g, '')

      // Remove backslashes that might escape quotes
      .replace(/\\/g, '');
  } while (sanitized.length !== previousLength); // Repeat until stable

  return sanitized.trim();
};
