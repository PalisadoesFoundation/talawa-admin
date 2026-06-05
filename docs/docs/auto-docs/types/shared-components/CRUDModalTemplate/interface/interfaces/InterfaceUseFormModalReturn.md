[Admin Docs](/)

***

# Interface: InterfaceUseFormModalReturn\<T\>

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:336](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L336)

Return type for useFormModal hook

## Extends

- [`InterfaceUseModalStateReturn`](InterfaceUseModalStateReturn.md)

## Extended by

- [`InterfaceUseMutationModalReturn`](InterfaceUseMutationModalReturn.md)

## Type Parameters

### T

`T`

## Properties

### close()

> **close**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:328](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L328)

Closes the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseModalStateReturn`](InterfaceUseModalStateReturn.md).[`close`](InterfaceUseModalStateReturn.md#close)

***

### formData

> **formData**: `T`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:340](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L340)

Form data being edited

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:324](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L324)

Whether the modal is currently open

#### Inherited from

[`InterfaceUseModalStateReturn`](InterfaceUseModalStateReturn.md).[`isOpen`](InterfaceUseModalStateReturn.md#isopen)

***

### isSubmitting

> **isSubmitting**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:346](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L346)

Whether the form is currently submitting

***

### open()

> **open**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:326](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L326)

Opens the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseModalStateReturn`](InterfaceUseModalStateReturn.md).[`open`](InterfaceUseModalStateReturn.md#open)

***

### openWithData()

> **openWithData**: (`data`) => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:342](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L342)

Sets the form data and opens the modal

#### Parameters

##### data

`T`

#### Returns

`void`

***

### reset()

> **reset**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:344](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L344)

Resets form data and closes the modal

#### Returns

`void`

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

***

### toggle()

> **toggle**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:330](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L330)

Toggles the modal open/close state

#### Returns

`void`

#### Inherited from

[`InterfaceUseModalStateReturn`](InterfaceUseModalStateReturn.md).[`toggle`](InterfaceUseModalStateReturn.md#toggle)
