[Admin Docs](/)

***

# Function: handleCreateDirectChat()

> **handleCreateDirectChat**(`id`, `userName`, `chats`, `t`, `createChat`, `createChatMembership`, `organizationId`, `userId`, `currentUserName`, `chatsListRefetch`, `toggleCreateDirectChatModal`): `Promise`\<`void`\>

Defined in: [src/components/UserPortal/CreateDirectChat/CreateDirectChat.tsx:95](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/CreateDirectChat/CreateDirectChat.tsx#L95)

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

\{(`options?`): `Promise`\<`FormattedExecutionResult`\<`unknown`, `Record`\<`string`, `any`\>\>\>; (`arg0`): `unknown`; \}

### createChatMembership

\{(`options?`): `Promise`\<`FormattedExecutionResult`\<`unknown`, `Record`\<`string`, `any`\>\>\>; (`arg0`): `unknown`; \}

### organizationId

`string`

### userId

`string`

### currentUserName

`string`

### chatsListRefetch

\{(`variables?`): `Promise`\<`Result`\<`unknown`, `"empty"` \| `"complete"` \| `"streaming"` \| `"partial"`\>\>; (): `Promise`\<`Result`\<`unknown`, `"empty"` \| `"complete"` \| `"streaming"` \| `"partial"`\>\>; \}

### toggleCreateDirectChatModal

\{(): `void`; (): `void`; \}

## Returns

`Promise`\<`void`\>
