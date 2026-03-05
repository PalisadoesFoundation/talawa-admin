[Admin Docs](/)

***

# Interface: InterfaceOAuthLoginInput

Defined in: [src/types/Auth/auth.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L24)

Input data required for OAuth login flow.

## Properties

### authorizationCode

> **authorizationCode**: `string`

Defined in: [src/types/Auth/auth.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L28)

Authorization code received from OAuth provider

***

### provider

> **provider**: [`OAuthProviderKey`](../type-aliases/OAuthProviderKey.md)

Defined in: [src/types/Auth/auth.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L26)

The OAuth provider to use for authentication

***

### redirectUri

> **redirectUri**: `string`

Defined in: [src/types/Auth/auth.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Auth/auth.ts#L30)

Redirect URI registered with the OAuth provider
