[**talawa-admin**](../../../../../README.md)

***

# Variable: FormField

> `const` **FormField**: `React.FC`\<[`InterfaceFormFieldProps`](../../../../../types/shared-components/Auth/FormField/interface/interfaces/InterfaceFormFieldProps.md)\>

Defined in: [src/shared-components/Auth/FormField/FormField.tsx:26](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/shared-components/Auth/FormField/FormField.tsx#L26)

Reusable form field component with validation and accessibility support.

## Remarks

This component integrates with Phase 1 validators via the `error` prop
and provides aria-live announcements for screen readers.

## Example

```tsx
<FormField
  label="Email"
  name="email"
  type="email"
  value={email}
  onChange={handleChange}
  onBlur={handleBlur}
  error={emailError}
  required
/>
```
