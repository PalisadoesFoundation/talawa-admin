import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sanitizeAvatars } from './sanitizeAvatar';

describe('sanitizeAvatars', () => {
  let mockCreateObjectURL: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateObjectURL = vi.fn();
    global.URL.createObjectURL = mockCreateObjectURL;
    mockCreateObjectURL.mockReturnValue('blob:mock-url');

    Object.defineProperty(window, 'location', {
      value: { origin: 'https://example.com' },
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('should create object URL for valid image file', () => {
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const result = sanitizeAvatars(mockFile, 'https://fallback.com/avatar.jpg');
    expect(mockCreateObjectURL).toHaveBeenCalledWith(mockFile);
    expect(result).toBe('blob:mock-url');
  });

  it('should reject SVG files and use fallback', () => {
    const mockFile = new File([''], 'test.svg', { type: 'image/svg+xml' });
    const fallbackUrl = 'https://fallback.com/avatar.jpg';
    const result = sanitizeAvatars(mockFile, fallbackUrl);
    expect(mockCreateObjectURL).not.toHaveBeenCalled();
    expect(result).toBe(fallbackUrl);
  });

  it('should return empty string when object URL does not start with blob:', () => {
    mockCreateObjectURL.mockReturnValue(
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD',
    );
    const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const result = sanitizeAvatars(mockFile, 'https://fallback.com/avatar.jpg');
    expect(mockCreateObjectURL).toHaveBeenCalledWith(mockFile);
    expect(result).toBe('');
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
    expect(result).toBe('');
  });

  it('should handle undefined fallbackUrl', () => {
    // @ts-expect-error Testing undefined case
    const result = sanitizeAvatars(null, undefined);
    expect(result).toBe('');
  });

  it('should handle invalid URLs and return empty string', () => {
    const result = sanitizeAvatars(null, 'ht://invalid-url');
    expect(result).toBe('');
  });

  it('should handle malformed URLs that trigger catch block', () => {
    // Mock URL constructor to throw an error
    const originalURL = global.URL;
    global.URL = class extends originalURL {
      constructor(url: string | URL, base?: string | URL) {
        if (url === 'malformed-url') {
          throw new Error('Invalid URL');
        }
        super(url, base);
      }
    } as typeof URL;

    const result = sanitizeAvatars(null, 'malformed-url');
    expect(result).toBe('');

    // Restore original URL constructor
    global.URL = originalURL;
  });

  it('should reject URLs with non-http/https protocols', () => {
    const result = sanitizeAvatars(null, 'ftp://example.com/avatar.jpg');
    expect(result).toBe('');
  });

  it('should reject javascript: URLs', () => {
    const result = sanitizeAvatars(null, 'javascript:alert(1)');
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
