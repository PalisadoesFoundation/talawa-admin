[Admin Docs](/)

***

# Interface: InterfaceCreateDirectChatProps

Defined in: src/types/UserPortal/CreateDirectChat/interface.ts:15

Props for CreateDirectChat modal.

## Properties

### chats

> **chats**: [`NewChatType`](../../../Chat/interface/type-aliases/NewChatType.md)[]

Defined in: src/types/UserPortal/CreateDirectChat/interface.ts:21

***

### chatsListRefetch()

> **chatsListRefetch**: (`variables?`) => `Promise`\<`ApolloQueryResult`\<`unknown`\>\>

Defined in: src/types/UserPortal/CreateDirectChat/interface.ts:18

#### Parameters

##### variables?

`Partial`\<\{ `id`: `string`; \}\>

#### Returns

`Promise`\<`ApolloQueryResult`\<`unknown`\>\>

***

### createDirectChatModalisOpen

> **createDirectChatModalisOpen**: `boolean`

Defined in: src/types/UserPortal/CreateDirectChat/interface.ts:17

***

### toggleCreateDirectChatModal()

> **toggleCreateDirectChatModal**: () => `void`

Defined in: src/types/UserPortal/CreateDirectChat/interface.ts:16

#### Returns

`void`
