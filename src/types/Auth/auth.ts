export type OAuthProviderKey = 'GOOGLE' | 'GITHUB';

export interface InterfaceOAuthLoginInput {
  provider: OAuthProviderKey;
  authorizationCode: string;
  redirectUri: string;
}

export interface InterfaceAuthenticationPayload {
  authenticationToken: string;
  refreshToken?: string;
  user: { id: string; name?: string; email: string };
}
