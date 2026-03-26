[Admin Docs](/)

***

# Interface: InterfaceUseFormModalReturn\<T\>

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:331](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L331)

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

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:323](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L323)

Closes the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseModalStateReturn`](InterfaceUseModalStateReturn.md).[`close`](InterfaceUseModalStateReturn.md#close)

***

### formData

> **formData**: `T`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:335](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L335)

Form data being edited

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:319](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L319)

Whether the modal is currently open

#### Inherited from

[`InterfaceUseModalStateReturn`](InterfaceUseModalStateReturn.md).[`isOpen`](InterfaceUseModalStateReturn.md#isopen)

***

### isSubmitting

> **isSubmitting**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:341](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L341)

Whether the form is currently submitting

***

### open()

> **open**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:321](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L321)

Opens the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseModalStateReturn`](InterfaceUseModalStateReturn.md).[`open`](InterfaceUseModalStateReturn.md#open)

***

### openWithData()

> **openWithData**: (`data`) => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:337](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L337)

Sets the form data and opens the modal

#### Parameters

##### data

`T`

#### Returns

`void`

***

### reset()

> **reset**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:339](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L339)

Resets form data and closes the modal

#### Returns

`void`

***

### setIsSubmitting()

> **setIsSubmitting**: (`value`) => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:343](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L343)

Sets the submitting state

#### Parameters

##### value

`boolean`

#### Returns

`void`

***

### toggle()

> **toggle**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:325](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L325)

Toggles the modal open/close state

#### Returns

`void`

#### Inherited from

[`InterfaceUseModalStateReturn`](InterfaceUseModalStateReturn.md).[`toggle`](InterfaceUseModalStateReturn.md#toggle)
