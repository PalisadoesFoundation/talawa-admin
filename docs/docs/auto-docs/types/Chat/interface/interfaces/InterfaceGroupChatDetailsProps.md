[Admin Docs](/)

***

# Interface: InterfaceGroupChatDetailsProps

Defined in: [src/types/Chat/interface.ts:4](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/interface.ts#L4)

## Properties

### chat

> **chat**: [`GroupChat`](../../type/type-aliases/GroupChat.md)

Defined in: [src/types/Chat/interface.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/interface.ts#L7)

***

### chatRefetch()

> **chatRefetch**: (`variables?`) => `Promise`\<`ApolloQueryResult`\<\{ `chat`: [`GroupChat`](../../type/type-aliases/GroupChat.md); \}\>\>

Defined in: [src/types/Chat/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/interface.ts#L8)

#### Parameters

##### variables?

`Partial`\<\{ `id`: `string`; \}\>

#### Returns

`Promise`\<`ApolloQueryResult`\<\{ `chat`: [`GroupChat`](../../type/type-aliases/GroupChat.md); \}\>\>

***

### groupChatDetailsModalisOpen

> **groupChatDetailsModalisOpen**: `boolean`

Defined in: [src/types/Chat/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/interface.ts#L6)

***

### toggleGroupChatDetailsModal()

> **toggleGroupChatDetailsModal**: () => `void`

Defined in: [src/types/Chat/interface.ts:5](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/interface.ts#L5)

#### Returns

`void`
