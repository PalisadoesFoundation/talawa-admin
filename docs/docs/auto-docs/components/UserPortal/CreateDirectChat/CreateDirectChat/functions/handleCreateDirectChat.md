[Admin Docs](/)

***

# Function: handleCreateDirectChat()

> **handleCreateDirectChat**(`id`, `userName`, `chats`, `t`, `createChat`, `createChatMembership`, `organizationId`, `userId`, `currentUserName`, `chatsListRefetch`, `toggleCreateDirectChatModal`): `Promise`\<`void`\>

Defined in: [src/components/UserPortal/CreateDirectChat/CreateDirectChat.tsx:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/CreateDirectChat/CreateDirectChat.tsx#L61)

## Parameters

### id

`string`

### userName

`string`

### chats

[`Chat`](../../../../../types/UserPortal/Chat/interface/type-aliases/Chat.md)[]

### t

`TFunction`\<`"translation"`, `"userChat"`\>

### createChat

[`CreateChatMutation`](../../../../../types/UserPortal/CreateDirectChat/interface/type-aliases/CreateChatMutation.md)

### createChatMembership

[`CreateChatMembershipMutation`](../../../../../types/UserPortal/CreateDirectChat/interface/type-aliases/CreateChatMembershipMutation.md)

### organizationId

`string`

### userId

`string`

### currentUserName

`string`

### chatsListRefetch

[`ChatsListRefetch`](../../../../../types/UserPortal/CreateDirectChat/interface/type-aliases/ChatsListRefetch.md)

### toggleCreateDirectChatModal

() => `void`

## Returns

`Promise`\<`void`\>
