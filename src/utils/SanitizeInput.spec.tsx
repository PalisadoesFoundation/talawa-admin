import { describe, it, expect } from 'vitest';
import { sanitizeInput } from './SanitizeInput';

describe('sanitizeInput', () => {
  it('returns empty string for empty input', () => {
    expect(sanitizeInput('')).toBe('');
  });

  it('returns empty string for undefined or null-like values', () => {
    // TypeScript prevents undefined, but runtime safety check
    expect(sanitizeInput(undefined as unknown as string)).toBe('');
  });

  it('removes HTML tags', () => {
    const input = '<script>alert("xss")</script>';
    const result = sanitizeInput(input);

    expect(result).toBe('scriptalert(xss)/script');
    expect(result).not.toMatch(/[<>]/);
  });

  it('removes dangerous protocols', () => {
    const input = 'javascript:alert(1)';
    const result = sanitizeInput(input);

    expect(result.toLowerCase()).not.toContain('javascript:');
    expect(result).toBe('alert(1)');
  });

  it('removes encoded dangerous protocols', () => {
    const input = '&lt;img src=&quot;javascript:alert(1)&quot;&gt;';
    const result = sanitizeInput(input);

    expect(result.toLowerCase()).not.toContain('javascript:');
    expect(result).not.toMatch(/[<>"]/);
  });

  it('decodes HTML entities before sanitization', () => {
    const input = '&lt;script&gt;alert&#40;1&#41;&lt;/script&gt;';
    const result = sanitizeInput(input);

    expect(result).not.toMatch(/[<>]/);
  });

  it('removes quotes and backticks', () => {
    const input = `" ' \` test`;
    const result = sanitizeInput(input);

    expect(result).toBe('test');
    expect(result).not.toMatch(/["'`]/);
  });

  it('removes backslashes', () => {
    const input = 'alert\\("xss"\\)';
    const result = sanitizeInput(input);

    expect(result).toBe('alert(xss)');
    expect(result).not.toContain('\\');
  });

  it('handles multiple sanitization passes correctly', () => {
    const input =
      '&amp;lt;script&amp;gt;javascript:alert(1)&amp;lt;/script&amp;gt;';
    const result = sanitizeInput(input);

    expect(result.toLowerCase()).not.toContain('javascript');
    expect(result).not.toMatch(/[<>]/);
  });

  it('does not modify safe input unnecessarily', () => {
    const input = 'Hello world 123 _-.';
    const result = sanitizeInput(input);

    expect(result).toBe(input);
  });

  it('trims leading and trailing whitespace', () => {
    const input = '   alert(1)   ';
    const result = sanitizeInput(input);

    expect(result).toBe('alert(1)');
  });
});
