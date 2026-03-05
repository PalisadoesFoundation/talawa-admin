[Admin Docs](/)

***

# Interface: InterfaceEventListCardModalsProps

Defined in: [src/types/shared-components/EventListCard/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventListCard/interface.ts#L20)

Props for EventListCardModals component.

## Param

The event card properties including event details.

## Param

Whether the modal is currently visible.

## Param

Callback to close the modal.

## Param

Translation function scoped to 'translation' namespace.

## Param

Translation function for common strings.

## Properties

### eventListCardProps

> **eventListCardProps**: [`InterfaceEventListCard`](InterfaceEventListCard.md)

Defined in: [src/types/shared-components/EventListCard/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventListCard/interface.ts#L21)

***

### eventModalIsOpen

> **eventModalIsOpen**: `boolean`

Defined in: [src/types/shared-components/EventListCard/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventListCard/interface.ts#L22)

***

### hideViewModal()

> **hideViewModal**: () => `void`

Defined in: [src/types/shared-components/EventListCard/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventListCard/interface.ts#L23)

#### Returns

`void`

***

### tCommon()

> **tCommon**: (`key`, `options?`) => `string`

Defined in: [src/types/shared-components/EventListCard/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/EventListCard/interface.ts#L24)

#### Parameters

##### key

`string`

##### options?

`Record`\<`string`, `unknown`\>

#### Returns

`string`
