[Admin Docs](/)

***

# Variable: EDIT\_MESSAGE\_MOCK

> `const` **EDIT\_MESSAGE\_MOCK**: `object`

Defined in: [src/components/UserPortal/ChatRoom/ChatRoom.fixtures.ts:252](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/ChatRoom.fixtures.ts#L252)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `EDIT_CHAT_MESSAGE`

#### request.variables

> **variables**: `object`

#### request.variables.input

> **input**: `object`

#### request.variables.input.body

> **body**: `string` = `'Edited message'`

#### request.variables.input.id

> **id**: `string` = `'msg1'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.updateChatMessage

> **updateChatMessage**: `object`

#### result.data.updateChatMessage.\_\_typename

> **\_\_typename**: `string` = `'ChatMessage'`

#### result.data.updateChatMessage.body

> **body**: `string` = `'Edited message'`

#### result.data.updateChatMessage.createdAt

> **createdAt**: `string` = `FIXED_UTC`

#### result.data.updateChatMessage.creator

> **creator**: `object` = `CURRENT_USER`

#### result.data.updateChatMessage.creator.\_\_typename

> **\_\_typename**: `string` = `'User'`

#### result.data.updateChatMessage.creator.avatarMimeType

> **avatarMimeType**: `string` = `'image/jpeg'`

#### result.data.updateChatMessage.creator.avatarURL

> **avatarURL**: `string` = `'https://example.com/user.jpg'`

#### result.data.updateChatMessage.creator.id

> **id**: `string` = `'user123'`

#### result.data.updateChatMessage.creator.name

> **name**: `string` = `'Current User'`

#### result.data.updateChatMessage.id

> **id**: `string` = `'msg1'`

#### result.data.updateChatMessage.parentMessage

> **parentMessage**: `any` = `null`

#### result.data.updateChatMessage.updatedAt

> **updatedAt**: `string` = `FIXED_UTC`
