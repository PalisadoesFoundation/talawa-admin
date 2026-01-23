[**talawa-admin**](../../../../../README.md)

***

# Variable: EmailField

> `const` **EmailField**: `React.FC`\<[`InterfaceEmailFieldProps`](../../../../../types/Auth/EmailField/interface/interfaces/InterfaceEmailFieldProps.md)\>

Defined in: [src/components/Auth/EmailField/EmailField.tsx:25](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/components/Auth/EmailField/EmailField.tsx#L25)

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
