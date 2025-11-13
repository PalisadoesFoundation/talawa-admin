[Admin Docs](/)

***

# Interface: IChatRoomProps

Defined in: [src/components/UserPortal/ChatRoom/ChatRoomTypes.ts:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/ChatRoomTypes.ts#L9)

## Properties

### chatListRefetch()

> **chatListRefetch**: (`variables?`) => `Promise`\<`ApolloQueryResult`\<\{ `chatList`: [`GroupChat`](../../../../../types/Chat/type/type-aliases/GroupChat.md)[]; \}\>\>

Defined in: [src/components/UserPortal/ChatRoom/ChatRoomTypes.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/ChatRoomTypes.ts#L11)

#### Parameters

##### variables?

`Partial`\<\{ `id`: `string`; \}\>

#### Returns

`Promise`\<`ApolloQueryResult`\<\{ `chatList`: [`GroupChat`](../../../../../types/Chat/type/type-aliases/GroupChat.md)[]; \}\>\>

***

### selectedContact

> **selectedContact**: `string`

Defined in: [src/components/UserPortal/ChatRoom/ChatRoomTypes.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/ChatRoomTypes.ts#L10)
