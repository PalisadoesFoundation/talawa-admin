import { ApolloClient } from '@apollo/client';
import {
  SIGN_IN_WITH_OAUTH,
  LINK_OAUTH_ACCOUNT,
} from '../../GraphQl/Mutations/mutations';
import {
  InterfaceAuthenticationPayload,
  InterfaceOAuthLinkResponse,
  InterfaceOAuthLoginInput,
  OAuthProviderKey,
} from 'types/Auth/auth';

/**
 * Handles OAuth login flow by exchanging an authorization code for authentication tokens.
 *
 * This function performs the OAuth sign-in process by sending the authorization code
 * and other required parameters to the GraphQL mutation. It validates the response
 * and returns the authentication payload containing user data and tokens.
 *
 * @param client - Apollo GraphQL client instance for making API requests
 * @param provider - OAuth provider (e.g., 'GOOGLE', 'GITHUB')
 * @param authorizationCode - Authorization code received from OAuth provider callback
 * @param redirectUri - Redirect URI used in the OAuth flow for validation
 *
 * @returns Promise that resolves to authentication payload with user data and tokens
 *
 * @throws Error When GraphQL errors are returned from the server
 * @throws Error When no authentication data is received despite successful request
 * @throws ApolloError When network or Apollo Client errors occur
 *
 * @example
 * ```typescript
 * const authPayload = await handleOAuthLogin(
 *   apolloClient,
 *   'GOOGLE',
 *   'auth-code-123',
 *   'http://localhost:3000/callback'
 * );
 * console.log(authPayload.user.name); // User's name
 * console.log(authPayload.authenticationToken); // JWT access token
 * ```
 */
export async function handleOAuthLogin(
  client: ApolloClient<unknown>,
  provider: OAuthProviderKey,
  authorizationCode: string,
  redirectUri: string,
): Promise<InterfaceAuthenticationPayload> {
  const { data, errors } = await client.mutate<{
    signInWithOAuth: InterfaceAuthenticationPayload;
  }>({
    mutation: SIGN_IN_WITH_OAUTH,
    variables: {
      input: {
        provider,
        authorizationCode,
        redirectUri,
      } as InterfaceOAuthLoginInput,
    },
  });
  if (errors?.length) throw errors[0];

  if (!data?.signInWithOAuth) {
    throw new Error(
      'OAuth login failed: No authentication data received from server',
    );
  }

  return data.signInWithOAuth;
}

/**
 * Links an existing user account with an OAuth provider.
 *
 * This function associates a user's existing account with an OAuth provider
 * by exchanging the authorization code. This allows users to sign in with
 * multiple OAuth providers or add additional sign-in methods to their account.
 *
 * @param client - Apollo GraphQL client instance for making API requests
 * @param provider - OAuth provider to link (e.g., 'GOOGLE', 'GITHUB')
 * @param authorizationCode - Authorization code received from OAuth provider callback
 * @param redirectUri - Redirect URI used in the OAuth flow for validation
 *
 * @returns Promise that resolves to the linking operation result containing user data with linked OAuth accounts
 *
 * @throws Error When GraphQL errors are returned from the server
 * @throws Error When no response data is received despite successful request
 * @throws ApolloError When network or Apollo Client errors occur
 *
 * @example
 * ```typescript
 * const linkResult = await handleOAuthLink(
 *   apolloClient,
 *   'GITHUB',
 *   'auth-code-456',
 *   'http://localhost:3000/callback'
 * );
 * console.log('User ID:', linkResult.id);
 * console.log('Linked accounts:', linkResult.oauthAccounts);
 * ```
 */
export async function handleOAuthLink(
  client: ApolloClient<unknown>,
  provider: OAuthProviderKey,
  authorizationCode: string,
  redirectUri: string,
): Promise<InterfaceOAuthLinkResponse> {
  const { data, errors } = await client.mutate<{
    linkOAuthAccount: InterfaceOAuthLinkResponse;
  }>({
    mutation: LINK_OAUTH_ACCOUNT,
    variables: {
      input: {
        provider,
        authorizationCode,
        redirectUri,
      } as InterfaceOAuthLoginInput,
    },
  });
  if (errors?.length) throw errors[0];

  if (!data?.linkOAuthAccount) {
    throw new Error(
      'OAuth account linking failed: No response data received from server',
    );
  }

  return data.linkOAuthAccount;
}
