import { describe, it, expect } from 'vitest';
import { validateRecaptcha } from './validateRecaptcha';

describe('validateRecaptcha', () => {
  it('should return true for a valid Recaptcha string', () => {
    const validRecaptcha = 'ss7BEe32HPoDKTPXQevFkVvpvPzGebE2kIRv1ok4';
    expect(validateRecaptcha(validRecaptcha)).toBe(true);
  });

  it('should return false for an invalid Recaptcha string with special characters', () => {
    const invalidRecaptcha = 'invalid@recaptcha!';
    expect(validateRecaptcha(invalidRecaptcha)).toBe(false);
  });

  it('should return false for an invalid Recaptcha string with incorrect length', () => {
    const invalidRecaptcha = 'shortstring';
    expect(validateRecaptcha(invalidRecaptcha)).toBe(false);
  });

  it('should return false for an invalid Recaptcha string with spaces', () => {
    const invalidRecaptcha = 'invalid recaptcha string';
    expect(validateRecaptcha(invalidRecaptcha)).toBe(false);
  });
});
