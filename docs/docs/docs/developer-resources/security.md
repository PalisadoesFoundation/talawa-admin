---
id: security
title: Security Guidelines
slug: /developer-resources/security
sidebar_position: 12
---

# Security Guidelines

Last updated: January 3, 2026

## Token Handling and Authentication Security

We have implemented strict ESLint rules to enforce secure token handling and prevent common vulnerabilities. These rules ensure that our authentication flow remains robust, using HTTP-only cookies and proper mutation practices.

### 1. Authorization Header Security

**Rule:** `Security Risk: Do not use getItem('token') directly inside authorization headers.`

**ESLint Error:** "Security Risk: Do not use getItem('token') directly inside authorization headers. Extract it to a variable first to handle null values."

**Purpose:**
Prevent potential `null` or `undefined` values being sent in the authorization header if `localStorage` retrieval fails. It ensures defensive coding by requiring explicit variable assignment and checking.

**Prohibited Pattern:**
```javascript
// Unsafe: Direct usage inside object literal
const headers = {
  authorization: localStorage.getItem('token'),
};
```

**Safe Alternative:**
```javascript
// Safe: Extract to variable first
const token = localStorage.getItem('token');

// Option 1: With null check
const headers = {
  authorization: token ? `Bearer ${token}` : '',
};

// Option 2: With fallback
const headers = {
  authorization: `Bearer ${token || ''}`,
};
```

### 2. Deprecated `REVOKE_REFRESH_TOKEN` Usage

**Rule:** `HTTP-Only Cookie Violation: Do not use REVOKE_REFRESH_TOKEN for logout.`

**ESLint Error:** "HTTP-Only Cookie Violation: Do not use REVOKE_REFRESH_TOKEN for logout. Use LOGOUT_MUTATION instead, which correctly reads refresh tokens from HTTP-only cookies."

**Purpose:**
The `REVOKE_REFRESH_TOKEN` mutation is deprecated for web clients because it relies on passing the refresh token from the client side. We have moved to an HTTP-only cookie-based authentication system where the server manages the tokens securely. The `LOGOUT_MUTATION` is designed to work with this system.

**Prohibited Pattern:**
```javascript
// Deprecated
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';

const [revokeRefreshToken] = useMutation(REVOKE_REFRESH_TOKEN);
```

**Safe Alternative:**
```javascript
// Recommended
import { LOGOUT_MUTATION } from 'GraphQl/Mutations/mutations';

const [logout] = useMutation(LOGOUT_MUTATION);
```

### 3. Avoiding `refreshToken` Variables

**Rule:** `HTTP-Only Cookie Violation: Do not pass refreshToken as a variable.`

**ESLint Error:** "HTTP-Only Cookie Violation: Do not pass refreshToken as a variable. The API reads refresh tokens from HTTP-only cookies automatically."

**Purpose:**
Since refresh tokens are now stored in HTTP-only cookies, the client code cannot and should not access them. Passing `refreshToken` as a variable suggests incorrect handling where the client is manually managing the token, which bypasses the security benefits of HTTP-only cookies.

**Prohibited Pattern:**
```javascript
// Incorrect: Manually passing refresh token
logout({ variables: { refreshToken: someToken } });
```

**Safe Alternative:**
```javascript
// Correct: Let the server read the HTTP-only cookie
logout();
```

## Migration Guide

If you encounter these linting errors in existing code:

1.  **Authorization Header:** Refactor the code to assign `localStorage.getItem('token')` to a variable before using it in the header object.
2.  **Logout:** Replace `revokeRefreshToken` mutation calls with `logout` mutation calls. Ensure you handle the loading and error states appropriate for `LOGOUT_MUTATION`.
3.  **Variables:** Remove `refreshToken` from the `variables` object in your GraphQL mutation calls.

For any questions, please reach out to the maintainers or consult the ESLint configuration
in `eslint.config.js` and the modular configs under `scripts/eslint/config/`.
