[**talawa-admin**](../../../README.md)

***

# Function: sanitizeInput()

> **sanitizeInput**(`input`): `string`

Defined in: [src/utils/SanitizeInput.tsx:8](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/utils/SanitizeInput.tsx#L8)

Sanitizes user input to prevent XSS attacks
Uses multiple passes and stricter pattern matching

## Parameters

### input

`string`

The string to sanitize

## Returns

`string`

The sanitized string with dangerous content removed
