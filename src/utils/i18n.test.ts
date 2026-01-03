// SKIP_LOCALSTORAGE_CHECK

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import i18n from './i18n';
import LocalStorageBackend from 'i18next-localstorage-backend';
import HttpApi from 'i18next-http-backend';

type I18nBackendOptions = {
  backends?: unknown[];
  backendOptions?: Array<{
    expirationTime?: number;
    loadPath?: string;
  }>;
};

describe('i18n Configuration', () => {
  beforeEach(async () => {
    localStorage.clear();
    vi.clearAllMocks();

    // Reset i18n instance
    await i18n.init();
  });

  afterEach(async () => {
    localStorage.clear();
    vi.clearAllMocks();

    await i18n.changeLanguage('en');
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
    expect(i18n.t('name', { ns: 'auth' })).toBe('Name');
    expect(i18n.t('or', { ns: 'auth' })).toBe('OR');
    expect(i18n.t('loading', { ns: 'auth' })).toBe('Loading...');
    expect(i18n.t('backToLogin', { ns: 'auth' })).toBe('Back to Login');
  });

  it('should have chained backend configured', () => {
    const backendOptions = i18n.options.backend as I18nBackendOptions;
    expect(backendOptions?.backends).toHaveLength(2);

    const backends = backendOptions?.backends;
    expect(backends?.[0]).toBe(LocalStorageBackend);
    expect(backends?.[1]).toBe(HttpApi);
  });

  it('should have partial bundled languages enabled', () => {
    expect(i18n.options.partialBundledLanguages).toBe(true);
  });

  it('should have correct cache expiration time', () => {
    const backendOptions = i18n.options.backend as I18nBackendOptions;
    expect(backendOptions?.backendOptions?.[0]?.expirationTime).toBe(
      7 * 24 * 60 * 60 * 1000,
    );
  });

  it('should have correct load path for HTTP backend', () => {
    const backendOptions = i18n.options.backend as I18nBackendOptions;
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
    expect(i18n.t('pleaseCheckTheCaptcha', { ns: 'auth' })).toBe(
      'Please, check the captcha.',
    );
  });

  it('should have password requirement translations bundled', () => {
    expect(i18n.t('requirementMinLength', { ns: 'auth' })).toBe(
      'At least 8 characters',
    );
    expect(i18n.t('requirementLowercase', { ns: 'auth' })).toBe(
      'Contains lowercase',
    );
    expect(i18n.t('requirementUppercase', { ns: 'auth' })).toBe(
      'Contains uppercase',
    );
    expect(i18n.t('requirementNumber', { ns: 'auth' })).toBe(
      'Contains a number',
    );
    expect(i18n.t('requirementSpecialChar', { ns: 'auth' })).toBe(
      'Contains a special character',
    );
  });

  // Edge-case tests
  describe('Language Switching', () => {
    it('should handle language switching and maintain bundled translations', async () => {
      expect(i18n.t('title', { ns: 'auth' })).toBe('Talawa Admin');
      expect(i18n.t('email', { ns: 'auth' })).toBe('Email');
      expect(i18n.language).toBe('en');

      await i18n.changeLanguage('es');
      expect(i18n.language).toBe('es');

      expect(i18n.t('title', { ns: 'auth' })).toBe('Talawa Admin');
      expect(i18n.t('email', { ns: 'auth' })).toBe('Email');

      await i18n.changeLanguage('en');
      expect(i18n.language).toBe('en');
      expect(i18n.t('title', { ns: 'auth' })).toBe('Talawa Admin');
    });
  });

  describe('Missing Translation Fallback', () => {
    it('should return key string for non-existent keys', () => {
      const missingKey = 'nonExistentKey';
      const result = i18n.t(missingKey, { ns: 'auth' });
      expect(result).toBe(missingKey);

      const nestedMissingKey = 'nested.nonExistent.key';
      const nestedResult = i18n.t(nestedMissingKey, { ns: 'auth' });
      expect(nestedResult).toBe(nestedMissingKey);
    });

    it('should handle missing keys with default values', () => {
      const defaultValue = 'Default Value';
      const result = i18n.t('nonExistentKey', {
        ns: 'auth',
        defaultValue,
      });
      expect(result).toBe(defaultValue);
    });
  });

  describe('Backend Fallback', () => {
    it('should handle localStorage clearing and resource reloading', async () => {
      expect(i18n.t('title', { ns: 'auth' })).toBe('Talawa Admin');

      localStorage.clear();
      await i18n.reloadResources();

      expect(i18n.t('title', { ns: 'auth' })).toBe('Talawa Admin');
      expect(i18n.t('email', { ns: 'auth' })).toBe('Email');
    });

    it('should maintain bundled resources after re-initialization', async () => {
      expect(i18n.t('login', { ns: 'auth' })).toBe('Log in');

      localStorage.clear();
      await i18n.init();

      expect(i18n.hasResourceBundle('en', 'auth')).toBe(true);
      expect(i18n.t('login', { ns: 'auth' })).toBe('Log in');
      expect(i18n.t('password', { ns: 'auth' })).toBe('Password');
    });
  });

  describe('Namespace Isolation', () => {
    it('should maintain auth namespace isolation', async () => {
      expect(i18n.hasResourceBundle('en', 'auth')).toBe(true);
      expect(i18n.t('title', { ns: 'auth' })).toBe('Talawa Admin');

      expect(i18n.hasResourceBundle('en', 'translation')).toBe(false);
      expect(i18n.hasResourceBundle('en', 'common')).toBe(false);

      const translationResult = i18n.t('someKey', { ns: 'translation' });
      expect(translationResult).toBe('someKey');

      expect(i18n.t('email', { ns: 'auth' })).toBe('Email');
      expect(i18n.t('password', { ns: 'auth' })).toBe('Password');
    });

    it('should not leak keys between namespaces', () => {
      expect(i18n.t('title', { ns: 'translation' })).toBe('title');
      expect(i18n.t('email', { ns: 'common' })).toBe('email');

      expect(i18n.t('title', { ns: 'auth' })).toBe('Talawa Admin');
      expect(i18n.t('email', { ns: 'auth' })).toBe('Email');
    });

    it('should handle default namespace correctly', () => {
      expect(i18n.options.defaultNS).toBe('auth');

      expect(i18n.t('title')).toBe('Talawa Admin');
      expect(i18n.t('login')).toBe('Log in');

      expect(i18n.t('title', { ns: 'auth' })).toBe('Talawa Admin');
      expect(i18n.t('login', { ns: 'auth' })).toBe('Log in');
    });
  });

  describe('Performance and Caching', () => {
    it('should have correct cache configuration', () => {
      const backendOptions = i18n.options.backend as I18nBackendOptions;

      expect(backendOptions?.backends?.[0]).toBe(LocalStorageBackend);

      expect(backendOptions?.backendOptions?.[0]?.expirationTime).toBe(
        7 * 24 * 60 * 60 * 1000,
      );
    });

    it('should prioritize bundled resources over backend loading', () => {
      expect(i18n.hasResourceBundle('en', 'auth')).toBe(true);

      const startTime = Date.now();
      const result = i18n.t('title', { ns: 'auth' });
      const endTime = Date.now();

      expect(result).toBe('Talawa Admin');
      expect(endTime - startTime).toBeLessThan(10);
    });
  });
});
