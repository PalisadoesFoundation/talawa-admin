[Admin Docs](/)

***

# Function: handleCreateDirectChat()

> **handleCreateDirectChat**(`id`, `userName`, `chats`, `t`, `tCommon`, `createChat`, `createChatMembership`, `organizationId`, `userId`, `currentUserName`, `chatsListRefetch`, `toggleCreateDirectChatModal`): `Promise`\<`void`\>

Defined in: [src/components/UserPortal/CreateDirectChat/CreateDirectChat.tsx:77](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/CreateDirectChat/CreateDirectChat.tsx#L77)

Handles the logic for checking existing chats and creating a new direct chat if one doesn't exist.

## Parameters

### id

`string`

The ID of the user to chat with.

### userName

`string`

The name of the user to chat with.

### chats

[`NewChatType`](../../../../../types/UserPortal/Chat/interface/type-aliases/NewChatType.md)[]

Array of existing chats to check for duplicates.

### t

`TFunction`\<`"translation"`, `"userChat"`\>

i18n translation function.

### tCommon

`TFunction`\<`"common"`, `undefined`\>

### createChat

\{(`options?`): `Promise`\<`FetchResult`\<`unknown`\>\>; (`arg0`): `unknown`; \}

Mutation function to create a new chat.

### createChatMembership

\{(`options?`): `Promise`\<`FetchResult`\<`unknown`\>\>; (`arg0`): `unknown`; \}

Mutation function to add members to the chat.

### organizationId

`string`

The ID of the current organization.

### userId

`string`

### currentUserName

`string`

### chatsListRefetch

\{(`variables?`): `Promise`\<`ApolloQueryResult`\<`unknown`\>\>; (): `Promise`\<`ApolloQueryResult`\<`unknown`\>\>; \}

Function to refetch the list of chats.

### toggleCreateDirectChatModal

\{(): `void`; (): `void`; \}

Function to close the modal.

## Returns

`Promise`\<`void`\>
