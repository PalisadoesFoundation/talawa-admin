[Admin Docs](/)

***

# Interface: InterfaceHandleCreateDirectChatParams

Defined in: src/types/UserPortal/CreateDirectChat/interface.ts:28

Parameters for creating a direct chat with another user.
Encapsulates user info, chat data, mutation functions, and UI handlers.

## Properties

### chats

> **chats**: [`NewChatType`](../../../Chat/interface/type-aliases/NewChatType.md)[]

Defined in: src/types/UserPortal/CreateDirectChat/interface.ts:31

***

### chatsListRefetch()

> **chatsListRefetch**: (`variables?`) => `Promise`\<`ApolloQueryResult`\<`unknown`\>\>

Defined in: src/types/UserPortal/CreateDirectChat/interface.ts:57

#### Parameters

##### variables?

`Partial`\<\{ `id`: `string`; \}\>

#### Returns

`Promise`\<`ApolloQueryResult`\<`unknown`\>\>

***

### createChat()

> **createChat**: (`options?`) => `Promise`\<`FetchResult`\<`unknown`\>\>

Defined in: src/types/UserPortal/CreateDirectChat/interface.ts:34

#### Parameters

##### options?

`MutationFunctionOptions`\<`unknown`, `OperationVariables`, `DefaultContext`, `ApolloCache`\<`unknown`\>\>

#### Returns

`Promise`\<`FetchResult`\<`unknown`\>\>

***

### createChatMembership()

> **createChatMembership**: (`options?`) => `Promise`\<`FetchResult`\<`unknown`\>\>

Defined in: src/types/UserPortal/CreateDirectChat/interface.ts:44

#### Parameters

##### options?

`MutationFunctionOptions`\<`unknown`, `OperationVariables`, `DefaultContext`, `ApolloCache`\<`unknown`\>\>

#### Returns

`Promise`\<`FetchResult`\<`unknown`\>\>

***

### currentUserName

> **currentUserName**: `string`

Defined in: src/types/UserPortal/CreateDirectChat/interface.ts:56

***

### id

> **id**: `string`

Defined in: src/types/UserPortal/CreateDirectChat/interface.ts:29

***

### organizationId

> **organizationId**: `string`

Defined in: src/types/UserPortal/CreateDirectChat/interface.ts:54

***

### t

> **t**: `TFunction`\<`"translation"`, `"userChat"`\>

Defined in: src/types/UserPortal/CreateDirectChat/interface.ts:32

***

### tCommon

> **tCommon**: `TFunction`\<`"common"`, `undefined`\>

Defined in: src/types/UserPortal/CreateDirectChat/interface.ts:33

***

### toggleCreateDirectChatModal()

> **toggleCreateDirectChatModal**: () => `void`

Defined in: src/types/UserPortal/CreateDirectChat/interface.ts:60

#### Returns

`void`

***

### userId

> **userId**: `string`

Defined in: src/types/UserPortal/CreateDirectChat/interface.ts:55

***

### userName

> **userName**: `string`

Defined in: src/types/UserPortal/CreateDirectChat/interface.ts:30
