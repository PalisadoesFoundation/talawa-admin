[Admin Docs](/)

***

# Interface: InterfaceUseMutationModalReturn\<TData, TResult\>

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:339](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L339)

Return type for useMutationModal hook

## Extends

- [`InterfaceUseFormModalReturn`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceUseFormModalReturn.md)\<`TData`\>

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

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:313](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L313)

Closes the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseFormModalReturn`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceUseFormModalReturn.md).[`close`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceUseFormModalReturn.md#close)

***

### error

> **error**: `Error`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:347](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L347)

Error from the last mutation attempt

***

### execute()

> **execute**: (`data`?) => `Promise`\<`TResult`\>

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

[`InterfaceUseFormModalReturn`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceUseFormModalReturn.md).[`formData`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceUseFormModalReturn.md#formdata)

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:309](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L309)

Whether the modal is currently open

#### Inherited from

[`InterfaceUseFormModalReturn`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceUseFormModalReturn.md).[`isOpen`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceUseFormModalReturn.md#isopen)

***

### isSubmitting

> **isSubmitting**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:331](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L331)

Whether the form is currently submitting

#### Inherited from

[`InterfaceUseFormModalReturn`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceUseFormModalReturn.md).[`isSubmitting`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceUseFormModalReturn.md#issubmitting)

***

### open()

> **open**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:311](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L311)

Opens the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseFormModalReturn`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceUseFormModalReturn.md).[`open`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceUseFormModalReturn.md#open)

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

[`InterfaceUseFormModalReturn`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceUseFormModalReturn.md).[`openWithData`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceUseFormModalReturn.md#openwithdata)

***

### reset()

> **reset**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:329](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L329)

Resets form data and closes the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseFormModalReturn`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceUseFormModalReturn.md).[`reset`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceUseFormModalReturn.md#reset)

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

[`InterfaceUseFormModalReturn`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceUseFormModalReturn.md).[`setIsSubmitting`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceUseFormModalReturn.md#setissubmitting)

***

### toggle()

> **toggle**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:315](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L315)

Toggles the modal open/close state

#### Returns

`void`

#### Inherited from

[`InterfaceUseFormModalReturn`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceUseFormModalReturn.md).[`toggle`](types\shared-components\CRUDModalTemplate\interface\README\interfaces\InterfaceUseFormModalReturn.md#toggle)
