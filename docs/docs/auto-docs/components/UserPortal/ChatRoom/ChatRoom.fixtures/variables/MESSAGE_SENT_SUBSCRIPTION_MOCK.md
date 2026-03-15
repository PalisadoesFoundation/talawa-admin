[Admin Docs](/)

***

# Variable: MESSAGE\_SENT\_SUBSCRIPTION\_MOCK

> `const` **MESSAGE\_SENT\_SUBSCRIPTION\_MOCK**: `object`

Defined in: [src/components/UserPortal/ChatRoom/ChatRoom.fixtures.ts:349](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/ChatRoom.fixtures.ts#L349)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `MESSAGE_SENT_TO_CHAT`

#### request.variables

> **variables**: `object`

#### request.variables.input

> **input**: `object`

#### request.variables.input.id

> **id**: `string` = `'chat123'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.chatMessageCreate

> **chatMessageCreate**: `object`

#### result.data.chatMessageCreate.\_\_typename

> **\_\_typename**: `string` = `'ChatMessage'`

#### result.data.chatMessageCreate.body

> **body**: `string` = `'New message from subscription'`

#### result.data.chatMessageCreate.chat

> **chat**: `object`

#### result.data.chatMessageCreate.chat.\_\_typename

> **\_\_typename**: `string` = `'Chat'`

#### result.data.chatMessageCreate.chat.id

> **id**: `string` = `'chat123'`

#### result.data.chatMessageCreate.createdAt

> **createdAt**: `string` = `FIXED_UTC`

#### result.data.chatMessageCreate.creator

> **creator**: `object` = `OTHER_USER`

#### result.data.chatMessageCreate.creator.\_\_typename

> **\_\_typename**: `string` = `'User'`

#### result.data.chatMessageCreate.creator.avatarMimeType

> **avatarMimeType**: `string` = `'image/jpeg'`

#### result.data.chatMessageCreate.creator.avatarURL

> **avatarURL**: `string` = `'https://example.com/other.jpg'`

#### result.data.chatMessageCreate.creator.id

> **id**: `string` = `'otherUser123'`

#### result.data.chatMessageCreate.creator.name

> **name**: `string` = `'Other User'`

#### result.data.chatMessageCreate.id

> **id**: `string` = `'subMsg123'`

#### result.data.chatMessageCreate.parentMessage

> **parentMessage**: `any` = `null`

#### result.data.chatMessageCreate.updatedAt

> **updatedAt**: `string` = `FIXED_UTC`
