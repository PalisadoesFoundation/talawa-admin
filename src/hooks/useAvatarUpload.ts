import { useCallback, useEffect, useState } from 'react';
import { validateFile } from '../utils/fileValidation';

/**
 * Custom hook for handling avatar file uploads with validation.
 *
 * Provides file validation (type and size), preview URL management,
 * and error handling for avatar upload functionality.
 *
 * @param initialUrl - Optional initial preview URL for existing avatar
 * @returns Object containing file, previewUrl, error state, and handlers
 *
 * @example
 * ```tsx
 * const { file, previewUrl, error, onFileSelect, clearError } = useAvatarUpload(currentAvatarUrl);
 *
 * const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 *   const selectedFile = e.target.files?.[0];
 *   if (selectedFile) onFileSelect(selectedFile);
 * };
 * ```
 */
export function useAvatarUpload(initialUrl?: string): {
  file: File | null;
  previewUrl: string | undefined;
  error: string | null;
  onFileSelect: (f: File) => void;
  clearError: () => void;
} {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialUrl);
  const [error, setError] = useState<string | null>(null);

  const onFileSelect = useCallback((f: File): void => {
    const validationResult = validateFile(f);
    if (!validationResult.isValid) {
      setError(validationResult.errorMessage ?? 'Invalid file');
      return;
    }
    setError(null);
    setFile(f);
  }, []);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return { file, previewUrl, error, onFileSelect, clearError };
}
