[Admin Docs](/)

***

# Interface: InterfaceCreateDirectChatProps

Defined in: [src/types/UserPortal/Chat/interface.ts:137](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L137)

## Properties

### chats

> **chats**: [`Chat`](../type-aliases/Chat.md)[]

Defined in: [src/types/UserPortal/Chat/interface.ts:143](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L143)

***

### chatsListRefetch()

> **chatsListRefetch**: (`variables?`) => `Promise`\<`ApolloQueryResult`\<`unknown`\>\>

Defined in: [src/types/UserPortal/Chat/interface.ts:140](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L140)

#### Parameters

##### variables?

`Partial`\<\{ `id`: `string`; \}\>

#### Returns

`Promise`\<`ApolloQueryResult`\<`unknown`\>\>

***

### createDirectChatModalisOpen

> **createDirectChatModalisOpen**: `boolean`

Defined in: [src/types/UserPortal/Chat/interface.ts:139](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L139)

***

### toggleCreateDirectChatModal()

> **toggleCreateDirectChatModal**: () => `void`

Defined in: [src/types/UserPortal/Chat/interface.ts:138](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L138)

#### Returns

`void`
