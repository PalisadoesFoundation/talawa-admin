[Admin Docs](/)

***

# Interface: InterfaceEventListCardModalsProps

Defined in: [src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts#L14)

Props for EventListCardModals component.

## Properties

### eventListCardProps

> **eventListCardProps**: [`InterfaceEventListCard`](InterfaceEventListCard.md)

Defined in: [src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts#L16)

Event card properties including event details.

***

### eventModalIsOpen

> **eventModalIsOpen**: `boolean`

Defined in: [src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts#L18)

Whether the event modal is currently open.

***

### hideViewModal()

> **hideViewModal**: () => `void`

Defined in: [src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts#L20)

Callback to hide the view modal.

#### Returns

`void`

***

### t()

> **t**: (`key`, `options?`) => `string`

Defined in: [src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts#L22)

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

Defined in: [src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventListCard/Modal/EventListCardModals/interface.ts#L24)

Translation function for common localized strings.

#### Parameters

##### key

`string`

#### Returns

`string`
