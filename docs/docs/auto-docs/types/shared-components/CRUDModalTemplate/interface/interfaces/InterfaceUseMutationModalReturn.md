[Admin Docs](/)

***

# Interface: InterfaceUseMutationModalReturn\<TData, TResult\>

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:339](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L339)

Return type for useMutationModal hook

## Extends

- [`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md)\<`TData`\>

## Type Parameters

### TData

`TData`

### TResult

`TResult` = `unknown`

## Properties

### clearError()

> **clearError**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:349](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L349)

Clears the error state

#### Returns

`void`

***

### close()

> **close**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:314](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L314)

Closes the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`close`](InterfaceUseFormModalReturn.md#close)

***

### error

> **error**: `Error`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:347](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L347)

Error from the last mutation attempt

***

### execute()

> **execute**: (`data?`) => `Promise`\<`TResult`\>

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:345](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L345)

Executes the mutation with current form data

#### Parameters

##### data?

`TData`

#### Returns

`Promise`\<`TResult`\>

***

### formData

> **formData**: `TData`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:325](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L325)

Form data being edited

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`formData`](InterfaceUseFormModalReturn.md#formdata)

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:310](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L310)

Whether the modal is currently open

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`isOpen`](InterfaceUseFormModalReturn.md#isopen)

***

### isSubmitting

> **isSubmitting**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:331](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L331)

Whether the form is currently submitting

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`isSubmitting`](InterfaceUseFormModalReturn.md#issubmitting)

***

### open()

> **open**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:312](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L312)

Opens the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`open`](InterfaceUseFormModalReturn.md#open)

***

### openWithData()

> **openWithData**: (`data`) => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:327](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L327)

Sets the form data and opens the modal

#### Parameters

##### data

`TData`

#### Returns

`void`

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`openWithData`](InterfaceUseFormModalReturn.md#openwithdata)

***

### reset()

> **reset**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:329](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L329)

Resets form data and closes the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`reset`](InterfaceUseFormModalReturn.md#reset)

***

### setIsSubmitting()

> **setIsSubmitting**: (`value`) => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:333](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L333)

Sets the submitting state

#### Parameters

##### value

`boolean`

#### Returns

`void`

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`setIsSubmitting`](InterfaceUseFormModalReturn.md#setissubmitting)

***

### toggle()

> **toggle**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:316](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L316)

Toggles the modal open/close state

#### Returns

`void`

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`toggle`](InterfaceUseFormModalReturn.md#toggle)
