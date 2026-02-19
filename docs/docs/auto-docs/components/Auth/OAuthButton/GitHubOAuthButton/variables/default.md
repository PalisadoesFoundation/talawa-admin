[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`Props`](../../types/type-aliases/Props.md)\>

Defined in: [src/components/Auth/OAuthButton/GitHubOAuthButton.tsx:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/Auth/OAuthButton/GitHubOAuthButton.tsx#L30)

GitHub OAuth authentication button component.

Handles GitHub OAuth flow by redirecting users to GitHub's authentication page
and storing the authentication mode (login/register/link) for callback processing.

## Param

Component Props

## Returns

A GitHub-branded OAuth button

## Example

```tsx
// Sign-in button
<GitHubOAuthButton mode="login" fullWidth />

// Link account button
<GitHubOAuthButton mode="link" size="sm" />
```

## Remarks

- Uses OAuth `state` parameter to pass mode and provider through the OAuth flow
- Also stores configuration in sessionStorage as fallback
- The callback handler extracts mode from state parameter (or sessionStorage) and calls
  the appropriate OAuth flow handler (`handleOAuthLogin` or `handleOAuthLink`)
- State parameter format: "mode:provider" (e.g., "login:GITHUB" or "link:GITHUB")
