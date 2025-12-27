export const getSafeImageSrc = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  try {
    const parsed = new URL(url, window.location.href);
    const protocol = parsed.protocol;
    if (
      protocol === 'http:' ||
      protocol === 'https:' ||
      protocol === 'data:' ||
      protocol === 'blob:'
    ) {
      return url;
    }
    return undefined;
  } catch {
    return undefined;
  }
};

export default {};
