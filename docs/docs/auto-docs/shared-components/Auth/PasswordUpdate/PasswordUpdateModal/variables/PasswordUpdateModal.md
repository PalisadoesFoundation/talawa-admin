[Admin Docs](/)

***

# Variable: PasswordUpdateModal

> `const` **PasswordUpdateModal**: `React.FC`\<[`InterfacePasswordUpdateModalProps`](../../../../../types/shared-components/PasswordUpdateModal/interface/interfaces/InterfacePasswordUpdateModalProps.md)\>

Defined in: [src/shared-components/Auth/PasswordUpdate/PasswordUpdateModal.tsx:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/Auth/PasswordUpdate/PasswordUpdateModal.tsx#L26)

PasswordUpdateModal component.

## Remarks

A reusable modal for updating user passwords. It renders password fields
for old password, new password, and confirmation using [PasswordField](../../../PasswordField/PasswordField/variables/PasswordField.md).
The previous password field can optionally be hidden (e.g., when an admin
updates another user's password).

## Param

[InterfacePasswordUpdateModalProps](../../../../../types/shared-components/PasswordUpdateModal/interface/interfaces/InterfacePasswordUpdateModalProps.md)
- `open`: Controls modal visibility.
- `onClose`: Callback triggered when the modal is closed.
- `onSubmit`: Handler executed when the password update action is confirmed.
- `values`: Current password form values.
- `onChange`: Change handler for password inputs.
- `hidePreviousPassword`: Hides the old password field when `true`.

## Returns

A modal dialog containing password update fields and submit actions.
