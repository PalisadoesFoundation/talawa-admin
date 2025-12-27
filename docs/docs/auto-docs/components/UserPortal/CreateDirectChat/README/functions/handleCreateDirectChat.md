[**talawa-admin**](README.md)

***

# Function: handleCreateDirectChat()

> **handleCreateDirectChat**(`id`, `userName`, `chats`, `t`, `createChat`, `createChatMembership`, `organizationId`, `userId`, `currentUserName`, `chatsListRefetch`, `toggleCreateDirectChatModal`): `Promise`\<`void`\>

Defined in: [src/components/UserPortal/CreateDirectChat/CreateDirectChat.tsx:81](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/components/UserPortal/CreateDirectChat/CreateDirectChat.tsx#L81)

## Parameters

### id

`string`

### userName

`string`

### chats

[`GroupChat`](types\Chat\type\README\type-aliases\GroupChat.md)[]

### t

`TFunction`\<`"translation"`, `"userChat"`\>

### createChat

(`options`?) => `Promise`\<`FetchResult`\<`unknown`\>\>(`arg0`) => `unknown`

### createChatMembership

(`options`?) => `Promise`\<`FetchResult`\<`unknown`\>\>(`arg0`) => `unknown`

### organizationId

`string`

### userId

`string`

### currentUserName

`string`

### chatsListRefetch

(`variables`?) => `Promise`\<`ApolloQueryResult`\<`unknown`\>\>() => `Promise`\<`ApolloQueryResult`\<`unknown`\>\>

### toggleCreateDirectChatModal

() => `void`() => `void`

## Returns

`Promise`\<`void`\>
