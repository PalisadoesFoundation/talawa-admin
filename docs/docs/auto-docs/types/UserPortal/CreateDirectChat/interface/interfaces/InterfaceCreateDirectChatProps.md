[Admin Docs](/)

***

# Interface: InterfaceCreateDirectChatProps

Defined in: [src/types/UserPortal/CreateDirectChat/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/CreateDirectChat/interface.ts#L21)

Props for the CreateDirectChat component

## Properties

### chats

> **chats**: [`GroupChat`](../../../../Chat/type/type-aliases/GroupChat.md)[]

Defined in: [src/types/UserPortal/CreateDirectChat/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/CreateDirectChat/interface.ts#L31)

List of existing chats

***

### chatsListRefetch()

> **chatsListRefetch**: (`variables?`) => `Promise`\<`ApolloQueryResult`\<`unknown`\>\>

Defined in: [src/types/UserPortal/CreateDirectChat/interface.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/CreateDirectChat/interface.ts#L27)

Function to refetch the chats list

#### Parameters

##### variables?

`Partial`\<\{ `id`: `string`; \}\>

#### Returns

`Promise`\<`ApolloQueryResult`\<`unknown`\>\>

***

### createDirectChatModalisOpen

> **createDirectChatModalisOpen**: `boolean`

Defined in: [src/types/UserPortal/CreateDirectChat/interface.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/CreateDirectChat/interface.ts#L25)

Whether the create direct chat modal is open

***

### toggleCreateDirectChatModal()

> **toggleCreateDirectChatModal**: () => `void`

Defined in: [src/types/UserPortal/CreateDirectChat/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/CreateDirectChat/interface.ts#L23)

Function to toggle the create direct chat modal

#### Returns

`void`
