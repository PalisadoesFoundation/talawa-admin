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
 * @returns {IFileValidationResult} - Object containing validation status and error message if any
 */
export const validateFile = (
  file: File,
  maxSizeInMB = 5,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif'],
): IFileValidationResult => {
  const maxSize = maxSizeInMB * 1024 * 1024; // Convert MB to bytes

  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      errorMessage: `File is too large. Maximum size is ${maxSizeInMB}MB.`,
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      errorMessage: 'Invalid file type. Please upload a JPEG, PNG, or GIF.',
    };
  }

  return { isValid: true };
};
