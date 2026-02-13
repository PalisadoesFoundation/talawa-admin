[Admin Docs](/)

***

# Variable: PasswordField

> `const` **PasswordField**: `React.FC`\<[`InterfacePasswordFieldProps`](../../../../../types/shared-components/Auth/PasswordField/interface/interfaces/InterfacePasswordFieldProps.md)\>

Defined in: [src/shared-components/Auth/PasswordField/PasswordField.tsx:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Auth/PasswordField/PasswordField.tsx#L30)

Reusable password input field with visibility toggle (show/hide password).

## Param

Component props (see [InterfacePasswordFieldProps](../../../../../types/shared-components/Auth/PasswordField/interface/interfaces/InterfacePasswordFieldProps.md)): label, name, value, onChange,
  placeholder, error, testId, dataCy, showPassword, onToggleVisibility.

## Remarks

Uses FormTextField with an endAdornment button to toggle visibility.
Visibility can be controlled via showPassword/onToggleVisibility or managed
internally via usePasswordVisibility. Renders a password (or text) input
with an eye icon to show/hide the value.

## Returns

The rendered password input field with visibility toggle.

## Example

```tsx
<PasswordField
  label="Password"
  name="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  testId="passwordField"
/>
```
