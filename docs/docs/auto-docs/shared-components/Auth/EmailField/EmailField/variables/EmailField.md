[Admin Docs](/)

***

# Variable: EmailField

> `const` **EmailField**: `React.FC`\<[`InterfaceEmailFieldProps`](../../../../../types/shared-components/Auth/EmailField/interface/interfaces/InterfaceEmailFieldProps.md)\>

Defined in: src/shared-components/Auth/EmailField/EmailField.tsx:25

Reusable email input field component.

## Remarks

This component wraps FormField with email-specific defaults including:
- HTML5 email input type for built-in validation
- Default label and placeholder from i18n keys (email, emailPlaceholder)
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
