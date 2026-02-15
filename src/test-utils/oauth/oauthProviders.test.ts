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
    type ProviderKey = keyof typeof OAUTH_PROVIDERS;

    // Snapshot original enabled flags (fully typed, no any)
    const originalEnabled: Record<ProviderKey, boolean> = {} as Record<
      ProviderKey,
      boolean
    >;

    (Object.keys(OAUTH_PROVIDERS) as ProviderKey[]).forEach((k) => {
      originalEnabled[k] = OAUTH_PROVIDERS[k].enabled;
      OAUTH_PROVIDERS[k].enabled = false;
    });

    expect(getEnabledProviders()).toHaveLength(0);

    // Restore original state
    (Object.keys(OAUTH_PROVIDERS) as ProviderKey[]).forEach((k) => {
      OAUTH_PROVIDERS[k].enabled = originalEnabled[k];
    });
  });
});
