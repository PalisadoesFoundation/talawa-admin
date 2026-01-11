import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import {
  FILE_UPLOAD_MAX_SIZE_MB,
  FILE_UPLOAD_ALLOWED_TYPES,
} from '../Constant/fileUpload';
/**
 * Removes empty fields from an object, filtering out null, undefined, and empty/whitespace-only strings.
 * File objects are preserved regardless of their content.
 *
 * This function accepts a generic type T that extends Record with string keys and values that can be
 * string, File, null
 *
 * @param obj - The object to filter
 * @returns A partial object with empty fields removed
 *
 * @example
 * ```typescript
 * const input = { name: 'John', email: '', age: null };
 * const result = removeEmptyFields(input);
 * // Returns: { name: 'John' }
 * ```
 */
export function removeEmptyFields<
  T extends Record<string, string | File | null>,
  // i18n-ignore-next-line
>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) =>
        value !== null &&
        value !== undefined &&
        (typeof value !== 'string' || value.trim() !== ''),
    ),
  ) as Partial<T>;
}

/**
 * Validates an image file for type and size constraints.
 * Shows error notifications for invalid files using the provided translation function.
 *
 * @param file - The file to validate, or undefined if no file is selected
 * @param tCommon - Translation function for error messages, accepts a key and optional interpolation options
 * @returns `true` if the file is valid, `false` otherwise
 *
 * @remarks
 * - Accepted file types: JPEG, PNG, GIF
 * - Maximum file size: 5MB
 * - Returns `false` immediately if no file is provided
 * - Displays error notifications for invalid files
 *
 * @example
 * ```typescript
 * const { t: tCommon } = useTranslation('common');
 * const isValid = validateImageFile(selectedFile, tCommon);
 * if (isValid) {
 *   // Process the valid image file
 * }
 * ```
 */
export function validateImageFile(
  file: File | undefined,
  tCommon: (key: string, options?: Record<string, unknown>) => string,
): boolean {
  if (!file) {
    return false; // No file to validate
  }

  if (!FILE_UPLOAD_ALLOWED_TYPES.includes(file.type)) {
    const allowedTypesDisplay = FILE_UPLOAD_ALLOWED_TYPES.map((type) =>
      type.split('/')[1].toUpperCase(),
    );
    const formattedTypes =
      allowedTypesDisplay.length > 1
        ? `${allowedTypesDisplay.slice(0, -1).join(', ')}, or ${allowedTypesDisplay.slice(-1)}`
        : allowedTypesDisplay[0];

    NotificationToast.error(
      tCommon('invalidFileType', { types: formattedTypes }) as string,
    );
    return false;
  }

  if (file.size > FILE_UPLOAD_MAX_SIZE_MB * 1024 * 1024) {
    NotificationToast.error(
      tCommon('fileTooLarge', { size: FILE_UPLOAD_MAX_SIZE_MB }) as string,
    );
    return false;
  }
  return true;
}
