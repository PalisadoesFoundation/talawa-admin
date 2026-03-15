[Admin Docs](/)

***

# Variable: SEND\_MESSAGE\_MOCK

> `const` **SEND\_MESSAGE\_MOCK**: `object`

Defined in: [src/components/UserPortal/ChatRoom/ChatRoom.fixtures.ts:200](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/ChatRoom.fixtures.ts#L200)

## Type Declaration

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

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.createChatMessage

> **createChatMessage**: `object`

#### result.data.createChatMessage.\_\_typename

> **\_\_typename**: `string` = `'ChatMessage'`

#### result.data.createChatMessage.body

> **body**: `string` = `'Test message'`

#### result.data.createChatMessage.createdAt

> **createdAt**: `string` = `FIXED_UTC`

#### result.data.createChatMessage.creator

> **creator**: `object` = `CURRENT_USER`

#### result.data.createChatMessage.creator.\_\_typename

> **\_\_typename**: `string` = `'User'`

#### result.data.createChatMessage.creator.avatarMimeType

> **avatarMimeType**: `string` = `'image/jpeg'`

#### result.data.createChatMessage.creator.avatarURL

> **avatarURL**: `string` = `'https://example.com/user.jpg'`

#### result.data.createChatMessage.creator.id

> **id**: `string` = `'user123'`

#### result.data.createChatMessage.creator.name

> **name**: `string` = `'Current User'`

#### result.data.createChatMessage.id

> **id**: `string` = `'newMsg123'`

#### result.data.createChatMessage.parentMessage

> **parentMessage**: `any` = `null`

#### result.data.createChatMessage.updatedAt

> **updatedAt**: `string` = `FIXED_UTC`
