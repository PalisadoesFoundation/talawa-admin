[Admin Docs](/)

***

# Interface: InterfaceCreateDirectChatProps

Defined in: [src/types/UserPortal/CreateDirectChat/interface.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/CreateDirectChat/interface.ts#L11)

## Properties

### chats

> **chats**: [`GroupChat`](../../../../Chat/type/type-aliases/GroupChat.md)[]

Defined in: [src/types/UserPortal/CreateDirectChat/interface.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/CreateDirectChat/interface.ts#L17)

***

### chatsListRefetch()

> **chatsListRefetch**: (`variables?`) => `Promise`\<`ApolloQueryResult`\<`unknown`\>\>

Defined in: [src/types/UserPortal/CreateDirectChat/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/CreateDirectChat/interface.ts#L14)

#### Parameters

##### variables?

`Partial`\<\{ `id`: `string`; \}\>

#### Returns

`Promise`\<`ApolloQueryResult`\<`unknown`\>\>

***

### createDirectChatModalisOpen

> **createDirectChatModalisOpen**: `boolean`

Defined in: [src/types/UserPortal/CreateDirectChat/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/CreateDirectChat/interface.ts#L13)

***

### toggleCreateDirectChatModal()

> **toggleCreateDirectChatModal**: () => `void`

Defined in: [src/types/UserPortal/CreateDirectChat/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/CreateDirectChat/interface.ts#L12)

#### Returns

`void`
