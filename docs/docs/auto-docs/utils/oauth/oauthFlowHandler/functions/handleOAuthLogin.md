[Admin Docs](/)

***

# Function: handleOAuthLogin()

> **handleOAuthLogin**(`client`, `provider`, `authorizationCode`, `redirectUri`): `Promise`\<[`InterfaceAuthenticationPayload`](../../../../types/Auth/auth/interfaces/InterfaceAuthenticationPayload.md)\>

Defined in: [src/utils/oauth/oauthFlowHandler.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/oauth/oauthFlowHandler.ts#L43)

Handles OAuth login flow by exchanging an authorization code for authentication tokens.

This function performs the OAuth sign-in process by sending the authorization code
and other required parameters to the GraphQL mutation. It validates the response
and returns the authentication payload containing user data and tokens.

## Parameters

### client

`ApolloClient`\<`unknown`\>

Apollo GraphQL client instance for making API requests

### provider

[`OAuthProviderKey`](../../../../types/Auth/auth/type-aliases/OAuthProviderKey.md)

OAuth provider (e.g., 'GOOGLE', 'GITHUB')

### authorizationCode

`string`

Authorization code received from OAuth provider callback

### redirectUri

`string`

Redirect URI used in the OAuth flow for validation

## Returns

`Promise`\<[`InterfaceAuthenticationPayload`](../../../../types/Auth/auth/interfaces/InterfaceAuthenticationPayload.md)\>

Promise that resolves to authentication payload with user data and tokens

## Throws

Error When GraphQL errors are returned from the server

## Throws

Error When no authentication data is received despite successful request

## Throws

ApolloError When network or Apollo Client errors occur

## Example

```typescript
const authPayload = await handleOAuthLogin(
  apolloClient,
  'GOOGLE',
  'auth-code-123',
  'http://localhost:3000/callback'
);
console.log(authPayload.user.name); // User's name
console.log(authPayload.authenticationToken); // JWT access token
```
