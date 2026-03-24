[Admin Docs](/)

***

# Interface: InterfaceUseMutationModalReturn\<TData, TResult\>

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:344](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L344)

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

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:354](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L354)

Clears the error state

#### Returns

`void`

***

### close()

> **close**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:318](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L318)

Closes the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`close`](InterfaceUseFormModalReturn.md#close)

***

### error

> **error**: `Error`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:352](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L352)

Error from the last mutation attempt

***

### execute()

> **execute**: (`data?`) => `Promise`\<`TResult`\>

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:350](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L350)

Executes the mutation with current form data

#### Parameters

##### data?

`TData`

#### Returns

`Promise`\<`TResult`\>

***

### formData

> **formData**: `TData`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:330](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L330)

Form data being edited

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`formData`](InterfaceUseFormModalReturn.md#formdata)

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:314](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L314)

Whether the modal is currently open

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`isOpen`](InterfaceUseFormModalReturn.md#isopen)

***

### isSubmitting

> **isSubmitting**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:336](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L336)

Whether the form is currently submitting

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`isSubmitting`](InterfaceUseFormModalReturn.md#issubmitting)

***

### open()

> **open**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:316](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L316)

Opens the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`open`](InterfaceUseFormModalReturn.md#open)

***

### openWithData()

> **openWithData**: (`data`) => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:332](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L332)

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

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:334](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L334)

Resets form data and closes the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`reset`](InterfaceUseFormModalReturn.md#reset)

***

### setIsSubmitting()

> **setIsSubmitting**: (`value`) => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:338](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L338)

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

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:320](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L320)

Toggles the modal open/close state

#### Returns

`void`

#### Inherited from

[`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md).[`toggle`](InterfaceUseFormModalReturn.md#toggle)
