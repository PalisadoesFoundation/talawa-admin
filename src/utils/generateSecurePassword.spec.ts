import { generateSecurePassword } from './generateSecurePassword';
import { vi } from 'vitest';

describe('generateSecurePassword', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
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

  it('should generate non-identical passwords across multiple attempts', () => {
    const passwords = new Set(
      Array.from({ length: 5 }, () => generateSecurePassword()),
    );
    expect(passwords.size).toBeGreaterThan(1); 
  });
});
