[Admin Docs](/)

***

# Variable: CHAT\_BY\_ID\_AFTER\_SEND\_MOCK

> `const` **CHAT\_BY\_ID\_AFTER\_SEND\_MOCK**: `object`

Defined in: [src/components/UserPortal/ChatRoom/ChatRoom.fixtures.ts:419](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/ChatRoom.fixtures.ts#L419)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `CHAT_BY_ID`

#### request.variables

> **variables**: `object`

#### request.variables.beforeMessages

> **beforeMessages**: `any` = `null`

#### request.variables.first

> **first**: `number` = `15`

#### request.variables.input

> **input**: `object`

#### request.variables.input.id

> **id**: `string` = `'chat123'`

#### request.variables.lastMessages

> **lastMessages**: `number` = `15`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.chat

> **chat**: `object`

#### result.data.chat.\_\_typename

> **\_\_typename**: `string` = `'Chat'`

#### result.data.chat.avatarMimeType

> **avatarMimeType**: `string` = `'image/jpeg'`

#### result.data.chat.avatarURL

> **avatarURL**: `string` = `'https://example.com/avatar.jpg'`

#### result.data.chat.createdAt

> **createdAt**: `string` = `FIXED_UTC`

#### result.data.chat.creator

> **creator**: `object`

#### result.data.chat.creator.\_\_typename

> **\_\_typename**: `string` = `'User'`

#### result.data.chat.creator.avatarMimeType

> **avatarMimeType**: `string` = `'image/jpeg'`

#### result.data.chat.creator.avatarURL

> **avatarURL**: `string` = `'https://example.com/creator.jpg'`

#### result.data.chat.creator.id

> **id**: `string` = `'creator123'`

#### result.data.chat.creator.name

> **name**: `string` = `'Creator Name'`

#### result.data.chat.description

> **description**: `string` = `'Test Description'`

#### result.data.chat.id

> **id**: `string` = `'chat123'`

#### result.data.chat.isGroup

> **isGroup**: `boolean` = `false`

#### result.data.chat.members

> **members**: `object`

#### result.data.chat.members.edges

> **edges**: `object`[]

#### result.data.chat.messages

> **messages**: `object`

#### result.data.chat.messages.edges

> **edges**: (\{ `cursor`: `string`; `node`: \{ `__typename`: `string`; `body`: `string`; `createdAt`: `string`; `creator`: \{ `__typename`: `string`; `avatarMimeType`: `string`; `avatarURL`: `string`; `id`: `string`; `name`: `string`; \}; `id`: `string`; `parentMessage`: `any`; `updatedAt`: `string`; \}; \} \| \{ `cursor`: `string`; `node`: \{ `body`: `string`; `createdAt`: `string`; `creator`: \{ `__typename`: `string`; `avatarMimeType`: `string`; `avatarURL`: `string`; `id`: `string`; `name`: `string`; \}; `id`: `string`; `parentMessage`: `any`; `updatedAt`: `string`; \}; \})[]

#### result.data.chat.messages.pageInfo

> **pageInfo**: `object`

#### result.data.chat.messages.pageInfo.endCursor

> **endCursor**: `string` = `'end'`

#### result.data.chat.messages.pageInfo.hasNextPage

> **hasNextPage**: `boolean` = `false`

#### result.data.chat.messages.pageInfo.hasPreviousPage

> **hasPreviousPage**: `boolean` = `true`

#### result.data.chat.messages.pageInfo.startCursor

> **startCursor**: `string` = `'start'`

#### result.data.chat.name

> **name**: `string` = `'Test Chat'`

#### result.data.chat.organization

> **organization**: `object`

#### result.data.chat.organization.\_\_typename

> **\_\_typename**: `string` = `'Organization'`

#### result.data.chat.organization.countryCode

> **countryCode**: `string` = `'US'`

#### result.data.chat.organization.id

> **id**: `string` = `'org123'`

#### result.data.chat.organization.name

> **name**: `string` = `'Test Org'`

#### result.data.chat.updatedAt

> **updatedAt**: `string` = `FIXED_UTC`

#### result.data.chat.updater

> **updater**: `object`

#### result.data.chat.updater.\_\_typename

> **\_\_typename**: `string` = `'User'`

#### result.data.chat.updater.avatarMimeType

> **avatarMimeType**: `string` = `'image/jpeg'`

#### result.data.chat.updater.avatarURL

> **avatarURL**: `string` = `'https://example.com/updater.jpg'`

#### result.data.chat.updater.id

> **id**: `string` = `'updater123'`

#### result.data.chat.updater.name

> **name**: `string` = `'Updater Name'`
