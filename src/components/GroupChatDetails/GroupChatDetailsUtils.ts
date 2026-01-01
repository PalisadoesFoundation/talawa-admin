export const getSafeImageSrc = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  if (typeof url !== 'string') return undefined;
  const trimmed = url.trim();
  // Reject strings with whitespace or empty after trimming (e.g. 'not a url')
  if (trimmed.length === 0 || /\s/.test(trimmed)) return undefined;
  try {
    const parsed = new URL(trimmed, window.location.href);
    const protocol = parsed.protocol;
    if (
      protocol === 'http:' ||
      protocol === 'https:' ||
      protocol === 'data:' ||
      protocol === 'blob:'
    ) {
      return trimmed;
    }
    return undefined;
  } catch {
    return undefined;
  }
};

/**
 * Sanitizes text content to prevent XSS attacks by escaping HTML
 * special characters. This ensures user input is treated as plain text.
 *
 * @param text - The text to sanitize
 * @returns Sanitized text safe for display
 */
export const sanitizeText = (text?: string | null): string => {
  if (!text) return '';
  if (typeof text !== 'string') return '';

  // Escape special HTML characters to prevent XSS
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// No default export required — all exports are named
