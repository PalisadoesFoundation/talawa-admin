// File upload constants for size and allowed types

const parsed = Number(import.meta.env.VITE_UPLOAD_MAX_SIZE_MB);
export const FILE_UPLOAD_MAX_SIZE_MB =
  !Number.isNaN(parsed) && parsed > 0 ? parsed : 5;

export const FILE_UPLOAD_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
];
