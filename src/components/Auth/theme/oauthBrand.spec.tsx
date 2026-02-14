import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { brandForProvider } from './oauthBrand';
import { cleanup } from '@testing-library/react';

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
  vi.restoreAllMocks();
  cleanup();
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
