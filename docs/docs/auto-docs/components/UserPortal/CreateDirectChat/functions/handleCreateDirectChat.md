[**talawa-admin**](../../../../README.md)

***

# Function: handleCreateDirectChat()

> **handleCreateDirectChat**(`id`, `userName`, `chats`, `t`, `createChat`, `createChatMembership`, `organizationId`, `userId`, `currentUserName`, `chatsListRefetch`, `toggleCreateDirectChatModal`): `Promise`\<`void`\>

Defined in: [src/components/UserPortal/CreateDirectChat/CreateDirectChat.tsx:82](https://github.com/BittuBarnwal7479/talawa-admin/blob/7329c220ecd98ce2ec3fc0b9fc39dd1a39bb1df4/src/components/UserPortal/CreateDirectChat/CreateDirectChat.tsx#L82)

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
