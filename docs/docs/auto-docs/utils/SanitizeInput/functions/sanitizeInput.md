[**talawa-admin**](../../../README.md)

***

# Function: sanitizeInput()

> **sanitizeInput**(`input`): `string`

Defined in: [src/utils/SanitizeInput.tsx:8](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/utils/SanitizeInput.tsx#L8)

Sanitizes user input to prevent XSS attacks
Uses multiple passes and stricter pattern matching

## Parameters

### input

`string`

The string to sanitize

## Returns

`string`

The sanitized string with dangerous content removed
