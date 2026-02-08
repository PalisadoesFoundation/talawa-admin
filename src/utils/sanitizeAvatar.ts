/**
 * Normalizes an avatar URL by converting null-like values to an empty string.
 *
 * @param url - The avatar URL to normalize
 * @returns The original URL, or an empty string if the input is falsy or the literal string "null"
 */
export const sanitizeAvatars = (
  file: File | null,
  fallbackUrl: string,
): string => {
  if (
    file instanceof File &&
    file.type.startsWith('image/') &&
    file.type !== 'image/svg+xml'
  ) {
    const objectUrl = URL.createObjectURL(file);

    if (objectUrl.startsWith('blob:')) {
      return objectUrl;
    }
    URL.revokeObjectURL(objectUrl);
    return '';
  }

  try {
    if (!fallbackUrl) return '';

    const parsed = new URL(fallbackUrl, window.location.origin);

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }

    return parsed.toString();
  } catch {
    return '';
  }
};

export const sanitizeAvatarURL = (url: string | null | undefined): string => {
  if (!url || url === 'null') {
    return '';
  }
  return url;
};
