[Admin Docs](/)

***

# Interface: InterfaceUseFormModalReturn\<T\>

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:353](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L353)

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

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:345](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L345)

Closes the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseModalStateReturn`](InterfaceUseModalStateReturn.md).[`close`](InterfaceUseModalStateReturn.md#close)

***

### formData

> **formData**: `T`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:357](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L357)

Form data being edited

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:341](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L341)

Whether the modal is currently open

#### Inherited from

[`InterfaceUseModalStateReturn`](InterfaceUseModalStateReturn.md).[`isOpen`](InterfaceUseModalStateReturn.md#isopen)

***

### isSubmitting

> **isSubmitting**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:363](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L363)

Whether the form is currently submitting

***

### open()

> **open**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:343](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L343)

Opens the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseModalStateReturn`](InterfaceUseModalStateReturn.md).[`open`](InterfaceUseModalStateReturn.md#open)

***

### openWithData()

> **openWithData**: (`data`) => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:359](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L359)

Sets the form data and opens the modal

#### Parameters

##### data

`T`

#### Returns

`void`

***

### reset()

> **reset**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:361](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L361)

Resets form data and closes the modal

#### Returns

`void`

***

### setIsSubmitting()

> **setIsSubmitting**: (`value`) => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:365](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L365)

Sets the submitting state

#### Parameters

##### value

`boolean`

#### Returns

`void`

***

### toggle()

> **toggle**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:347](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L347)

Toggles the modal open/close state

#### Returns

`void`

#### Inherited from

[`InterfaceUseModalStateReturn`](InterfaceUseModalStateReturn.md).[`toggle`](InterfaceUseModalStateReturn.md#toggle)
