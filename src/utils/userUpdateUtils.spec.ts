import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { removeEmptyFields, validateImageFile } from './userUpdateUtils';

import { NotificationToast } from 'components/NotificationToast/NotificationToast';

// Mock NotificationToast
vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    error: vi.fn(),
  },
}));

describe('userUpdateUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('removeEmptyFields', () => {
    it('should remove null values', () => {
      const input = {
        name: 'John',
        email: null,
        age: '25',
      };
      const result = removeEmptyFields(input);
      expect(result).toEqual({
        name: 'John',
        age: '25',
      });
    });

    it('should remove empty string values', () => {
      const input = {
        name: 'John',
        email: '',
        age: '25',
      };
      const result = removeEmptyFields(input);
      expect(result).toEqual({
        name: 'John',
        age: '25',
      });
    });

    it('should remove whitespace-only string values', () => {
      const input = {
        name: 'John',
        email: '   ',
        age: '25',
      };
      const result = removeEmptyFields(input);
      expect(result).toEqual({
        name: 'John',
        age: '25',
      });
    });

    it('should keep File objects', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const input = {
        name: 'John',
        profilePicture: mockFile,
        email: '',
      };
      const result = removeEmptyFields(input);
      expect(result).toEqual({
        name: 'John',
        profilePicture: mockFile,
      });
    });

    it('should keep valid string values', () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        description: 'A valid description',
      };
      const result = removeEmptyFields(input);
      expect(result).toEqual(input);
    });

    it('should handle empty objects', () => {
      const input = {};
      const result = removeEmptyFields(input);
      expect(result).toEqual({});
    });

    it('should handle objects with only empty values', () => {
      const input = {
        name: '',
        email: null,
        description: '   ',
      };
      const result = removeEmptyFields(input);
      expect(result).toEqual({});
    });
  });

  describe('validateImageFile', () => {
    const mockTCommon = vi.fn();

    beforeEach(() => {
      mockTCommon.mockClear();
    });

    it('should return false when file is undefined', () => {
      const result = validateImageFile(undefined, mockTCommon);
      expect(result).toBe(false);
      expect(mockTCommon).not.toHaveBeenCalled();
      expect(NotificationToast.error).not.toHaveBeenCalled();
    });

    it('should return true for valid JPEG file', () => {
      const validFile = new File(['test'], 'test.jpg', {
        type: 'image/jpeg',
      });
      Object.defineProperty(validFile, 'size', { value: 1024 * 1024 }); // 1MB

      const result = validateImageFile(validFile, mockTCommon);
      expect(result).toBe(true);
      expect(mockTCommon).not.toHaveBeenCalled();
      expect(NotificationToast.error).not.toHaveBeenCalled();
    });

    it('should return true for valid PNG file', () => {
      const validFile = new File(['test'], 'test.png', {
        type: 'image/png',
      });
      Object.defineProperty(validFile, 'size', { value: 1024 * 1024 }); // 1MB

      const result = validateImageFile(validFile, mockTCommon);
      expect(result).toBe(true);
      expect(mockTCommon).not.toHaveBeenCalled();
      expect(NotificationToast.error).not.toHaveBeenCalled();
    });

    it('should return true for valid GIF file', () => {
      const validFile = new File(['test'], 'test.gif', {
        type: 'image/gif',
      });
      Object.defineProperty(validFile, 'size', { value: 1024 * 1024 }); // 1MB

      const result = validateImageFile(validFile, mockTCommon);
      expect(result).toBe(true);
      expect(mockTCommon).not.toHaveBeenCalled();
      expect(NotificationToast.error).not.toHaveBeenCalled();
    });

    it('should return false and show error for invalid file type', () => {
      const invalidFile = new File(['test'], 'test.txt', {
        type: 'text/plain',
      });
      Object.defineProperty(invalidFile, 'size', { value: 1024 }); // 1KB

      mockTCommon.mockReturnValue(
        'Invalid file type. Please use JPEG, PNG, or GIF.',
      );

      const result = validateImageFile(invalidFile, mockTCommon);

      expect(result).toBe(false);
      expect(mockTCommon).toHaveBeenCalledWith('invalidFileType', {
        types: 'JPEG, PNG, or GIF',
      });
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Invalid file type. Please use JPEG, PNG, or GIF.',
      );
    });

    it('should return false and show error for file too large', () => {
      const largeFile = new File(['test'], 'test.jpg', {
        type: 'image/jpeg',
      });
      Object.defineProperty(largeFile, 'size', {
        value: 6 * 1024 * 1024, // 6MB
      });

      mockTCommon.mockReturnValue('File size must be less than 5MB.');

      const result = validateImageFile(largeFile, mockTCommon);

      expect(result).toBe(false);
      expect(mockTCommon).toHaveBeenCalledWith('fileTooLarge', { size: 5 });
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'File size must be less than 5MB.',
      );
    });

    it('should return false for invalid type even if size is valid', () => {
      const invalidFile = new File(['test'], 'test.pdf', {
        type: 'application/pdf',
      });
      Object.defineProperty(invalidFile, 'size', { value: 1024 }); // 1KB

      mockTCommon.mockReturnValue(
        'Invalid file type. Please use JPEG, PNG, or GIF.',
      );

      const result = validateImageFile(invalidFile, mockTCommon);

      expect(result).toBe(false);
      expect(mockTCommon).toHaveBeenCalledWith('invalidFileType', {
        types: 'JPEG, PNG, or GIF',
      });
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'Invalid file type. Please use JPEG, PNG, or GIF.',
      );
    });

    it('should handle exactly 5MB file size (edge case)', () => {
      const edgeFile = new File(['test'], 'test.jpg', {
        type: 'image/jpeg',
      });
      Object.defineProperty(edgeFile, 'size', {
        value: 5 * 1024 * 1024, // Exactly 5MB
      });

      const result = validateImageFile(edgeFile, mockTCommon);
      expect(result).toBe(true);
      expect(mockTCommon).not.toHaveBeenCalled();
      expect(NotificationToast.error).not.toHaveBeenCalled();
    });
  });
});

describe('validateImageFile (single allowed type)', () => {
  afterEach(() => {
    vi.doUnmock('../Constant/fileUpload');
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('formats allowed types correctly when only one type is allowed', async () => {
    vi.resetModules();

    vi.doMock('../Constant/fileUpload', () => ({
      FILE_UPLOAD_MAX_SIZE_MB: 5,
      FILE_UPLOAD_ALLOWED_TYPES: ['image/jpeg'],
    }));

    const { validateImageFile } = await import('./userUpdateUtils');
    const { NotificationToast } =
      await import('components/NotificationToast/NotificationToast');

    const mockTCommon = vi
      .fn()
      .mockReturnValue('Invalid file type. Please use JPEG.');

    const invalidFile = new File(['test'], 'test.png', {
      type: 'image/png',
    });
    Object.defineProperty(invalidFile, 'size', { value: 1024 });

    const result = validateImageFile(invalidFile, mockTCommon);

    expect(result).toBe(false);
    expect(mockTCommon).toHaveBeenCalledWith('invalidFileType', {
      types: 'JPEG',
    });
    expect(NotificationToast.error).toHaveBeenCalledWith(
      'Invalid file type. Please use JPEG.',
    );
  });
});
