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
