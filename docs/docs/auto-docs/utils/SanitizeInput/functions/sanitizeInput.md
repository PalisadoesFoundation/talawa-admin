[**talawa-admin**](../../../README.md)

***

# Function: sanitizeInput()

> **sanitizeInput**(`input`): `string`

Defined in: [src/utils/SanitizeInput.tsx:8](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/utils/SanitizeInput.tsx#L8)

Sanitizes user input to prevent XSS attacks
Uses multiple passes and stricter pattern matching

## Parameters

### input

`string`

The string to sanitize

## Returns

`string`

The sanitized string with dangerous content removed
