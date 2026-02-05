[Admin Docs](/)

***

# Interface: InterfaceCreateDirectChatProps

Defined in: [src/types/UserPortal/CreateDirectChat/interface.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/CreateDirectChat/interface.ts#L7)

Props for the CreateDirectChat modal.

## Properties

### chats

> **chats**: [`Chat`](../../../Chat/interface/type-aliases/Chat.md)[]

Defined in: [src/types/UserPortal/CreateDirectChat/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/CreateDirectChat/interface.ts#L13)

***

### chatsListRefetch()

> **chatsListRefetch**: (`variables?`) => `Promise`\<`ApolloQueryResult`\<`unknown`\>\>

Defined in: [src/types/UserPortal/CreateDirectChat/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/CreateDirectChat/interface.ts#L10)

#### Parameters

##### variables?

`Partial`\<\{ `id`: `string`; \}\>

#### Returns

`Promise`\<`ApolloQueryResult`\<`unknown`\>\>

***

### createDirectChatModalisOpen

> **createDirectChatModalisOpen**: `boolean`

Defined in: [src/types/UserPortal/CreateDirectChat/interface.ts:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/CreateDirectChat/interface.ts#L9)

***

### toggleCreateDirectChatModal()

> **toggleCreateDirectChatModal**: () => `void`

Defined in: [src/types/UserPortal/CreateDirectChat/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/CreateDirectChat/interface.ts#L8)

#### Returns

`void`
