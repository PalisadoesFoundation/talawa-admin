import { describe, it, expect } from 'vitest';
import { validatePassword } from './passwordValidator';

describe('validatePassword', () => {
  it('returns error key if password is shorter than 8 characters', () => {
    const result = validatePassword('Ab1!');
    expect(result).toBe('passwordValidation.minLength');
  });

  it('returns error key if password has no uppercase letter', () => {
    const result = validatePassword('abcd123!');
    expect(result).toBe('passwordValidation.uppercaseRequired');
  });

  it('returns error key if password has no lowercase letter', () => {
    const result = validatePassword('ABCD123!');
    expect(result).toBe('passwordValidation.lowercaseRequired');
  });

  it('returns error key if password has no number', () => {
    const result = validatePassword('Abcdefg!');
    expect(result).toBe('passwordValidation.numberRequired');
  });

  it('returns error key if password has no special character', () => {
    const result = validatePassword('Abcd1234');
    expect(result).toBe('passwordValidation.specialCharRequired');
  });

  it('returns null for a valid password', () => {
    const result = validatePassword('Abcd123!');
    expect(result).toBeNull();
  });
});
