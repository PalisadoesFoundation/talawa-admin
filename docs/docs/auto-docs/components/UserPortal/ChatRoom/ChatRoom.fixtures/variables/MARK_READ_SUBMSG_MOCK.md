[Admin Docs](/)

***

# Variable: MARK\_READ\_SUBMSG\_MOCK

> `const` **MARK\_READ\_SUBMSG\_MOCK**: `object`

Defined in: [src/components/UserPortal/ChatRoom/ChatRoom.fixtures.ts:332](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/ChatRoom.fixtures.ts#L332)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `MARK_CHAT_MESSAGES_AS_READ`

#### request.variables

> **variables**: `object`

#### request.variables.input

> **input**: `object`

#### request.variables.input.chatId

> **chatId**: `string` = `'chat123'`

#### request.variables.input.messageId

> **messageId**: `string` = `'subMsg123'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.markChatAsRead

> **markChatAsRead**: `boolean` = `true`
