[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`InterfacePasswordValidatorProps`](../../../../types/PasswordValidator/interface/interfaces/InterfacePasswordValidatorProps.md)\>

Defined in: [src/shared-components/PasswordValidator/PasswordValidator.tsx:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/PasswordValidator/PasswordValidator.tsx#L23)

PasswordValidator Component

Displays real-time password validation feedback

## Param

Component props

## Returns

The rendered password validator

## Example

```ts
<PasswordValidator
  password={password}
  isInputFocused={focused}
  validation={validationState}
/>
```
