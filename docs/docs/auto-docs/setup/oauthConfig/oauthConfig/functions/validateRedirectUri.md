[Admin Docs](/)

***

# Function: validateRedirectUri()

> **validateRedirectUri**(`value`, `provider`): `string` \| `boolean`

Defined in: [src/setup/oauthConfig/oauthConfig.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/setup/oauthConfig/oauthConfig.ts#L41)

Validates that a redirect URI is not empty and is a valid http/https URL.

## Parameters

### value

`string`

The redirect URI value to validate

### provider

`string`

The OAuth provider name (e.g., "Google", "GitHub")

## Returns

`string` \| `boolean`

`true` if valid, or an error message string if invalid
