[Admin Docs](/)

***

# Interface: InterfaceEventListCardModalsProps

Defined in: [src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts#L6)

Props for EventListCardModals component.

## Properties

### eventListCardProps

> **eventListCardProps**: [`InterfaceEventListCardProps`](../../../../interface/interfaces/InterfaceEventListCardProps.md)

Defined in: [src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts#L8)

Event card properties including event details.

***

### eventModalIsOpen

> **eventModalIsOpen**: `boolean`

Defined in: [src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts#L10)

Whether the event modal is currently open.

***

### hideViewModal()

> **hideViewModal**: () => `void`

Defined in: [src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts#L12)

Callback to hide the view modal.

#### Returns

`void`

***

### t()

> **t**: (`key`, `options?`) => `string`

Defined in: [src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts#L14)

Translation function for localized strings.

#### Parameters

##### key

`string`

##### options?

`Record`\<`string`, `unknown`\>

#### Returns

`string`

***

### tCommon()

> **tCommon**: (`key`) => `string`

Defined in: [src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts#L16)

Translation function for common localized strings.

#### Parameters

##### key

`string`

#### Returns

`string`
