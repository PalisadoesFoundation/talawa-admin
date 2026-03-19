[Admin Docs](/)

***

# Function: sanitizeAvatars()

> **sanitizeAvatars**(`file`, `fallbackUrl`): `string`

Defined in: [src/utils/sanitizeAvatar.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/sanitizeAvatar.ts#L8)

Sanitizes a file-based or URL-based avatar source.

## Parameters

### file

`File`

An image File to create an object URL from, or null

### fallbackUrl

`string`

A URL string to validate and return if no file is provided

## Returns

`string`

A safe blob: or https: URL, or an empty string
