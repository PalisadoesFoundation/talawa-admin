[Admin Docs](/)

***

# Type Alias: ChatMessage

> **ChatMessage**: `object`

Defined in: [src/types/chat.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/chat.ts#L18)

## Type declaration

### \_id

> **\_id**: `string`

### chatMessageBelongsTo

> **chatMessageBelongsTo**: [`Chat`](Chat.md)

### createdAt

> **createdAt**: `Date`

### deletedBy?

> `optional` **deletedBy**: [`User`](../../User/type/type-aliases/User.md)[]

### messageContent

> **messageContent**: `string`

### replyTo?

> `optional` **replyTo**: [`ChatMessage`](ChatMessage.md)

### sender

> **sender**: [`User`](../../User/type/type-aliases/User.md)

### type

> **type**: `string`

### updatedAt

> **updatedAt**: `Date`
