[Admin Docs](/)

***

# Interface: InterfacePostViewModalProps

Defined in: [src/types/shared-components/PostViewModal/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PostViewModal/interface.ts#L6)

Props for PostViewModal component.

## Properties

### onHide()

> **onHide**: () => `void`

Defined in: [src/types/shared-components/PostViewModal/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PostViewModal/interface.ts#L10)

Callback invoked when the modal should close.

#### Returns

`void`

***

### post

> **post**: [`InterfacePost`](../../../../Post/interface/interfaces/InterfacePost.md)

Defined in: [src/types/shared-components/PostViewModal/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PostViewModal/interface.ts#L12)

The post data to display, or null if not loaded.

***

### refetch()

> **refetch**: () => `Promise`\<`unknown`\>

Defined in: [src/types/shared-components/PostViewModal/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PostViewModal/interface.ts#L14)

Function to refresh post data after mutations.

#### Returns

`Promise`\<`unknown`\>

***

### show

> **show**: `boolean`

Defined in: [src/types/shared-components/PostViewModal/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PostViewModal/interface.ts#L8)

Controls the visibility of the modal.
