[Admin Docs](/)

***

# Variable: SEND\_MESSAGE\_ERROR\_MOCK

> `const` **SEND\_MESSAGE\_ERROR\_MOCK**: `object`

Defined in: [src/components/UserPortal/ChatRoom/ChatRoom.fixtures.ts:541](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/ChatRoom.fixtures.ts#L541)

## Type Declaration

### error

> **error**: `Error`

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `SEND_MESSAGE_TO_CHAT`

#### request.variables

> **variables**: `object`

#### request.variables.input

> **input**: `object`

#### request.variables.input.body

> **body**: `string` = `'Test message'`

#### request.variables.input.chatId

> **chatId**: `string` = `'chat123'`

#### request.variables.input.parentMessageId

> **parentMessageId**: `any` = `undefined`
