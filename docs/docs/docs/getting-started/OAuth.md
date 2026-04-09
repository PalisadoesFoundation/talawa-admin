---
id: oauth
title: OAuth
slug: /oauth
sidebar_position: 6
---

This page explains how OAuth is set up and used in `talawa-admin` for Google and GitHub.

## Overview

Talawa-Admin supports OAuth 2.0 authentication for:

- Google
- GitHub

OAuth can be used in three modes:

- `login`: Sign in with an OAuth provider
- `register`: Register/sign in flow through OAuth
- `link`: Link an OAuth account from user settings

At runtime, provider availability is controlled by frontend environment variables. If a provider's required variables are missing, the provider is automatically disabled in the UI.

## Prerequisites

Before enabling OAuth in Talawa-Admin, make sure:

1. `talawa-api` is running and OAuth is configured there.
2. Your provider app (Google/GitHub) allows the callback URL used by Talawa-Admin.
3. Frontend and backend callback URI values match your deployment setup.

:::warning Important
Talawa-Admin is a frontend app. Never put OAuth client secrets in frontend environment variables.
:::

## OAuth Environment Variables

Talawa-Admin reads the following variables:

| Variable | Description |
| --- | --- |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `VITE_GOOGLE_REDIRECT_URI` | Redirect URI for Google OAuth callback |
| `VITE_GITHUB_CLIENT_ID` | GitHub OAuth Client ID |
| `VITE_GITHUB_REDIRECT_URI` | Redirect URI for GitHub OAuth callback |

The default callback route used by the app is:

```text
{BASE_URL}/auth/callback
```

Example for local development:

```text
http://localhost:4321/auth/callback
```

## Setup Option 1: Interactive Setup (Recommended)

Use the setup command:

```bash
pnpm run setup
```

When prompted:

1. Choose whether to set up OAuth.
2. Enter your base URL (default: `http://localhost:4321`).
3. Choose provider configuration:
	- Google
	- GitHub
	- Both
4. Enter each selected provider's client ID.

The script writes provider values into `.env` and builds redirect URIs using:

```text
{baseUrl}/auth/callback
```

If you skip OAuth setup, OAuth-related variables are cleared from `.env`.

## Setup Option 2: Manual Setup

Add variables in your `.env` file:

```env
VITE_GOOGLE_CLIENT_ID="your-google-client-id"
VITE_GOOGLE_REDIRECT_URI="http://localhost:4321/auth/callback"

VITE_GITHUB_CLIENT_ID="your-github-client-id"
VITE_GITHUB_REDIRECT_URI="http://localhost:4321/auth/callback"
```

Restart the frontend after changes:

```bash
pnpm run dev
```

## How Provider Enablement Works

A provider is enabled only when both values exist:

- `clientId`
- `redirectUri`

If either is missing, that provider button is not shown in auth UI sections.

## OAuth Flow in Talawa-Admin

### Step 1: User clicks OAuth button

For Google/GitHub buttons, the app:

1. Reads provider configuration from centralized provider config.
2. Generates a nonce (`crypto.randomUUID()`) for CSRF protection.
3. Stores temporary OAuth session state in `sessionStorage`:
	- `oauth_mode`
	- `oauth_provider`
	- `oauth_nonce`
4. Redirects user to provider authorization URL.

### Step 2: State parameter format

The app sends OAuth `state` in this format:

```text
mode:provider:nonce
```

Examples:

- `login:GOOGLE:uuid-value`
- `link:GITHUB:uuid-value`

### Step 3: Callback handling

Route:

```text
/auth/callback
```

On callback, the app:

1. Reads `code`, `state`, and `error` query parameters.
2. Extracts mode/provider/nonce from `state` (with `sessionStorage` fallback).
3. Validates nonce to reduce CSRF risk.
4. Calls GraphQL mutation flow:
	- Login/Register: `signInWithOAuth`
	- Link account: `linkOAuthAccount`
5. Clears temporary OAuth session state from `sessionStorage`.
6. Redirects:
	- Login/Register success: `/`
	- Link success: `/user/settings`

On error, a notification is shown and the app redirects back after cleanup.

## Usage in UI

### Auth screens

Use the shared OAuth section:

```tsx
import { OAuthSection } from 'components/Auth/OAuthSection/OAuthSection';

<OAuthSection mode="login" />
```

You can also pass `mode="register"` for registration screens.

### Account linking

Use provider buttons with `mode="link"` in user settings pages.

Example:

```tsx
import GoogleOAuthButton from 'components/Auth/OAuthButton/GoogleOAuthButton';

<GoogleOAuthButton mode="link" />
```

## Troubleshooting

### Provider button is not visible

Check that the provider has both required variables:

- Client ID exists
- Redirect URI exists

Then restart the frontend dev server.

### OAuth redirects but callback fails

Verify all callback URLs exactly match:

1. Provider console callback URL
2. Talawa-Admin `VITE_*_REDIRECT_URI`
3. Talawa-API OAuth redirect configuration

### CSRF validation failed

This usually means state or session was changed/lost during redirect. Retry login from the app and avoid manually modifying callback URL parameters.

### GraphQL OAuth mutation fails

Confirm backend OAuth provider configuration is complete and backend credentials are valid (client ID/secret/redirect URI).

## Security Notes

- Keep OAuth client secrets only in backend services.
- Use the `state` nonce validation (already implemented) to reduce CSRF risks.
- Prefer HTTPS callback URLs in production.
- Keep provider scopes minimal (`openid`, `profile`, `email` for Google; `user:email` for GitHub).
