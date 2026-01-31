[Admin Docs](/)

***

# Interface: InterfaceHandleCreateDirectChatParams

Defined in: [src/types/UserPortal/Chat/interface.ts:162](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L162)

## Properties

### chats

> **chats**: [`NewChatType`](../type-aliases/NewChatType.md)[]

Defined in: [src/types/UserPortal/Chat/interface.ts:165](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L165)

***

### chatsListRefetch()

> **chatsListRefetch**: (`variables?`) => `Promise`\<`ApolloQueryResult`\<`unknown`\>\>

Defined in: [src/types/UserPortal/Chat/interface.ts:191](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L191)

#### Parameters

##### variables?

`Partial`\<\{ `id`: `string`; \}\>

#### Returns

`Promise`\<`ApolloQueryResult`\<`unknown`\>\>

***

### createChat()

> **createChat**: (`options?`) => `Promise`\<`FetchResult`\<`unknown`\>\>

Defined in: [src/types/UserPortal/Chat/interface.ts:168](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L168)

#### Parameters

##### options?

`MutationFunctionOptions`\<`unknown`, `OperationVariables`, `DefaultContext`, `ApolloCache`\<`unknown`\>\>

#### Returns

`Promise`\<`FetchResult`\<`unknown`\>\>

***

### createChatMembership()

> **createChatMembership**: (`options?`) => `Promise`\<`FetchResult`\<`unknown`\>\>

Defined in: [src/types/UserPortal/Chat/interface.ts:178](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L178)

#### Parameters

##### options?

`MutationFunctionOptions`\<`unknown`, `OperationVariables`, `DefaultContext`, `ApolloCache`\<`unknown`\>\>

#### Returns

`Promise`\<`FetchResult`\<`unknown`\>\>

***

### currentUserName

> **currentUserName**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:190](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L190)

***

### id

> **id**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:163](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L163)

***

### organizationId

> **organizationId**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:188](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L188)

***

### t

> **t**: `TFunction`\<`"translation"`, `"userChat"`\>

Defined in: [src/types/UserPortal/Chat/interface.ts:166](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L166)

***

### tCommon

> **tCommon**: `TFunction`\<`"common"`, `undefined`\>

Defined in: [src/types/UserPortal/Chat/interface.ts:167](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L167)

***

### toggleCreateDirectChatModal()

> **toggleCreateDirectChatModal**: () => `void`

Defined in: [src/types/UserPortal/Chat/interface.ts:194](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L194)

#### Returns

`void`

***

### userId

> **userId**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:189](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L189)

***

### userName

> **userName**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:164](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L164)
