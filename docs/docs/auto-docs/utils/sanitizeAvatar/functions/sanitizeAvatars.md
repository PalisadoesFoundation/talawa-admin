[Admin Docs](/)

***

# Function: sanitizeAvatars()

> **sanitizeAvatars**(`file`, `fallbackUrl`): `string`

Defined in: [src/utils/sanitizeAvatar.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/sanitizeAvatar.ts#L7)

Normalizes an avatar URL by converting null-like values to an empty string.

## Parameters

### file

`File`

### fallbackUrl

`string`

## Returns

`string`

The original URL, or an empty string if the input is falsy or the literal string "null"
