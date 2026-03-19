[Admin Docs](/)

***

# Function: validateClientId()

> **validateClientId**(`value`, `provider`): `string` \| `boolean`

Defined in: [src/setup/oauthConfig/oauthConfig.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/setup/oauthConfig/oauthConfig.ts#L23)

Validates that a client ID is not empty or whitespace-only.

## Parameters

### value

`string`

The client ID value to validate

### provider

`string`

The OAuth provider name (e.g., "Google", "GitHub")

## Returns

`string` \| `boolean`

`true` if valid, or an error message string if invalid
