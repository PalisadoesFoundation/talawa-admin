import { describe, it, expect } from 'vitest';
import { sanitizeInput } from './SanitizeInput';

describe('sanitizeInput', () => {
  it('returns empty string for empty input', () => {
    expect(sanitizeInput('')).toBe('');
  });

  it('removes script tags and their content', () => {
    const input = '<script>alert("XSS")</script>Hello';
    expect(sanitizeInput(input)).toBe('Hello');
  });

  it('removes inline event handlers', () => {
    const input = '<div onclick="alert(1)">Click me</div>';
    expect(sanitizeInput(input)).toBe('Click me');
  });

  it('removes javascript protocol', () => {
    const input = 'javascript:alert(1)';
    expect(sanitizeInput(input)).toBe('alert(1)');
  });

  it('removes data and vbscript protocols', () => {
    expect(sanitizeInput('data:text/html;base64,xyz')).toBe(
      'text/html;base64,xyz',
    );
    expect(sanitizeInput('vbscript:msgbox(1)')).toBe('msgbox(1)');
  });

  it('strips all HTML tags', () => {
    const input = '<p>Hello <strong>World</strong></p>';
    expect(sanitizeInput(input)).toBe('Hello World');
  });

  it('decodes and sanitizes HTML entities', () => {
    const input = '&lt;script&gt;alert(1)&lt;/script&gt;';
    expect(sanitizeInput(input)).toBe('');
  });

  it('removes dangerous characters', () => {
    const input = `"<>'\``;
    expect(sanitizeInput(input)).toBe('');
  });

  it('removes backslashes', () => {
    const input = 'Hello\\World';
    expect(sanitizeInput(input)).toBe('HelloWorld');
  });

  it('handles mixed XSS payload safely', () => {
    const input =
      `<img src="x" onerror="alert(1)">` +
      `<script>alert(2)</script>` +
      `javascript:alert(3)`;

    expect(sanitizeInput(input)).toBe('alert(3)');
  });

  it('is idempotent (multiple passes do not change output)', () => {
    const input = '<script>alert(1)</script>Test';
    const once = sanitizeInput(input);
    const twice = sanitizeInput(once);

    expect(once).toBe(twice);
  });

  it('trims whitespace from the result', () => {
    const input = '   <b>Hello</b>   ';
    expect(sanitizeInput(input)).toBe('Hello');
  });
});
