// sanitizeInput.test.ts
import { describe, it, expect } from 'vitest';
import { sanitizeInput } from './SanitizeInput';

describe('sanitizeInput', () => {
  it('should return an empty string for undefined or empty input', () => {
    expect(sanitizeInput('')).toBe('');
    expect(sanitizeInput(undefined as unknown as string)).toBe('');
    expect(sanitizeInput(null as unknown as string)).toBe('');
  });

  it('should remove script tags and HTML characters', () => {
    const input = 'John';
    const output = sanitizeInput(input);
    expect(output).toBe('John'); // <, >, " removed
  });

  it('should remove javascript: protocol', () => {
    const input = 'javascript:alert("XSS")';
    const output = sanitizeInput(input);
    expect(output).toBe('alert(XSS)');
  });

  it('should remove inline event handlers', () => {
    const input = 'Click me';
    const output = sanitizeInput(input);
    expect(output).toBe('Click me');
  });

  it('should trim leading and trailing spaces', () => {
    const input = '   Hello World   ';
    const output = sanitizeInput(input);
    expect(output).toBe('Hello World');
  });

  it('should not modify safe strings', () => {
    const input = 'John Doe';
    const output = sanitizeInput(input);
    expect(output).toBe('John Doe');
  });
});
