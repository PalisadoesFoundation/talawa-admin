[Admin Docs](/)

***

# ~~Type Alias: GroupChat~~

> **GroupChat** = `object`

Defined in: [src/types/UserPortal/Chat/type.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/type.ts#L23)

## Deprecated

Use NewChatType from 'types/UserPortal/Chat/interface' instead.
This type uses legacy fields (_id, users, image) that are not queried by the GraphQL layer.
Only kept for test mocks compatibility - should not be used in production code.

## Properties

### ~~\_id~~

> **\_id**: `string`

Defined in: [src/types/UserPortal/Chat/type.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/type.ts#L24)

***

### ~~admins~~

> **admins**: [`User`](../../../../shared-components/User/type/type-aliases/User.md)[]

Defined in: [src/types/UserPortal/Chat/type.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/type.ts#L29)

***

### ~~createdAt~~

> **createdAt**: `Date`

Defined in: [src/types/UserPortal/Chat/type.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/type.ts#L33)

***

### ~~creator?~~

> `optional` **creator**: [`User`](../../../../shared-components/User/type/type-aliases/User.md)

Defined in: [src/types/UserPortal/Chat/type.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/type.ts#L34)

***

### ~~description~~

> **description**: `string`

Defined in: [src/types/UserPortal/Chat/type.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/type.ts#L32)

***

### ~~image?~~

> `optional` **image**: `string`

Defined in: [src/types/UserPortal/Chat/type.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/type.ts#L27)

***

### ~~isGroup~~

> **isGroup**: `boolean`

Defined in: [src/types/UserPortal/Chat/type.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/type.ts#L25)

***

### ~~lastMessageId?~~

> `optional` **lastMessageId**: `string`

Defined in: [src/types/UserPortal/Chat/type.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/type.ts#L37)

***

### ~~messages~~

> **messages**: [`DirectMessage`](DirectMessage.md)[]

Defined in: [src/types/UserPortal/Chat/type.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/type.ts#L28)

***

### ~~name?~~

> `optional` **name**: `string`

Defined in: [src/types/UserPortal/Chat/type.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/type.ts#L26)

***

### ~~organization?~~

> `optional` **organization**: [`Organization`](../../../../AdminPortal/Organization/type/type-aliases/Organization.md)

Defined in: [src/types/UserPortal/Chat/type.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/type.ts#L35)

***

### ~~unseenMessagesByUsers~~

> **unseenMessagesByUsers**: `string`

Defined in: [src/types/UserPortal/Chat/type.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/type.ts#L31)

***

### ~~updatedAt?~~

> `optional` **updatedAt**: `Date`

Defined in: [src/types/UserPortal/Chat/type.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/type.ts#L36)

***

### ~~users~~

> **users**: [`User`](../../../../shared-components/User/type/type-aliases/User.md)[]

Defined in: [src/types/UserPortal/Chat/type.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/type.ts#L30)
