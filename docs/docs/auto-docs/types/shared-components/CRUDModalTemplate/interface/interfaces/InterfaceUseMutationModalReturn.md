[Admin Docs](/)

***

# Interface: InterfaceUseMutationModalReturn\<TData, TResult\>

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:341](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L341)

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

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:351](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L351)

Clears the error state

#### Returns

`void`

***

### close()

> **close**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:313](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L313)

Closes the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`close`](InterfaceUseFormModalReturn.md#close)

***

### error

> **error**: `Error`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:349](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L349)

Error from the last mutation attempt

***

### execute()

> **execute**: (`data?`) => `Promise`\<`TResult`\>

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:347](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L347)

Executes the mutation with current form data

#### Parameters

##### data?

`TData`

#### Returns

`Promise`\<`TResult`\>

***

### formData

> **formData**: `TData`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:327](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L327)

Form data being edited

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`formData`](InterfaceUseFormModalReturn.md#formdata)

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:309](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L309)

Whether the modal is currently open

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`isOpen`](InterfaceUseFormModalReturn.md#isopen)

***

### isSubmitting

> **isSubmitting**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:333](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L333)

Whether the form is currently submitting

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`isSubmitting`](InterfaceUseFormModalReturn.md#issubmitting)

***

### open()

> **open**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:311](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L311)

Opens the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`open`](InterfaceUseFormModalReturn.md#open)

***

### openWithData()

> **openWithData**: (`data`) => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:329](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L329)

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

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:331](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L331)

Resets form data and closes the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`reset`](InterfaceUseFormModalReturn.md#reset)

***

### setIsOpen

> **setIsOpen**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:317](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L317)

Sets the modal open/close state directly

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`setIsOpen`](InterfaceUseFormModalReturn.md#setisopen)

***

### setIsSubmitting()

> **setIsSubmitting**: (`value`) => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:335](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L335)

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

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:315](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L315)

Toggles the modal open/close state

#### Returns

`void`

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`toggle`](InterfaceUseFormModalReturn.md#toggle)
