import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('OAuth Providers Configuration', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('should contain GOOGLE and GITHUB providers', async () => {
    const { OAUTH_PROVIDERS } = await import('config/oauthProviders');

    expect(OAUTH_PROVIDERS.GOOGLE).toBeDefined();
    expect(OAUTH_PROVIDERS.GITHUB).toBeDefined();
  });

  it('should return correct provider config', async () => {
    const { getProviderConfig } = await import('config/oauthProviders');

    const google = getProviderConfig('GOOGLE');

    expect(google.id).toBe('GOOGLE');
    expect(google.displayName).toBe('Google');
    expect(google.scopes).toContain('email');
  });

  it('should enable provider when env vars are set', async () => {
    vi.stubEnv('VITE_GOOGLE_CLIENT_ID', 'test-id');
    vi.stubEnv('VITE_GOOGLE_REDIRECT_URI', 'http://localhost/callback');

    const { OAUTH_PROVIDERS } = await import('config/oauthProviders');

    expect(OAUTH_PROVIDERS.GOOGLE.enabled).toBe(true);
  });

  it('should disable provider when env vars are missing', async () => {
    vi.stubEnv('VITE_GOOGLE_CLIENT_ID', '');
    vi.stubEnv('VITE_GOOGLE_REDIRECT_URI', '');

    const { OAUTH_PROVIDERS } = await import('config/oauthProviders');

    expect(OAUTH_PROVIDERS.GOOGLE.enabled).toBe(false);
  });

  it('should return only enabled providers', async () => {
    vi.stubEnv('VITE_GOOGLE_CLIENT_ID', 'id');
    vi.stubEnv('VITE_GOOGLE_REDIRECT_URI', 'uri');

    const { getEnabledProviders } = await import('config/oauthProviders');

    const enabled = getEnabledProviders();

    expect(enabled.length).toBeGreaterThan(0);
    enabled.forEach((p) => expect(p.enabled).toBe(true));
  });

  it('should return empty array if no providers enabled', async () => {
    vi.stubEnv('VITE_GOOGLE_CLIENT_ID', '');
    vi.stubEnv('VITE_GOOGLE_REDIRECT_URI', '');
    vi.stubEnv('VITE_GITHUB_CLIENT_ID', '');
    vi.stubEnv('VITE_GITHUB_REDIRECT_URI', '');

    const { getEnabledProviders } = await import('config/oauthProviders');

    expect(getEnabledProviders()).toHaveLength(0);
  });
});
