// Safe URL protocols for avatar images
const ALLOWED_PROTOCOLS = ['http:', 'https:', 'blob:'];

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

    // Block dangerous protocols like javascript:, data:, vbscript:
    if (!ALLOWED_PROTOCOLS.includes(safeUrl.protocol)) {
      throw new Error(`Unsafe protocol: ${safeUrl.protocol}`);
    }

    return safeUrl.toString();
  } catch {
    console.error('Invalid fallback URL provided');
    return '';
  }
};
