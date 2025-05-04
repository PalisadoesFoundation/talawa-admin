[Admin Docs](/)

***

# Function: handleCreateDirectChat()

> **handleCreateDirectChat**(`id`, `chats`, `t`, `createChat`, `organizationId`, `userId`, `chatsListRefetch`, `toggleCreateDirectChatModal`): `Promise`\<`void`\>

Defined in: [src/components/UserPortal/CreateDirectChat/CreateDirectChat.tsx:89](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/CreateDirectChat/CreateDirectChat.tsx#L89)

## Parameters

### id

`string`

### chats

[`GroupChat`](../../../../types/Chat/type/type-aliases/GroupChat.md)[]

### t

`TFunction`\<`"translation"`, `"userChat"`\>

### createChat

(`options`?) => `Promise`\<`FetchResult`\<`unknown`\>\>(`arg0`) => `unknown`

### organizationId

`string`

### userId

`string`

### chatsListRefetch

(`variables`?) => `Promise`\<`ApolloQueryResult`\<`unknown`\>\>() => `Promise`\<`ApolloQueryResult`\<`unknown`\>\>

### toggleCreateDirectChatModal

() => `void`() => `void`

## Returns

`Promise`\<`void`\>
