[Admin Docs](/)

***

# Type Alias: DirectMessage

> **DirectMessage**: `object`

Defined in: [src/types/Chat/type.ts:4](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/type.ts#L4)

## Type declaration

### \_id

> **\_id**: `string`

### chatMessageBelongsTo?

> `optional` **chatMessageBelongsTo**: [`GroupChat`](GroupChat.md)

### createdAt

> **createdAt**: `Date`

### deletedBy?

> `optional` **deletedBy**: [`User`](../../../User/type/type-aliases/User.md)[]

### media?

> `optional` **media**: `string`

### messageContent

> **messageContent**: `string`

### receiver?

> `optional` **receiver**: [`User`](../../../User/type/type-aliases/User.md)

### replyTo?

> `optional` **replyTo**: [`DirectMessage`](DirectMessage.md)

### sender

> **sender**: [`User`](../../../User/type/type-aliases/User.md)

### type?

> `optional` **type**: `string`

### updatedAt

> **updatedAt**: `Date`
