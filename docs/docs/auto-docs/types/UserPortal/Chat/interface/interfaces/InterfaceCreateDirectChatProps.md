[Admin Docs](/)

***

# Interface: InterfaceCreateDirectChatProps

Defined in: [src/types/UserPortal/Chat/interface.ts:143](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L143)

Props for the CreateDirectChat modal.

## Properties

### chats

> **chats**: [`Chat`](../type-aliases/Chat.md)[]

Defined in: [src/types/UserPortal/Chat/interface.ts:149](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L149)

***

### chatsListRefetch()

> **chatsListRefetch**: (`variables?`) => `Promise`\<`ApolloQueryResult`\<`unknown`\>\>

Defined in: [src/types/UserPortal/Chat/interface.ts:146](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L146)

#### Parameters

##### variables?

`Partial`\<\{ `id`: `string`; \}\>

#### Returns

`Promise`\<`ApolloQueryResult`\<`unknown`\>\>

***

### createDirectChatModalisOpen

> **createDirectChatModalisOpen**: `boolean`

Defined in: [src/types/UserPortal/Chat/interface.ts:145](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L145)

***

### toggleCreateDirectChatModal()

> **toggleCreateDirectChatModal**: () => `void`

Defined in: [src/types/UserPortal/Chat/interface.ts:144](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L144)

#### Returns

`void`
