import { describe, it, expect } from 'vitest';
import { getSafeImageSrc } from './GroupChatDetailsUtils';

describe('getSafeImageSrc', () => {
  it('returns undefined for undefined or null', () => {
    expect(getSafeImageSrc()).toBeUndefined();
    expect(getSafeImageSrc(null)).toBeUndefined();
  });

  it('returns the same URL for http and https', () => {
    expect(getSafeImageSrc('http://example.com/image.png')).toBe(
      'http://example.com/image.png',
    );
    expect(getSafeImageSrc('https://example.com/image.png')).toBe(
      'https://example.com/image.png',
    );
  });

  it('allows data and blob URLs', () => {
    expect(getSafeImageSrc('data:image/png;base64,AAA')).toBe(
      'data:image/png;base64,AAA',
    );
    expect(getSafeImageSrc('blob:http://localhost/1234')).toBe(
      'blob:http://localhost/1234',
    );
  });

  it('rejects dangerous protocols and file URLs', () => {
    expect(getSafeImageSrc('javascript:alert(1)')).toBeUndefined();
    expect(getSafeImageSrc('file:///etc/passwd')).toBeUndefined();
  });

  it('returns undefined for malformed strings', () => {
    expect(getSafeImageSrc('not a url')).toBeUndefined();
  });
});
