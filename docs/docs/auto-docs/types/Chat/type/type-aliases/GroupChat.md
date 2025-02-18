[Admin Docs](/)

***

# Type Alias: GroupChat

> **GroupChat**: `object`

Defined in: [src/types/Chat/type.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/type.ts#L18)

## Type declaration

### \_id

> **\_id**: `string`

### admins

> **admins**: [`User`](../../../User/type/type-aliases/User.md)[]

### createdAt

> **createdAt**: `Date`

### creator?

> `optional` **creator**: [`User`](../../../User/type/type-aliases/User.md)

### description

> **description**: `string`

### image?

> `optional` **image**: `string`

### isGroup

> **isGroup**: `boolean`

### lastMessageId?

> `optional` **lastMessageId**: `string`

### messages

> **messages**: [`DirectMessage`](DirectMessage.md)[]

### name?

> `optional` **name**: `string`

### organization?

> `optional` **organization**: [`Organization`](../../../Organization/type/type-aliases/Organization.md)

### unseenMessagesByUsers

> **unseenMessagesByUsers**: `string`

### updatedAt?

> `optional` **updatedAt**: `Date`

### users

> **users**: [`User`](../../../User/type/type-aliases/User.md)[]
