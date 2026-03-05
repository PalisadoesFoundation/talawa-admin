[**talawa-admin**](../../../README.md)

***

# Function: sanitizeInput()

> **sanitizeInput**(`input`): `string`

Defined in: [src/utils/SanitizeInput.tsx:8](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/utils/SanitizeInput.tsx#L8)

Sanitizes user input to prevent XSS attacks
Uses multiple passes and stricter pattern matching

## Parameters

### input

`string`

The string to sanitize

## Returns

`string`

The sanitized string with dangerous content removed
