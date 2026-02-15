import { describe, it, expect } from 'vitest';
import type { IOAuthProviderConfig } from 'types/Auth/auth';

describe('OAuth Types', () => {
  it('should allow valid OAuthProviderConfig structure', () => {
    const mockConfig: IOAuthProviderConfig = {
      id: 'GOOGLE',
      displayName: 'Google',
      scopes: ['email'],
      enabled: true,
    };

    expect(mockConfig.id).toBe('GOOGLE');
    expect(mockConfig.enabled).toBe(true);
  });
});
