[**talawa-admin**](../../../../../README.md)

***

# Interface: InterfaceGroupChatDetailsProps

Defined in: [src/types/UserPortal/Chat/interface.ts:99](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/UserPortal/Chat/interface.ts#L99)

## Properties

### chat

> **chat**: [`Chat`](../type-aliases/Chat.md)

Defined in: [src/types/UserPortal/Chat/interface.ts:102](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/UserPortal/Chat/interface.ts#L102)

***

### chatRefetch()

> **chatRefetch**: (`variables?`) => `Promise`\<`ApolloQueryResult`\<\{ `chat`: [`Chat`](../type-aliases/Chat.md); \}\>\>

Defined in: [src/types/UserPortal/Chat/interface.ts:103](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/UserPortal/Chat/interface.ts#L103)

#### Parameters

##### variables?

`Partial`\<\{ `after?`: `string`; `beforeMessages?`: `string`; `first?`: `number`; `input`: \{ `id`: `string`; \}; `lastMessages?`: `number`; \}\>

#### Returns

`Promise`\<`ApolloQueryResult`\<\{ `chat`: [`Chat`](../type-aliases/Chat.md); \}\>\>

***

### groupChatDetailsModalisOpen

> **groupChatDetailsModalisOpen**: `boolean`

Defined in: [src/types/UserPortal/Chat/interface.ts:101](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/UserPortal/Chat/interface.ts#L101)

***

### toggleGroupChatDetailsModal()

> **toggleGroupChatDetailsModal**: () => `void`

Defined in: [src/types/UserPortal/Chat/interface.ts:100](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/types/UserPortal/Chat/interface.ts#L100)

#### Returns

`void`
