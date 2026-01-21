[Admin Docs](/)

***

# Interface: InterfaceNotificationToastHelpers

Defined in: [src/types/shared-components/NotificationToast/interface.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/NotificationToast/interface.ts#L64)

Reusable helper API exposed by `NotificationToast`.

## Properties

### dismiss()

> **dismiss**: () => `void`

Defined in: [src/types/shared-components/NotificationToast/interface.ts:88](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/NotificationToast/interface.ts#L88)

Dismiss all active toasts.

#### Returns

`void`

***

### error()

> **error**: (`message`, `options?`) => `Id`

Defined in: [src/types/shared-components/NotificationToast/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/NotificationToast/interface.ts#L73)

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

Defined in: [src/types/shared-components/NotificationToast/interface.ts:83](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/NotificationToast/interface.ts#L83)

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

> **promise**: \<`T`\>(`promisifiedFunction`, `messages`, `options?`) => `Promise`\<`T`\>

Defined in: [src/types/shared-components/NotificationToast/interface.ts:93](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/NotificationToast/interface.ts#L93)

Show a promise toast with pending, success, and error states.

#### Type Parameters

##### T

`T` = `void`

#### Parameters

##### promisifiedFunction

[`PromiseFunction`](../type-aliases/PromiseFunction.md)\<`T`\>

##### messages

[`InterfacePromiseMessages`](InterfacePromiseMessages.md)

##### options?

`ToastOptions`

#### Returns

`Promise`\<`T`\>

***

### success()

> **success**: (`message`, `options?`) => `Id`

Defined in: [src/types/shared-components/NotificationToast/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/NotificationToast/interface.ts#L68)

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

Defined in: [src/types/shared-components/NotificationToast/interface.ts:78](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/NotificationToast/interface.ts#L78)

Show a warning toast.

#### Parameters

##### message

[`NotificationToastMessage`](../type-aliases/NotificationToastMessage.md)

##### options?

`ToastOptions`

#### Returns

`Id`
