[**talawa-admin**](../../../../README.md)

***

# Function: handleCreateDirectChat()

> **handleCreateDirectChat**(`id`, `userName`, `chats`, `t`, `createChat`, `createChatMembership`, `organizationId`, `userId`, `currentUserName`, `chatsListRefetch`, `toggleCreateDirectChatModal`): `Promise`\<`void`\>

Defined in: [src/components/UserPortal/CreateDirectChat/CreateDirectChat.tsx:98](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/components/UserPortal/CreateDirectChat/CreateDirectChat.tsx#L98)

## Parameters

### id

`string`

### userName

`string`

### chats

[`GroupChat`](../../../../types/Chat/type/type-aliases/GroupChat.md)[]

### t

`TFunction`\<`"translation"`, `"userChat"`\>

### createChat

\{(`options?`): `Promise`\<`FetchResult`\<`unknown`\>\>; (`arg0`): `unknown`; \}

### createChatMembership

\{(`options?`): `Promise`\<`FetchResult`\<`unknown`\>\>; (`arg0`): `unknown`; \}

### organizationId

`string`

### userId

`string`

### currentUserName

`string`

### chatsListRefetch

\{(`variables?`): `Promise`\<`ApolloQueryResult`\<`unknown`\>\>; (): `Promise`\<`ApolloQueryResult`\<`unknown`\>\>; \}

### toggleCreateDirectChatModal

\{(): `void`; (): `void`; \}

## Returns

`Promise`\<`void`\>
