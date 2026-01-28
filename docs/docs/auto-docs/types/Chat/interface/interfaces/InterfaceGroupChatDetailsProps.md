[**talawa-admin**](../../../../README.md)

***

# Interface: InterfaceGroupChatDetailsProps

Defined in: [src/types/Chat/interface.ts:100](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/Chat/interface.ts#L100)

## Properties

### chat

> **chat**: [`NewChatType`](../type-aliases/NewChatType.md)

Defined in: [src/types/Chat/interface.ts:103](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/Chat/interface.ts#L103)

***

### chatRefetch()

> **chatRefetch**: (`variables?`) => `Promise`\<`ApolloQueryResult`\<\{ `chat`: [`NewChatType`](../type-aliases/NewChatType.md); \}\>\>

Defined in: [src/types/Chat/interface.ts:104](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/Chat/interface.ts#L104)

#### Parameters

##### variables?

`Partial`\<\{ `after?`: `string`; `beforeMessages?`: `string`; `first?`: `number`; `input`: \{ `id`: `string`; \}; `lastMessages?`: `number`; \}\>

#### Returns

`Promise`\<`ApolloQueryResult`\<\{ `chat`: [`NewChatType`](../type-aliases/NewChatType.md); \}\>\>

***

### groupChatDetailsModalisOpen

> **groupChatDetailsModalisOpen**: `boolean`

Defined in: [src/types/Chat/interface.ts:102](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/Chat/interface.ts#L102)

***

### toggleGroupChatDetailsModal()

> **toggleGroupChatDetailsModal**: () => `void`

Defined in: [src/types/Chat/interface.ts:101](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/Chat/interface.ts#L101)

#### Returns

`void`
