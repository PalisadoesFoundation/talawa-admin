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

// No default export required — all exports are named
