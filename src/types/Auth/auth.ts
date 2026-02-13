/**
 * Supported OAuth providers for authentication.
 */
export type OAuthProviderKey = 'GOOGLE' | 'GITHUB';

/**
 * Input data required for OAuth login flow.
 */
export interface InterfaceOAuthLoginInput {
  /** The OAuth provider to use for authentication */
  provider: OAuthProviderKey;
  /** Authorization code received from OAuth provider */
  authorizationCode: string;
  /** Redirect URI registered with the OAuth provider */
  redirectUri: string;
}

/**
 * Payload returned after successful authentication.
 */
export interface InterfaceAuthenticationPayload {
  /** Token used for authenticating API requests */
  authenticationToken: string;
  /** Optional token for refreshing the authentication token */
  refreshToken?: string;
  /** Authenticated user information */
  user: { id: string; name?: string; emailAddress: string };
}
