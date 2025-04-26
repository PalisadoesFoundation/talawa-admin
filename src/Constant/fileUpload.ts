// File upload constants for size and allowed types

export const FILE_UPLOAD_MAX_SIZE_MB =
  Number(import.meta.env.VITE_UPLOAD_MAX_SIZE_MB) || 5;

export const FILE_UPLOAD_ALLOWED_TYPES = new Set<string>([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);
