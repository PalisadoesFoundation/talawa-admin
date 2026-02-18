// File upload constants for size and allowed types

const parsed = Number(import.meta.env.VITE_UPLOAD_MAX_SIZE_MB);
export const FILE_UPLOAD_MAX_SIZE_MB =
  !Number.isNaN(parsed) && parsed > 0 ? parsed : 5;

export const FILE_UPLOAD_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
];

/**
 * Maps browser MIME types to internal attachment type identifiers
 * used by the agenda item attachment system.
 */
export const AGENDA_ITEM_MIME_TYPE: Record<string, string> = {
  'image/jpeg': 'IMAGE_JPEG',
  'image/png': 'IMAGE_PNG',
  'image/gif': 'IMAGE_GIF',
  'image/webp': 'IMAGE_WEBP',
  'video/mp4': 'VIDEO_MP4',
  'video/webm': 'VIDEO_WEBM',
};

/**
 * List of MIME types allowed for agenda item attachments.
 * Used for file input validation.
 */
export const AGENDA_ITEM_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
];
