[Admin Docs](/)

***

# Variable: mockGroupChatData

> `const` **mockGroupChatData**: `object`

Defined in: [src/components/UserPortal/ChatRoom/ChatRoom.fixtures.ts:131](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/ChatRoom.fixtures.ts#L131)

## Type Declaration

### \_\_typename

> **\_\_typename**: `string` = `'Chat'`

### avatarMimeType

> **avatarMimeType**: `string` = `'image/jpeg'`

### avatarURL

> **avatarURL**: `string` = `'https://example.com/avatar.jpg'`

### createdAt

> **createdAt**: `string` = `FIXED_UTC`

### creator

> **creator**: `object`

#### creator.\_\_typename

> **\_\_typename**: `string` = `'User'`

#### creator.avatarMimeType

> **avatarMimeType**: `string` = `'image/jpeg'`

#### creator.avatarURL

> **avatarURL**: `string` = `'https://example.com/creator.jpg'`

#### creator.id

> **id**: `string` = `'creator123'`

#### creator.name

> **name**: `string` = `'Creator Name'`

### description

> **description**: `string` = `'Test Description'`

### id

> **id**: `string` = `'chat123'`

### isGroup

> **isGroup**: `boolean` = `true`

### members

> **members**: `object`

#### members.edges

> **edges**: (\{ `cursor`: `string`; `node`: \{ `__typename`: `string`; `role`: `string`; `user`: \{ `__typename`: `string`; `avatarMimeType`: `string`; `avatarURL`: `string`; `id`: `string`; `name`: `string`; \}; \}; \} \| \{ `cursor`: `string`; `node`: \{ `role`: `string`; `user`: \{ `avatarMimeType`: `string`; `avatarURL`: `string`; `id`: `string`; `name`: `string`; \}; \}; \})[]

### messages

> **messages**: `object`

#### messages.edges

> **edges**: `object`[]

#### messages.pageInfo

> **pageInfo**: `object`

#### messages.pageInfo.endCursor

> **endCursor**: `string` = `'end'`

#### messages.pageInfo.hasNextPage

> **hasNextPage**: `boolean` = `false`

#### messages.pageInfo.hasPreviousPage

> **hasPreviousPage**: `boolean` = `true`

#### messages.pageInfo.startCursor

> **startCursor**: `string` = `'start'`

### name

> **name**: `string` = `'Test Chat'`

### organization

> **organization**: `object`

#### organization.\_\_typename

> **\_\_typename**: `string` = `'Organization'`

#### organization.countryCode

> **countryCode**: `string` = `'US'`

#### organization.id

> **id**: `string` = `'org123'`

#### organization.name

> **name**: `string` = `'Test Org'`

### updatedAt

> **updatedAt**: `string` = `FIXED_UTC`

### updater

> **updater**: `object`

#### updater.\_\_typename

> **\_\_typename**: `string` = `'User'`

#### updater.avatarMimeType

> **avatarMimeType**: `string` = `'image/jpeg'`

#### updater.avatarURL

> **avatarURL**: `string` = `'https://example.com/updater.jpg'`

#### updater.id

> **id**: `string` = `'updater123'`

#### updater.name

> **name**: `string` = `'Updater Name'`
