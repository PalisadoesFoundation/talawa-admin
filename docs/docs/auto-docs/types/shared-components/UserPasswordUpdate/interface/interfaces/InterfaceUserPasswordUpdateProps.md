[Admin Docs](/)

***

# Interface: InterfaceUserPasswordUpdateProps

Defined in: [src/types/shared-components/UserPasswordUpdate/interface.ts:4](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/UserPasswordUpdate/interface.ts#L4)

Interface for UserPasswordUpdate component props

## Properties

### onCancel()

> **onCancel**: () => `void`

Defined in: [src/types/shared-components/UserPasswordUpdate/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/UserPasswordUpdate/interface.ts#L21)

Callback to close the modal or cancel the operation.

#### Returns

`void`

***

### onSuccess()?

> `optional` **onSuccess**: () => `void`

Defined in: [src/types/shared-components/UserPasswordUpdate/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/UserPasswordUpdate/interface.ts#L26)

Callback fired after successful update.

#### Returns

`void`

***

### requirePreviousPassword?

> `optional` **requirePreviousPassword**: `boolean`

Defined in: [src/types/shared-components/UserPasswordUpdate/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/UserPasswordUpdate/interface.ts#L16)

Whether to require the previous password.
- true: for users updating their own password (default).
- false: for admins resetting a user's password.

***

### userId?

> `optional` **userId**: `string`

Defined in: [src/types/shared-components/UserPasswordUpdate/interface.ts:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/UserPasswordUpdate/interface.ts#L9)

The ID of the user to update.
Required for admin usage (when requirePreviousPassword is false).
