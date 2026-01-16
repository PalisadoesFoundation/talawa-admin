import { generateSecurePassword } from './generateSecurePassword';

describe('generateSecurePassword', () => {
  it('should generate password with length >= 12', () => {
    const password = generateSecurePassword();
    expect(password.length).toBeGreaterThanOrEqual(12);
  });

  it('should contain at least one uppercase letter', () => {
    const password = generateSecurePassword();
    expect(/[A-Z]/.test(password)).toBe(true);
  });

  it('should contain at least one lowercase letter', () => {
    const password = generateSecurePassword();
    expect(/[a-z]/.test(password)).toBe(true);
  });

  it('should contain at least one number', () => {
    const password = generateSecurePassword();
    expect(/[0-9]/.test(password)).toBe(true);
  });

  it('should contain at least one special character', () => {
    const password = generateSecurePassword();
    expect(/[!@#$%^&*(),.?":{}|<>]/.test(password)).toBe(true);
  });

  it('should generate different passwords each time', () => {
    const p1 = generateSecurePassword();
    const p2 = generateSecurePassword();
    expect(p1).not.toBe(p2);
  });
});
