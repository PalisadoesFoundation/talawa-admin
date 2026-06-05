[Admin Docs](/)

***

# Interface: InterfaceUseMutationModalReturn\<TData, TResult\>

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:354](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L354)

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

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:364](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L364)

Clears the error state

#### Returns

`void`

***

### close()

> **close**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:328](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L328)

Closes the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`close`](InterfaceUseFormModalReturn.md#close)

***

### error

> **error**: `Error`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:362](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L362)

Error from the last mutation attempt

***

### execute()

> **execute**: (`data?`) => `Promise`\<`TResult`\>

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:360](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L360)

Executes the mutation with current form data

#### Parameters

##### data?

`TData`

#### Returns

`Promise`\<`TResult`\>

***

### formData

> **formData**: `TData`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:340](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L340)

Form data being edited

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`formData`](InterfaceUseFormModalReturn.md#formdata)

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:324](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L324)

Whether the modal is currently open

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`isOpen`](InterfaceUseFormModalReturn.md#isopen)

***

### isSubmitting

> **isSubmitting**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:346](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L346)

Whether the form is currently submitting

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`isSubmitting`](InterfaceUseFormModalReturn.md#issubmitting)

***

### open()

> **open**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:326](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L326)

Opens the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`open`](InterfaceUseFormModalReturn.md#open)

***

### openWithData()

> **openWithData**: (`data`) => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:342](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L342)

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

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:344](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L344)

Resets form data and closes the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`reset`](InterfaceUseFormModalReturn.md#reset)

***

### setIsSubmitting()

> **setIsSubmitting**: (`value`) => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:348](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L348)

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

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:330](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L330)

Toggles the modal open/close state

#### Returns

`void`

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`toggle`](InterfaceUseFormModalReturn.md#toggle)
