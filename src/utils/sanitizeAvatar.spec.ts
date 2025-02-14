import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sanitizeAvatars } from './sanitizeAvatar';

describe('sanitizeAvatars', () => {
  const mockCreateObjectURL = vi.fn();
  const consoleErrorSpy = vi.spyOn(console, 'error');

  beforeEach(() => {
    vi.clearAllMocks();

    global.URL.createObjectURL = mockCreateObjectURL;
    mockCreateObjectURL.mockReturnValue('blob:mock-url');

    consoleErrorSpy.mockClear();

    Object.defineProperty(window, 'location', {
      value: { origin: 'https://example.com' },
      writable: true,
    });
  });

  it('should create object URL for valid image file', () => {
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const result = sanitizeAvatars(mockFile, 'https://fallback.com/avatar.jpg');

    expect(mockCreateObjectURL).toHaveBeenCalledWith(mockFile);
    expect(result).toBe('blob:mock-url');
  });

  it('should reject non-image files and use fallback', () => {
    const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    const fallbackUrl = 'https://fallback.com/avatar.jpg';
    const result = sanitizeAvatars(mockFile, fallbackUrl);

    expect(mockCreateObjectURL).not.toHaveBeenCalled();
    expect(result).toBe(fallbackUrl);
  });

  it('should handle null file input', () => {
    const fallbackUrl = 'https://fallback.com/avatar.jpg';
    const result = sanitizeAvatars(null, fallbackUrl);

    expect(mockCreateObjectURL).not.toHaveBeenCalled();
    expect(result).toBe(fallbackUrl);
  });

  it('should handle relative URLs by using window.location.origin', () => {
    const result = sanitizeAvatars(null, '/avatar.jpg');
    expect(result).toBe('https://example.com/avatar.jpg');
  });

  it('should handle URLs with query parameters', () => {
    const result = sanitizeAvatars(
      null,
      'https://example.com/avatar.jpg?size=large&version=2',
    );
    expect(result).toBe('https://example.com/avatar.jpg?size=large&version=2');
  });

  it('should handle URLs with fragments', () => {
    const result = sanitizeAvatars(null, 'https://example.com/avatar.jpg#top');
    expect(result).toBe('https://example.com/avatar.jpg#top');
  });

  it('should properly handle Unicode characters in URLs', () => {
    const result = sanitizeAvatars(null, 'https://example.com/üser/avatär.jpg');
    expect(result).toBe('https://example.com/%C3%BCser/avat%C3%A4r.jpg');
  });
});
