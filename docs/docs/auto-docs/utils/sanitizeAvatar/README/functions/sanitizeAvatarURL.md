[Admin Docs](/)

***

# Function: sanitizeAvatarURL()

> **sanitizeAvatarURL**(`url`): `string`

Defined in: [src/utils/sanitizeAvatar.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/sanitizeAvatar.ts#L47)

Normalizes an avatar URL by converting null-like values to an empty string.

## Parameters

### url

`string`

The avatar URL to normalize

## Returns

`string`

The original URL, or an empty string if the input is falsy or the literal string "null"
