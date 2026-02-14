import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { brandForProvider } from './oauthBrand';

// Mock CSS modules
vi.mock('./oauthBrand.module.css', () => ({
  default: {
    logo: 'logo',
    googleButton: 'googleButton',
    githubButton: 'githubButton',
  },
}));

// Mock react-icons
vi.mock('react-icons/fc', () => ({
  FcGoogle: vi.fn(() => <span data-testid="google-icon">Google Icon</span>),
}));

vi.mock('react-icons/fa', () => ({
  FaGithub: vi.fn(() => <span data-testid="github-icon">GitHub Icon</span>),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('oauthBrand', () => {
  describe('brandForProvider', () => {
    it('returns Google brand configuration for GOOGLE provider', () => {
      const brand = brandForProvider('GOOGLE');

      expect(brand).toBeDefined();
      expect(brand.displayName).toBe('Google');
      expect(brand.className).toBe('googleButton');
      expect(React.isValidElement(brand.icon)).toBe(true);
    });

    it('returns GitHub brand configuration for GITHUB provider', () => {
      const brand = brandForProvider('GITHUB');

      expect(brand).toBeDefined();
      expect(brand.displayName).toBe('GitHub');
      expect(brand.className).toBe('githubButton');
      expect(React.isValidElement(brand.icon)).toBe(true);
    });

    it('returns Google brand as fallback for unknown provider', () => {
      const brand = brandForProvider('UNKNOWN_PROVIDER');

      expect(brand).toBeDefined();
      expect(brand.displayName).toBe('Google');
      expect(brand.className).toBe('googleButton');
      expect(React.isValidElement(brand.icon)).toBe(true);
    });

    it('returns Google brand as fallback for empty string provider', () => {
      const brand = brandForProvider('');

      expect(brand).toBeDefined();
      expect(brand.displayName).toBe('Google');
      expect(brand.className).toBe('googleButton');
      expect(React.isValidElement(brand.icon)).toBe(true);
    });

    it('handles case-sensitive provider keys', () => {
      const lowerCaseGoogle = brandForProvider('google');
      const upperCaseGoogle = brandForProvider('GOOGLE');

      // lowercase should fallback to Google (since keys are uppercase)
      expect(lowerCaseGoogle.displayName).toBe('Google');
      expect(lowerCaseGoogle.className).toBe('googleButton');

      // uppercase should work correctly
      expect(upperCaseGoogle.displayName).toBe('Google');
      expect(upperCaseGoogle.className).toBe('googleButton');
    });

    it('returns consistent object structure for all providers', () => {
      const googleBrand = brandForProvider('GOOGLE');
      const githubBrand = brandForProvider('GITHUB');
      const unknownBrand = brandForProvider('UNKNOWN');

      // Check that all brands have the required properties
      [googleBrand, githubBrand, unknownBrand].forEach((brand) => {
        expect(brand).toHaveProperty('icon');
        expect(brand).toHaveProperty('displayName');
        expect(brand).toHaveProperty('className');
        expect(typeof brand.displayName).toBe('string');
        expect(typeof brand.className).toBe('string');
        expect(React.isValidElement(brand.icon)).toBe(true);
      });
    });

    it('returns different configurations for different providers', () => {
      const googleBrand = brandForProvider('GOOGLE');
      const githubBrand = brandForProvider('GITHUB');

      expect(googleBrand.displayName).not.toBe(githubBrand.displayName);
      expect(googleBrand.className).not.toBe(githubBrand.className);
    });

    it('preserves referential equality for same provider calls', () => {
      const brand1 = brandForProvider('GOOGLE');
      const brand2 = brandForProvider('GOOGLE');

      // The objects should be the same reference since they come from the same record
      expect(brand1).toBe(brand2);
    });

    it('handles special characters in provider names', () => {
      const brand = brandForProvider('PROVIDER-WITH-DASHES');

      // Should fallback to Google
      expect(brand.displayName).toBe('Google');
      expect(brand.className).toBe('googleButton');
    });

    it('handles numeric provider keys', () => {
      const brand = brandForProvider('123');

      // Should fallback to Google
      expect(brand.displayName).toBe('Google');
      expect(brand.className).toBe('googleButton');
    });
  });

  describe('ProviderBrand structure validation', () => {
    it('Google brand has all required properties with correct types', () => {
      const brand = brandForProvider('GOOGLE');

      expect(typeof brand.displayName).toBe('string');
      expect(typeof brand.className).toBe('string');
      expect(React.isValidElement(brand.icon)).toBe(true);
      expect(brand.displayName.length).toBeGreaterThan(0);
      expect(brand.className.length).toBeGreaterThan(0);
    });

    it('GitHub brand has all required properties with correct types', () => {
      const brand = brandForProvider('GITHUB');

      expect(typeof brand.displayName).toBe('string');
      expect(typeof brand.className).toBe('string');
      expect(React.isValidElement(brand.icon)).toBe(true);
      expect(brand.displayName.length).toBeGreaterThan(0);
      expect(brand.className.length).toBeGreaterThan(0);
    });
  });
});
