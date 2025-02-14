export const sanitizeAvatars = (
  file: File | null,
  fallbackUrl: string,
): string => {
  // Allow only image MIME types
  if (file instanceof File && file.type.startsWith('image/')) {
    return URL.createObjectURL(file);
  }
  try {
    // Ensure fallbackUrl is a valid and safe URL
    const safeUrl = new URL(fallbackUrl, window.location.origin);
    // No need for additional encodeURI since URL object already handles encoding
    return safeUrl.toString();
  } catch {
    console.error('Invalid fallback URL provided');
    return '';
  }
};
