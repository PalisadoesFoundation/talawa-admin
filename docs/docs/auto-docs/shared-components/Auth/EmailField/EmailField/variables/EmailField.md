[Admin Docs](/)

***

# Variable: EmailField

> `const` **EmailField**: `React.FC`\<[`InterfaceEmailFieldProps`](../../../../../types/shared-components/Auth/EmailField/interface/interfaces/InterfaceEmailFieldProps.md)\>

Defined in: [src/shared-components/Auth/EmailField/EmailField.tsx:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Auth/EmailField/EmailField.tsx#L35)

Reusable email input field component.

## Remarks

This component wraps FormField with email-specific defaults including:
- HTML5 email input type for built-in validation
- Default label and placeholder from i18n keys (email, emailPlaceholder)
- Required field marking
- Support for error display via string or null error prop

## Param

Optional label text displayed above the input

## Param

Name attribute for the input field (defaults to "email")

## Param

Current email input value

## Param

Change handler called when the input value changes

## Param

Optional placeholder text for the input

## Param

Error message to display, if any

## Param

Optional test ID for testing purposes

## Returns

A JSX element rendering an email input field

## Example

```tsx
<EmailField
  value={email}
  onChange={handleEmailChange}
  error={emailError}
/>
```
