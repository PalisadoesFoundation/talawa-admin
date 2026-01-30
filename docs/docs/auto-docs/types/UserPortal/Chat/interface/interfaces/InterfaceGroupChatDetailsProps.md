[Admin Docs](/)

***

# Interface: InterfaceGroupChatDetailsProps

Defined in: [src/types/UserPortal/Chat/interface.ts:104](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L104)

## Properties

### chat

> **chat**: [`NewChatType`](../type-aliases/NewChatType.md)

Defined in: [src/types/UserPortal/Chat/interface.ts:107](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L107)

***

### chatRefetch()

> **chatRefetch**: (`variables?`) => `Promise`\<`ApolloQueryResult`\<\{ `chat`: [`NewChatType`](../type-aliases/NewChatType.md); \}\>\>

Defined in: [src/types/UserPortal/Chat/interface.ts:108](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L108)

#### Parameters

##### variables?

`Partial`\<\{ `after?`: `string`; `beforeMessages?`: `string`; `first?`: `number`; `input`: \{ `id`: `string`; \}; `lastMessages?`: `number`; \}\>

#### Returns

`Promise`\<`ApolloQueryResult`\<\{ `chat`: [`NewChatType`](../type-aliases/NewChatType.md); \}\>\>

***

### groupChatDetailsModalisOpen

> **groupChatDetailsModalisOpen**: `boolean`

Defined in: [src/types/UserPortal/Chat/interface.ts:106](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L106)

***

### toggleGroupChatDetailsModal()

> **toggleGroupChatDetailsModal**: () => `void`

Defined in: [src/types/UserPortal/Chat/interface.ts:105](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L105)

#### Returns

`void`
