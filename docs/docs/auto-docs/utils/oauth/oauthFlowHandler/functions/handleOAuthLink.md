[Admin Docs](/)

***

# Function: handleOAuthLink()

> **handleOAuthLink**(`client`, `provider`, `authorizationCode`, `redirectUri`): `Promise`\<[`InterfaceOAuthLinkResponse`](../../../../types/Auth/auth/interfaces/InterfaceOAuthLinkResponse.md)\>

Defined in: [src/utils/oauth/oauthFlowHandler.ts:102](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/oauth/oauthFlowHandler.ts#L102)

Links an existing user account with an OAuth provider.

This function associates a user's existing account with an OAuth provider
by exchanging the authorization code. This allows users to sign in with
multiple OAuth providers or add additional sign-in methods to their account.

## Parameters

### client

`ApolloClient`\<`unknown`\>

Apollo GraphQL client instance for making API requests

### provider

[`OAuthProviderKey`](../../../../types/Auth/auth/type-aliases/OAuthProviderKey.md)

OAuth provider to link (e.g., 'GOOGLE', 'FACEBOOK', 'GITHUB')

### authorizationCode

`string`

Authorization code received from OAuth provider callback

### redirectUri

`string`

Redirect URI used in the OAuth flow for validation

## Returns

`Promise`\<[`InterfaceOAuthLinkResponse`](../../../../types/Auth/auth/interfaces/InterfaceOAuthLinkResponse.md)\>

Promise that resolves to the linking operation result containing user data with linked OAuth accounts

## Throws

Error When GraphQL errors are returned from the server

## Throws

Error When no response data is received despite successful request

## Throws

ApolloError When network or Apollo Client errors occur

## Example

```typescript
const linkResult = await handleOAuthLink(
  apolloClient,
  'GITHUB',
  'auth-code-456',
  'http://localhost:3000/callback'
);
console.log('User ID:', linkResult.id);
console.log('Linked accounts:', linkResult.oauthAccounts);
```
