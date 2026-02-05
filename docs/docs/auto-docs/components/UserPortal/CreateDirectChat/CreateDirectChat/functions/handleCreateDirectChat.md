[Admin Docs](/)

***

# Function: handleCreateDirectChat()

> **handleCreateDirectChat**(`id`, `userName`, `chats`, `t`, `createChat`, `createChatMembership`, `organizationId`, `userId`, `currentUserName`, `chatsListRefetch`, `toggleCreateDirectChatModal`): `Promise`\<`void`\>

Defined in: [src/components/UserPortal/CreateDirectChat/CreateDirectChat.tsx:75](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/CreateDirectChat/CreateDirectChat.tsx#L75)

## Parameters

### id

`string`

### userName

`string`

### chats

[`GroupChat`](../../../../../types/UserPortal/Chat/type/type-aliases/GroupChat.md)[]

### t

`TFunction`\<`"translation"`, `"userChat"`\>

### createChat

`any`

### createChatMembership

`any`

### organizationId

`string`

### userId

`string`

### currentUserName

`string`

### chatsListRefetch

\{(`variables?`): `Promise`\<`unknown`\>; (): `Promise`\<`unknown`\>; \}

### toggleCreateDirectChatModal

\{(): `void`; (): `void`; \}

## Returns

`Promise`\<`void`\>
