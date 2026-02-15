import { UserRole } from 'utils/interfaces';

/**
 * Authenticated user information returned from the server after successful login.
 */
interface InterfaceAuthUser {
  id: string;
  name?: string;
  emailAddress: string;
  role: UserRole;
  countryCode?: string | null;
  avatarURL?: string | null;
  isEmailAddressVerified: boolean;
}

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
  user: InterfaceAuthUser;
}

/**
 * Represents a linked OAuth account.
 */
export interface InterfaceOAuthAccount {
  /** OAuth provider name */
  provider: string;
  /** Email address associated with the OAuth account */
  email: string;
  /** Date when the account was linked */
  linkedAt: string;
  /** Date when the account was last used for authentication */
  lastUsedAt: string;
}

/**
 * Response data returned from linking an OAuth account.
 */
export interface InterfaceOAuthLinkResponse {
  /** User's unique identifier */
  id: string;
  /** User's full name */
  name: string;
  /** User's email address */
  emailAddress: string;
  /** Whether the user's email address has been verified */
  isEmailAddressVerified: boolean;
  /** User's role in the system */
  role: UserRole;
  /** List of linked OAuth accounts */
  oauthAccounts: InterfaceOAuthAccount[];
}
