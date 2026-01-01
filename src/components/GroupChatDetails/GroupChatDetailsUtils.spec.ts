import { describe, it, expect } from 'vitest';
import { getSafeImageSrc, sanitizeText } from './GroupChatDetailsUtils';

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

describe('sanitizeText', () => {
  it('returns empty string for undefined or null', () => {
    expect(sanitizeText()).toBe('');
    expect(sanitizeText(null)).toBe('');
    expect(sanitizeText(undefined)).toBe('');
  });

  it('returns empty string for non-string values', () => {
    expect(sanitizeText(123 as unknown as string)).toBe('');
    expect(sanitizeText({} as unknown as string)).toBe('');
  });

  it('escapes HTML tags to prevent XSS', () => {
    expect(sanitizeText('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;',
    );
    expect(sanitizeText('Hello <b>World</b>')).toBe(
      'Hello &lt;b&gt;World&lt;&#x2F;b&gt;',
    );
    expect(sanitizeText('<img src=x onerror=alert(1)>')).toBe(
      '&lt;img src=x onerror=alert(1)&gt;',
    );
  });

  it('escapes special HTML characters', () => {
    expect(sanitizeText('Hello & goodbye')).toBe('Hello &amp; goodbye');
    expect(sanitizeText('5 < 10 > 3')).toBe('5 &lt; 10 &gt; 3');
    expect(sanitizeText('Say "hello"')).toBe('Say &quot;hello&quot;');
    expect(sanitizeText("It's working")).toBe('It&#x27;s working');
    expect(sanitizeText('a/b/c')).toBe('a&#x2F;b&#x2F;c');
  });

  it('handles mixed HTML tags and special characters', () => {
    expect(sanitizeText('<a href="javascript:alert(\'XSS\')">Click</a>')).toBe(
      '&lt;a href=&quot;javascript:alert(&#x27;XSS&#x27;)&quot;&gt;Click&lt;&#x2F;a&gt;',
    );
    expect(sanitizeText('Test <script>alert("XSS")</script> & more')).toBe(
      'Test &lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt; &amp; more',
    );
  });

  it('preserves normal text', () => {
    expect(sanitizeText('Hello World')).toBe('Hello World');
    expect(sanitizeText('Test 123')).toBe('Test 123');
  });

  it('handles empty strings', () => {
    expect(sanitizeText('')).toBe('');
    expect(sanitizeText('   ')).toBe('   ');
  });
});
