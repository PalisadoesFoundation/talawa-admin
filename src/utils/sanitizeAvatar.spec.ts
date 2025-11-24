import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sanitizeAvatars } from './sanitizeAvatar';

describe('sanitizeAvatars', () => {
  let mockCreateObjectURL: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateObjectURL = vi.fn();
    global.URL.createObjectURL = mockCreateObjectURL;
    mockCreateObjectURL.mockReturnValue('blob:mock-url');

    // Reset console.error spy for each test
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    Object.defineProperty(window, 'location', {
      value: { origin: 'https://example.com' },
      writable: true,
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
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

  it('should handle empty fallbackUrl', () => {
    const result = sanitizeAvatars(null, '');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Invalid fallback URL provided',
    );
    expect(result).toBe('');
  });

  it('should handle undefined fallbackUrl', () => {
    // @ts-expect-error Testing undefined case
    const result = sanitizeAvatars(null, undefined);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Invalid fallback URL provided',
    );
    expect(result).toBe('');
  });

  it('should handle invalid URLs and return empty string', () => {
    const result = sanitizeAvatars(null, '');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Invalid fallback URL provided',
    );
    expect(result).toBe('');
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
