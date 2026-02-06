[Admin Docs](/)

***

# Interface: InterfaceUseModalStateReturn

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:317](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L317)

Return type for useModalState hook

## Extended by

- [`InterfaceUseFormModalReturn`](InterfaceUseFormModalReturn.md)

## Properties

### close()

> **close**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:323](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L323)

Closes the modal

#### Returns

`void`

***

### isOpen

> **isOpen**: `boolean`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:319](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L319)

Whether the modal is currently open

***

### open()

> **open**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:321](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L321)

Opens the modal

#### Returns

`void`

***

### setIsOpen

> **setIsOpen**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:327](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L327)

Sets the modal open/close state directly

***

### toggle()

> **toggle**: () => `void`

Defined in: [src/types/shared-components/CRUDModalTemplate/interface.ts:325](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/CRUDModalTemplate/interface.ts#L325)

Toggles the modal open/close state

#### Returns

`void`
