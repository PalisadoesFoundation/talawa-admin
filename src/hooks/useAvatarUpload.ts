import { useCallback, useEffect, useState } from 'react';

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = ['image/jpeg', 'image/png', 'image/gif'];

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

  const validateFile = useCallback((f: File): string | null => {
    if (!ACCEPT.includes(f.type)) return 'Only JPEG/PNG/GIF allowed';
    if (f.size > MAX_BYTES) return 'Max file size is 5MB';
    return null;
  }, []);

  const onFileSelect = useCallback(
    (f: File): void => {
      const err = validateFile(f);
      if (err) {
        setError(err);
        return;
      }
      setError(null);
      setFile(f);
    },
    [validateFile],
  );

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
