[Admin Docs](/)

***

# Function: sanitizeInput()

> **sanitizeInput**(`input`): `string`

Defined in: [src/screens/MemberDetail/SanitizeInput.tsx:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/MemberDetail/SanitizeInput.tsx#L14)

Sanitizes user input to prevent XSS attacks
Removes potentially dangerous characters and HTML tags

## Parameters

### input

`string`

The string to sanitize

## Returns

`string`

The sanitized string with dangerous characters removed

## Example

```typescript
const userInput = '<script>alert("XSS")</script>John';
const safe = sanitizeInput(userInput); // Returns 'John'
```
