import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  OAUTH_PROVIDERS,
  getProviderConfig,
  getEnabledProviders,
} from '../../../src/config/oauthProviders';

/**
 * NOTE:
 * import.meta.env is static in Vite, so we mock it using vi.stubGlobal
 */

describe('OAuth Providers Configuration', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('should contain GOOGLE and GITHUB providers', () => {
    expect(OAUTH_PROVIDERS.GOOGLE).toBeDefined();
    expect(OAUTH_PROVIDERS.GITHUB).toBeDefined();
  });

  it('should return correct provider config', () => {
    const google = getProviderConfig('GOOGLE');

    expect(google.id).toBe('GOOGLE');
    expect(google.displayName).toBe('Google');
    expect(google.scopes).toContain('email');
  });

  it('should mark provider enabled when env vars exist', () => {
    const provider = OAUTH_PROVIDERS.GOOGLE;

    if (provider.clientId && provider.redirectUri) {
      expect(provider.enabled).toBe(true);
    }
  });

  it('should return only enabled providers', () => {
    const enabled = getEnabledProviders();

    expect(Array.isArray(enabled)).toBe(true);

    enabled.forEach((provider) => {
      expect(provider.enabled).toBe(true);
    });
  });

  it('should return empty array if no providers enabled', () => {
    const original = { ...OAUTH_PROVIDERS };

    // Temporarily disable providers
    Object.values(OAUTH_PROVIDERS).forEach((p) => {
      p.enabled = false;
    });

    const enabled = getEnabledProviders();

    expect(enabled.length).toBe(0);

    // restore
    Object.assign(OAUTH_PROVIDERS, original);
  });

  it('getProviderConfig should return correct object reference', () => {
    const config = getProviderConfig('GITHUB');

    expect(config).toBe(OAUTH_PROVIDERS.GITHUB);
  });
});
