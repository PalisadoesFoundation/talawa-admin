[Admin Docs](/)

***

# Interface: InterfaceHandleCreateDirectChatParams

Defined in: [src/types/UserPortal/Chat/interface.ts:166](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L166)

Parameters for creating a direct chat with another user.
Encapsulates user info, chat data, mutation functions, and UI handlers.

## Properties

### chats

> **chats**: [`NewChatType`](../type-aliases/NewChatType.md)[]

Defined in: [src/types/UserPortal/Chat/interface.ts:169](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L169)

***

### chatsListRefetch()

> **chatsListRefetch**: (`variables?`) => `Promise`\<`ApolloQueryResult`\<`unknown`\>\>

Defined in: [src/types/UserPortal/Chat/interface.ts:195](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L195)

#### Parameters

##### variables?

`Partial`\<\{ `id`: `string`; \}\>

#### Returns

`Promise`\<`ApolloQueryResult`\<`unknown`\>\>

***

### createChat()

> **createChat**: (`options?`) => `Promise`\<`FetchResult`\<`unknown`\>\>

Defined in: [src/types/UserPortal/Chat/interface.ts:172](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L172)

#### Parameters

##### options?

`MutationFunctionOptions`\<`unknown`, `OperationVariables`, `DefaultContext`, `ApolloCache`\<`unknown`\>\>

#### Returns

`Promise`\<`FetchResult`\<`unknown`\>\>

***

### createChatMembership()

> **createChatMembership**: (`options?`) => `Promise`\<`FetchResult`\<`unknown`\>\>

Defined in: [src/types/UserPortal/Chat/interface.ts:182](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L182)

#### Parameters

##### options?

`MutationFunctionOptions`\<`unknown`, `OperationVariables`, `DefaultContext`, `ApolloCache`\<`unknown`\>\>

#### Returns

`Promise`\<`FetchResult`\<`unknown`\>\>

***

### currentUserName

> **currentUserName**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:194](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L194)

***

### id

> **id**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:167](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L167)

***

### organizationId

> **organizationId**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:192](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L192)

***

### t

> **t**: `TFunction`\<`"translation"`, `"userChat"`\>

Defined in: [src/types/UserPortal/Chat/interface.ts:170](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L170)

***

### tCommon

> **tCommon**: `TFunction`\<`"common"`, `undefined`\>

Defined in: [src/types/UserPortal/Chat/interface.ts:171](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L171)

***

### toggleCreateDirectChatModal()

> **toggleCreateDirectChatModal**: () => `void`

Defined in: [src/types/UserPortal/Chat/interface.ts:198](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L198)

#### Returns

`void`

***

### userId

> **userId**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:193](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L193)

***

### userName

> **userName**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:168](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L168)
