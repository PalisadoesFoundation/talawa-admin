[Admin Docs](/)

***

# Function: sanitizeInput()

> **sanitizeInput**(`input`): `string`

Defined in: [src/utils/SanitizeInput.tsx:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/SanitizeInput.tsx#L8)

Sanitizes user input to prevent XSS attacks
Removes potentially dangerous characters, HTML tags, event handlers, and dangerous protocols

## Parameters

### input

`string`

The string to sanitize

## Returns

`string`

The sanitized string with dangerous content removed
