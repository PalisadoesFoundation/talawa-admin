[Admin Docs](/)

***

# Interface: InterfaceOAuthLoginInput

Defined in: [src/types/Auth/auth.ts:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L9)

Input data required for OAuth login flow.

## Properties

### authorizationCode

> **authorizationCode**: `string`

Defined in: [src/types/Auth/auth.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L13)

Authorization code received from OAuth provider

***

### provider

> **provider**: [`OAuthProviderKey`](../type-aliases/OAuthProviderKey.md)

Defined in: [src/types/Auth/auth.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L11)

The OAuth provider to use for authentication

***

### redirectUri

> **redirectUri**: `string`

Defined in: [src/types/Auth/auth.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L15)

Redirect URI registered with the OAuth provider
