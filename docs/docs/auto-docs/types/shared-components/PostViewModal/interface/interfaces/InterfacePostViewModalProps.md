[Admin Docs](/)

***

# Interface: InterfacePostViewModalProps

Defined in: [src/types/shared-components/PostViewModal/interface.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PostViewModal/interface.ts#L11)

Props for PostViewModal component.

## Param

Controls the visibility of the modal.

## Param

Callback invoked when the modal should close.

## Param

The post data to display, or null if not loaded.

## Param

Function to refresh post data after mutations.

## Properties

### onHide()

> **onHide**: () => `void`

Defined in: [src/types/shared-components/PostViewModal/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PostViewModal/interface.ts#L13)

#### Returns

`void`

***

### post

> **post**: [`InterfacePost`](../../../../Post/interface/interfaces/InterfacePost.md)

Defined in: [src/types/shared-components/PostViewModal/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PostViewModal/interface.ts#L14)

***

### refetch()

> **refetch**: () => `Promise`\<`unknown`\>

Defined in: [src/types/shared-components/PostViewModal/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PostViewModal/interface.ts#L15)

#### Returns

`Promise`\<`unknown`\>

***

### show

> **show**: `boolean`

Defined in: [src/types/shared-components/PostViewModal/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PostViewModal/interface.ts#L12)
