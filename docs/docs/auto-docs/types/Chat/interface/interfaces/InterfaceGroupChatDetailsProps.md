[Admin Docs](/)

***

# Interface: InterfaceGroupChatDetailsProps

Defined in: src/types/Chat/interface.ts:100

## Properties

### chat

> **chat**: [`NewChatType`](../type-aliases/NewChatType.md)

Defined in: src/types/Chat/interface.ts:103

***

### chatRefetch()

> **chatRefetch**: (`variables?`) => `Promise`\<`ApolloQueryResult`\<\{ `chat`: [`NewChatType`](../type-aliases/NewChatType.md); \}\>\>

Defined in: src/types/Chat/interface.ts:104

#### Parameters

##### variables?

`Partial`\<\{ `after?`: `string`; `beforeMessages?`: `string`; `first?`: `number`; `input`: \{ `id`: `string`; \}; `lastMessages?`: `number`; \}\>

#### Returns

`Promise`\<`ApolloQueryResult`\<\{ `chat`: [`NewChatType`](../type-aliases/NewChatType.md); \}\>\>

***

### groupChatDetailsModalisOpen

> **groupChatDetailsModalisOpen**: `boolean`

Defined in: src/types/Chat/interface.ts:102

***

### toggleGroupChatDetailsModal()

> **toggleGroupChatDetailsModal**: () => `void`

Defined in: src/types/Chat/interface.ts:101

#### Returns

`void`
