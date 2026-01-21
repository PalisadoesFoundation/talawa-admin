[Admin Docs](/)

***

# Interface: InterfaceNotificationToastHelpers

Defined in: [src/types/NotificationToast/interface.ts:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/NotificationToast/interface.ts#L50)

Reusable helper API exposed by `NotificationToast`.

## Properties

### dismiss()

> **dismiss**: () => `void`

Defined in: [src/types/NotificationToast/interface.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/NotificationToast/interface.ts#L74)

Dismiss all active toasts.

#### Returns

`void`

***

### error()

> **error**: (`message`, `options?`) => `Id`

Defined in: [src/types/NotificationToast/interface.ts:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/NotificationToast/interface.ts#L59)

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

Defined in: [src/types/NotificationToast/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/NotificationToast/interface.ts#L69)

Show an info toast.

#### Parameters

##### message

[`NotificationToastMessage`](../type-aliases/NotificationToastMessage.md)

##### options?

`ToastOptions`

#### Returns

`Id`

***

### success()

> **success**: (`message`, `options?`) => `Id`

Defined in: [src/types/NotificationToast/interface.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/NotificationToast/interface.ts#L54)

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

Defined in: [src/types/NotificationToast/interface.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/NotificationToast/interface.ts#L64)

Show a warning toast.

#### Parameters

##### message

[`NotificationToastMessage`](../type-aliases/NotificationToastMessage.md)

##### options?

`ToastOptions`

#### Returns

`Id`
