[Admin Docs](/)

***

# Function: default()

> **default**(): `Element`

Defined in: [src/components/Auth/OAuthCallback/callback.tsx:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/Auth/OAuthCallback/callback.tsx#L45)

OAuth callback page component that handles the OAuth authentication flow redirect.

This component processes the OAuth provider's redirect after user authorization,
handling both login/register and account linking flows.

## Returns

`Element`

A loading state component while processing the OAuth callback

## Remarks

The component extracts the authorization code and state from the URL parameters,
then processes the authentication based on the mode (login/register or link).

Flow:
1. Extracts code, state, and error parameters from URL
2. Validates authorization code and OAuth configuration
3. Determines mode (login/register vs link) from state parameter or sessionStorage
4. Calls appropriate handler (handleOAuthLogin or handleOAuthLink)
5. On success:
   - Login/Register: Stores user data and authentication tokens, redirects to home
   - Link: Shows success message, redirects to user settings
6. On error: Shows error message, clears session storage, redirects to home

## Example

```tsx
// Route configuration
<Route path="/auth/callback" element={<OAuthCallbackPage />} />
```
