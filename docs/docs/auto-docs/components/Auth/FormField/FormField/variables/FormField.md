[**talawa-admin**](../../../../../README.md)

***

# Variable: FormField

> `const` **FormField**: `React.FC`\<[`InterfaceFormFieldProps`](../../../../../types/Auth/FormField/interface/interfaces/InterfaceFormFieldProps.md)\>

Defined in: [src/components/Auth/FormField/FormField.tsx:26](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/components/Auth/FormField/FormField.tsx#L26)

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
