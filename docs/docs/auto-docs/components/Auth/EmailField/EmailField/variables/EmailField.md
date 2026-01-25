[**talawa-admin**](../../../../../README.md)

***

# Variable: EmailField

> `const` **EmailField**: `React.FC`\<[`InterfaceEmailFieldProps`](../../../../../types/Auth/EmailField/interface/interfaces/InterfaceEmailFieldProps.md)\>

Defined in: [src/components/Auth/EmailField/EmailField.tsx:25](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/components/Auth/EmailField/EmailField.tsx#L25)

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
