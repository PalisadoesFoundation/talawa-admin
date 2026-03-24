[Admin Docs](/)

***

# Interface: InterfaceUseFormModalReturn\<T\>

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:326](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L326)

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

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:318](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L318)

Closes the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseModalStateReturn`](InterfaceUseModalStateReturn.md).[`close`](InterfaceUseModalStateReturn.md#close)

***

### formData

> **formData**: `T`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:330](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L330)

Form data being edited

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:314](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L314)

Whether the modal is currently open

#### Inherited from

[`InterfaceUseModalStateReturn`](InterfaceUseModalStateReturn.md).[`isOpen`](InterfaceUseModalStateReturn.md#isopen)

***

### isSubmitting

> **isSubmitting**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:336](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L336)

Whether the form is currently submitting

***

### open()

> **open**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:316](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L316)

Opens the modal

#### Returns

`void`

#### Inherited from

[`InterfaceUseModalStateReturn`](InterfaceUseModalStateReturn.md).[`open`](InterfaceUseModalStateReturn.md#open)

***

### openWithData()

> **openWithData**: (`data`) => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:332](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L332)

Sets the form data and opens the modal

#### Parameters

##### data

`T`

#### Returns

`void`

***

### reset()

> **reset**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:334](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L334)

Resets form data and closes the modal

#### Returns

`void`

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

***

### toggle()

> **toggle**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:320](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L320)

Toggles the modal open/close state

#### Returns

`void`

#### Inherited from

[`InterfaceUseModalStateReturn`](InterfaceUseModalStateReturn.md).[`toggle`](InterfaceUseModalStateReturn.md#toggle)
