export const sanitizeAvatars = (
  file: File | null,
  fallbackUrl: string,
): string => {
  // Allow only image MIME types
  if (file instanceof File && file.type.startsWith('image/')) {
    return URL.createObjectURL(file);
  }
  try {
    if (!fallbackUrl) {
      throw new Error('Invalid fallback URL');
    }
    const safeUrl = new URL(fallbackUrl, window.location.origin);
    return safeUrl.toString();
  } catch {
    console.error('Invalid fallback URL provided');
    return '';
  }
};
