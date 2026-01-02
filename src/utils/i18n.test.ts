import { describe, it, expect, beforeEach } from 'vitest';
import i18n from './i18n';

describe('i18n Configuration', () => {
  beforeEach(async () => {
    // Reset i18n instance before each test
    await i18n.init();
  });

  it('should have auth namespace as default', () => {
    expect(i18n.options.defaultNS).toBe('auth');
  });

  it('should have bundled English login translations', () => {
    expect(i18n.hasResourceBundle('en', 'auth')).toBe(true);
  });

  it('should load critical login strings from bundled resources', () => {
    // Test some critical login strings
    expect(i18n.t('title', { ns: 'auth' })).toBe('Talawa Admin');
    expect(i18n.t('email', { ns: 'auth' })).toBe('Email');
    expect(i18n.t('password', { ns: 'auth' })).toBe('Password');
    expect(i18n.t('login', { ns: 'auth' })).toBe('Log in');
    expect(i18n.t('register', { ns: 'auth' })).toBe('Sign up');
    expect(i18n.t('userLogin', { ns: 'auth' })).toBe('User Login');
    expect(i18n.t('adminLogin', { ns: 'auth' })).toBe('Admin Login');
    expect(i18n.t('confirmPassword', { ns: 'auth' })).toBe('Confirm Password');
    expect(i18n.t('forgotPassword', { ns: 'auth' })).toBe('Forgot Password?');
    expect(i18n.t('enterEmail', { ns: 'auth' })).toBe('Enter Email');
    expect(i18n.t('enterPassword', { ns: 'auth' })).toBe('Enter Password');
    expect(i18n.t('selectOrganization', { ns: 'auth' })).toBe(
      'Select an organization',
    );
    expect(i18n.t('organizations', { ns: 'auth' })).toBe('Organizations');
    expect(i18n.t('OR', { ns: 'auth' })).toBe('OR');
    expect(i18n.t('loading', { ns: 'auth' })).toBe('Loading...');
    expect(i18n.t('backToLogin', { ns: 'auth' })).toBe('Back to Login');
  });

  it('should have chained backend configured', () => {
    const backendOptions = i18n.options.backend as {
      backends?: unknown[];
      backendOptions?: Array<{
        expirationTime?: number;
        loadPath?: string;
      }>;
    };
    expect(backendOptions?.backends).toHaveLength(2);
  });

  it('should have partial bundled languages enabled', () => {
    expect(i18n.options.partialBundledLanguages).toBe(true);
  });

  it('should have correct cache expiration time', () => {
    const backendOptions = i18n.options.backend as {
      backends?: unknown[];
      backendOptions?: Array<{
        expirationTime?: number;
        loadPath?: string;
      }>;
    };
    expect(backendOptions?.backendOptions?.[0]?.expirationTime).toBe(
      7 * 24 * 60 * 60 * 1000,
    );
  });

  it('should have correct load path for HTTP backend', () => {
    const backendOptions = i18n.options.backend as {
      backends?: unknown[];
      backendOptions?: Array<{
        expirationTime?: number;
        loadPath?: string;
      }>;
    };
    expect(backendOptions?.backendOptions?.[1]?.loadPath).toBe(
      '/locales/{{lng}}/{{ns}}.json',
    );
  });

  it('should have password validation translations bundled', () => {
    expect(i18n.t('lowercaseCheck', { ns: 'auth' })).toBe(
      'At least one lowercase letter',
    );
    expect(i18n.t('uppercaseCheck', { ns: 'auth' })).toBe(
      'At least one uppercase letter',
    );
    expect(i18n.t('numericValueCheck', { ns: 'auth' })).toBe(
      'At least one numeric value',
    );
    expect(i18n.t('specialCharCheck', { ns: 'auth' })).toBe(
      'At least one special character',
    );
    expect(i18n.t('atLeastSixCharLong', { ns: 'auth' })).toBe(
      'At least 6 characters long',
    );
  });

  it('should have error messages bundled', () => {
    expect(i18n.t('nameInvalid', { ns: 'auth' })).toBe(
      'Name should contain only letters, spaces, and hyphens',
    );
    expect(i18n.t('passwordInvalid', { ns: 'auth' })).toBe(
      'Password should contain at least one lowercase letter, one uppercase letter, one numeric value and one special character',
    );
    expect(i18n.t('emailInvalid', { ns: 'auth' })).toBe(
      'Please enter a valid email address',
    );
    expect(i18n.t('passwordMismatches', { ns: 'auth' })).toBe(
      'Password and confirm password do not match.',
    );
    expect(i18n.t('captchaError', { ns: 'auth' })).toBe('Captcha Error!');
  });
});
