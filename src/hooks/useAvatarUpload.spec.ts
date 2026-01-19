import { renderHook, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAvatarUpload } from './useAvatarUpload';

describe('useAvatarUpload', () => {
  const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
  const mockRevokeObjectURL = vi.fn();

  beforeEach(() => {
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const createMockFile = (
    name: string,
    type: string,
    sizeInBytes: number,
  ): File => {
    const content = new Array(sizeInBytes).fill('a').join('');
    return new File([content], name, { type });
  };

  describe('initial state', () => {
    it('returns null file initially', () => {
      const { result } = renderHook(() => useAvatarUpload());
      expect(result.current.file).toBeNull();
    });

    it('returns undefined previewUrl when no initialUrl provided', () => {
      const { result } = renderHook(() => useAvatarUpload());
      expect(result.current.previewUrl).toBeUndefined();
    });

    it('returns initialUrl as previewUrl when provided', () => {
      const initialUrl = 'https://example.com/avatar.jpg';
      const { result } = renderHook(() => useAvatarUpload(initialUrl));
      expect(result.current.previewUrl).toBe(initialUrl);
    });

    it('returns null error initially', () => {
      const { result } = renderHook(() => useAvatarUpload());
      expect(result.current.error).toBeNull();
    });
  });

  describe('file type validation', () => {
    it('accepts JPEG files', () => {
      const { result } = renderHook(() => useAvatarUpload());
      const file = createMockFile('test.jpg', 'image/jpeg', 1024);

      act(() => {
        result.current.onFileSelect(file);
      });

      expect(result.current.file).toBe(file);
      expect(result.current.error).toBeNull();
    });

    it('accepts PNG files', () => {
      const { result } = renderHook(() => useAvatarUpload());
      const file = createMockFile('test.png', 'image/png', 1024);

      act(() => {
        result.current.onFileSelect(file);
      });

      expect(result.current.file).toBe(file);
      expect(result.current.error).toBeNull();
    });

    it('accepts GIF files', () => {
      const { result } = renderHook(() => useAvatarUpload());
      const file = createMockFile('test.gif', 'image/gif', 1024);

      act(() => {
        result.current.onFileSelect(file);
      });

      expect(result.current.file).toBe(file);
      expect(result.current.error).toBeNull();
    });

    it('rejects unsupported file types', () => {
      const { result } = renderHook(() => useAvatarUpload());
      const file = createMockFile('test.pdf', 'application/pdf', 1024);

      act(() => {
        result.current.onFileSelect(file);
      });

      expect(result.current.file).toBeNull();
      expect(result.current.error).toBe(
        'Invalid file type. Please upload a file of type: JPEG, PNG, GIF.',
      );
    });

    it('rejects webp files', () => {
      const { result } = renderHook(() => useAvatarUpload());
      const file = createMockFile('test.webp', 'image/webp', 1024);

      act(() => {
        result.current.onFileSelect(file);
      });

      expect(result.current.file).toBeNull();
      expect(result.current.error).toBe(
        'Invalid file type. Please upload a file of type: JPEG, PNG, GIF.',
      );
    });
  });

  describe('file size validation', () => {
    it('accepts files under 5MB', () => {
      const { result } = renderHook(() => useAvatarUpload());
      const file = createMockFile('test.jpg', 'image/jpeg', 4 * 1024 * 1024);

      act(() => {
        result.current.onFileSelect(file);
      });

      expect(result.current.file).toBe(file);
      expect(result.current.error).toBeNull();
    });

    it('accepts files exactly 5MB', () => {
      const { result } = renderHook(() => useAvatarUpload());
      const file = createMockFile('test.jpg', 'image/jpeg', 5 * 1024 * 1024);

      act(() => {
        result.current.onFileSelect(file);
      });

      expect(result.current.file).toBe(file);
      expect(result.current.error).toBeNull();
    });

    it('rejects files over 5MB', () => {
      const { result } = renderHook(() => useAvatarUpload());
      const file = createMockFile(
        'test.jpg',
        'image/jpeg',
        5 * 1024 * 1024 + 1,
      );

      act(() => {
        result.current.onFileSelect(file);
      });

      expect(result.current.file).toBeNull();
      expect(result.current.error).toBe(
        'File is too large. Maximum size is 5MB.',
      );
    });
  });

  describe('preview URL management', () => {
    it('creates preview URL when file is selected', () => {
      const { result } = renderHook(() => useAvatarUpload());
      const file = createMockFile('test.jpg', 'image/jpeg', 1024);

      act(() => {
        result.current.onFileSelect(file);
      });

      expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
      expect(result.current.previewUrl).toBe('blob:mock-url');
    });

    it('revokes previous URL when new file is selected', () => {
      const { result } = renderHook(() => useAvatarUpload());
      const file1 = createMockFile('test1.jpg', 'image/jpeg', 1024);
      const file2 = createMockFile('test2.jpg', 'image/jpeg', 1024);

      act(() => {
        result.current.onFileSelect(file1);
      });

      act(() => {
        result.current.onFileSelect(file2);
      });

      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    it('revokes URL on unmount', () => {
      const { result, unmount } = renderHook(() => useAvatarUpload());
      const file = createMockFile('test.jpg', 'image/jpeg', 1024);

      act(() => {
        result.current.onFileSelect(file);
      });

      unmount();

      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });
  });

  describe('error handling', () => {
    it('clears error with clearError', () => {
      const { result } = renderHook(() => useAvatarUpload());
      const invalidFile = createMockFile('test.pdf', 'application/pdf', 1024);

      act(() => {
        result.current.onFileSelect(invalidFile);
      });

      expect(result.current.error).toBe(
        'Invalid file type. Please upload a file of type: JPEG, PNG, GIF.',
      );

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('clears previous error when valid file is selected', () => {
      const { result } = renderHook(() => useAvatarUpload());
      const invalidFile = createMockFile('test.pdf', 'application/pdf', 1024);
      const validFile = createMockFile('test.jpg', 'image/jpeg', 1024);

      act(() => {
        result.current.onFileSelect(invalidFile);
      });

      expect(result.current.error).toBe(
        'Invalid file type. Please upload a file of type: JPEG, PNG, GIF.',
      );

      act(() => {
        result.current.onFileSelect(validFile);
      });

      expect(result.current.error).toBeNull();
    });

    it('validates size before type', () => {
      const { result } = renderHook(() => useAvatarUpload());
      // Invalid type AND too large
      const file = createMockFile(
        'test.pdf',
        'application/pdf',
        10 * 1024 * 1024,
      );

      act(() => {
        result.current.onFileSelect(file);
      });

      // Size is checked first by the centralized validator
      expect(result.current.error).toBe(
        'File is too large. Maximum size is 5MB.',
      );
    });
  });

  describe('fallback error handling', () => {
    it('uses fallback error message when validator returns no errorMessage', async () => {
      // Mock the validateFile utility to return isValid: false without errorMessage

      // We need to mock at the module level
      vi.doMock('../utils/fileValidation', () => ({
        validateFile: vi.fn().mockReturnValue({ isValid: false }),
      }));

      // Re-import the hook with mocked dependency
      vi.resetModules();
      const { useAvatarUpload: useAvatarUploadMocked } =
        await import('./useAvatarUpload');

      const { result } = renderHook(() => useAvatarUploadMocked());
      const file = createMockFile('test.jpg', 'image/jpeg', 1024);

      act(() => {
        result.current.onFileSelect(file);
      });

      // Should use fallback error message
      expect(result.current.error).toBe('Invalid file');

      // Restore original module
      vi.doUnmock('../utils/fileValidation');
      vi.resetModules();
    });
  });

  describe('multiple hook instances', () => {
    it('keeps multiple hook instances isolated', () => {
      const hookA = renderHook(() => useAvatarUpload());
      const hookB = renderHook(() =>
        useAvatarUpload('https://example.com/avatar.jpg'),
      );

      const file = createMockFile('test.jpg', 'image/jpeg', 1024);

      act(() => {
        hookA.result.current.onFileSelect(file);
      });

      expect(hookA.result.current.file).toBe(file);
      expect(hookB.result.current.file).toBeNull();
      expect(hookB.result.current.previewUrl).toBe(
        'https://example.com/avatar.jpg',
      );
    });
  });
});
