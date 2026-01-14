[Admin Docs](/)

***

# Interface: InterfaceNotificationToastHelpers

Defined in: [src/types/NotificationToast/interface.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/NotificationToast/interface.ts#L64)

Reusable helper API exposed by `NotificationToast`.

## Properties

### dismiss()

> **dismiss**: () => `void`

Defined in: [src/types/NotificationToast/interface.ts:88](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/NotificationToast/interface.ts#L88)

Dismiss all active toasts.

#### Returns

`void`

***

### error()

> **error**: (`message`, `options?`) => `Id`

Defined in: [src/types/NotificationToast/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/NotificationToast/interface.ts#L73)

Show an error toast.

#### Parameters

##### message

[`NotificationToastMessage`](../type-aliases/NotificationToastMessage.md)

##### options?

`ToastOptions`

#### Returns

`Id`

***

### info()

> **info**: (`message`, `options?`) => `Id`

Defined in: [src/types/NotificationToast/interface.ts:83](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/NotificationToast/interface.ts#L83)

Show an info toast.

#### Parameters

##### message

[`NotificationToastMessage`](../type-aliases/NotificationToastMessage.md)

##### options?

`ToastOptions`

#### Returns

`Id`

***

### promise()

> **promise**: (`promisifiedFunction`, `messages`, `options?`) => `Promise`\<`void`\>

Defined in: [src/types/NotificationToast/interface.ts:94](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/NotificationToast/interface.ts#L94)

Promisified toast

#### Parameters

##### promisifiedFunction

() => `Promise`\<`void`\>

##### messages

###### error

[`NotificationToastMessage`](../type-aliases/NotificationToastMessage.md)

###### pending

[`NotificationToastMessage`](../type-aliases/NotificationToastMessage.md)

###### success

[`NotificationToastMessage`](../type-aliases/NotificationToastMessage.md)

##### options?

`ToastOptions`

#### Returns

`Promise`\<`void`\>

***

### success()

> **success**: (`message`, `options?`) => `Id`

Defined in: [src/types/NotificationToast/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/NotificationToast/interface.ts#L68)

Show a success toast.

#### Parameters

##### message

[`NotificationToastMessage`](../type-aliases/NotificationToastMessage.md)

##### options?

`ToastOptions`

#### Returns

`Id`

***

### warning()

> **warning**: (`message`, `options?`) => `Id`

Defined in: [src/types/NotificationToast/interface.ts:78](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/NotificationToast/interface.ts#L78)

Show a warning toast.

#### Parameters

##### message

[`NotificationToastMessage`](../type-aliases/NotificationToastMessage.md)

##### options?

`ToastOptions`

#### Returns

`Id`
