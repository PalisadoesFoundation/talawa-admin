import {
  FILE_UPLOAD_MAX_SIZE_MB,
  FILE_UPLOAD_ALLOWED_TYPES,
} from '../Constant/fileUpload';

/**
 * Interface for file validation result
 */
interface IFileValidationResult {
  /** Whether the file is valid */
  isValid: boolean;
  /** Error message if the file is invalid */
  errorMessage?: string;
}

/**
 * Validates a file for size and type
 * @param file - The file to validate
 * @param maxSizeInMB - Maximum file size in MB (default: 5MB)
 * @param allowedTypes - Array of allowed MIME types (default: ['image/jpeg', 'image/png', 'image/gif'])
 * @returns IFileValidationResult - Object containing validation status and error message if any
 */
export const validateFile = (
  file: File,
  maxSizeInMB = FILE_UPLOAD_MAX_SIZE_MB,
  allowedTypes: readonly string[] = FILE_UPLOAD_ALLOWED_TYPES,
): IFileValidationResult => {
  const maxSize = maxSizeInMB * 1024 * 1024;

  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      errorMessage: `File is too large. Maximum size is ${maxSizeInMB}MB.`,
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    const allowedTypesList = allowedTypes
      .map((type) => type.split('/')[1].toUpperCase())
      .join(', ');
    return {
      isValid: false,
      errorMessage: `Invalid file type. Please upload a file of type: ${allowedTypesList}.`,
    };
  }

  return { isValid: true };
};
