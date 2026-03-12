[Admin Docs](/)

***

# Function: validateBaseUrl()

> **validateBaseUrl**(`value`): `string` \| `boolean`

Defined in: [src/setup/oauthConfig/oauthConfig.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/setup/oauthConfig/oauthConfig.ts#L39)

Validates that a base URL is not empty and is a valid http/https URL.

## Parameters

### value

`string`

The base URL value to validate

## Returns

`string` \| `boolean`

`true` if valid, or an error message string if invalid
