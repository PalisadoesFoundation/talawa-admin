import { describe, it, expect } from 'vitest';
import { validatePassword } from './passwordValidator';

describe('validatePassword', () => {
  it('returns error if password is shorter than 8 characters', () => {
    const result = validatePassword('Ab1!');
    expect(result).toBe('Password must be at least 8 characters long.');
  });

  it('returns error if password has no uppercase letter', () => {
    const result = validatePassword('abcd123!');
    expect(result).toBe('Password must contain at least one uppercase letter.');
  });

  it('returns error if password has no lowercase letter', () => {
    const result = validatePassword('ABCD123!');
    expect(result).toBe('Password must contain at least one lowercase letter.');
  });

  it('returns error if password has no number', () => {
    const result = validatePassword('Abcdefg!');
    expect(result).toBe('Password must contain at least one number.');
  });

  it('returns error if password has no special character', () => {
    const result = validatePassword('Abcd1234');
    expect(result).toBe(
      'Password must contain at least one special character.',
    );
  });

  it('returns null for a valid password', () => {
    const result = validatePassword('Abcd123!');
    expect(result).toBeNull();
  });
});
