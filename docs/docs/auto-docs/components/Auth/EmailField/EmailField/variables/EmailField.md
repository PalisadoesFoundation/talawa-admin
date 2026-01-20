[Admin Docs](/)

***

# Variable: EmailField

> `const` **EmailField**: `React.FC`\<[`InterfaceEmailFieldProps`](../../../../../types/Auth/EmailField/interface/interfaces/InterfaceEmailFieldProps.md)\>

Defined in: [src/components/Auth/EmailField/EmailField.tsx:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/Auth/EmailField/EmailField.tsx#L24)

Reusable email input field component.

## Remarks

This component wraps FormField with email-specific defaults including:
- HTML5 email input type for built-in validation
- Default label "Email" and placeholder "name@example.com"
- Required field marking
- Support for error display via string or null error prop

## Example

```tsx
<EmailField
  value={email}
  onChange={handleEmailChange}
  error={emailError}
/>
```
