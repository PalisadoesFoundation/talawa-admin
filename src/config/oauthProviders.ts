import type { OAuthProviderKey, IOAuthProviderConfig } from 'types/Auth/auth';

/**
 * Helper to check if provider is enabled
 */
const isEnabled = (clientId?: string, redirectUri?: string): boolean => {
  return Boolean(clientId && redirectUri);
};

/**
 * Central OAuth Provider Configuration
 */
export const OAUTH_PROVIDERS: Record<OAuthProviderKey, IOAuthProviderConfig> = {
  GOOGLE: {
    id: 'GOOGLE',
    displayName: 'Google',
    scopes: ['openid', 'profile', 'email'],
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
    enabled: isEnabled(
      import.meta.env.VITE_GOOGLE_CLIENT_ID,
      import.meta.env.VITE_GOOGLE_REDIRECT_URI,
    ),
  },

  GITHUB: {
    id: 'GITHUB',
    displayName: 'GitHub',
    scopes: ['user:email'],
    clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
    redirectUri: import.meta.env.VITE_GITHUB_REDIRECT_URI,
    enabled: isEnabled(
      import.meta.env.VITE_GITHUB_CLIENT_ID,
      import.meta.env.VITE_GITHUB_REDIRECT_URI,
    ),
  },
};

/**
 * Get config for single provider
 */
export const getProviderConfig = (provider: OAuthProviderKey) => {
  return OAUTH_PROVIDERS[provider];
};

/**
 * Get only enabled providers
 */
export const getEnabledProviders = (): IOAuthProviderConfig[] => {
  return Object.values(OAUTH_PROVIDERS).filter((p) => p.enabled);
};
