export type ProviderKey = 'GOOGLE' | 'GITHUB';

export interface IOAuthProviderConfig {
  id: ProviderKey;
  displayName: string;
  scopes: string[];
  clientId?: string;
  redirectUri?: string;
  enabled: boolean;
}
