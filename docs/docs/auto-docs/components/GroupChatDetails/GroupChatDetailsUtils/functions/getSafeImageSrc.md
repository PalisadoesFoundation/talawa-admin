[Admin Docs](/)

***

# Function: getSafeImageSrc()

> **getSafeImageSrc**(`url?`): `string`

Defined in: [src/components/GroupChatDetails/GroupChatDetailsUtils.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/GroupChatDetails/GroupChatDetailsUtils.ts#L13)

Validates and sanitizes image URLs to prevent security issues.

Only allows safe URL protocols (http, https, data, blob) and rejects:
- Invalid/malformed URLs
- URLs with whitespace characters
- Empty or non-string values
- Unsafe protocols (javascript:, file:, etc.)

## Parameters

### url?

`string`

The URL string to validate, may be null or undefined

## Returns

`string`

The validated URL string if safe, otherwise undefined
