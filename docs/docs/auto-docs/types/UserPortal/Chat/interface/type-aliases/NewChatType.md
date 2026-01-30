[Admin Docs](/)

***

# Type Alias: NewChatType

> **NewChatType** = `object`

Defined in: [src/types/UserPortal/Chat/interface.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L7)

Chat type aligned with GraphQL schema.
This is the canonical chat type - use this instead of the legacy GroupChat type.

## Properties

### avatarMimeType?

> `optional` **avatarMimeType**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L11)

***

### avatarURL?

> `optional` **avatarURL**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L12)

***

### createdAt

> **createdAt**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L14)

***

### creator?

> `optional` **creator**: `object`

Defined in: [src/types/UserPortal/Chat/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L46)

#### avatarMimeType?

> `optional` **avatarMimeType**: `string`

#### avatarURL?

> `optional` **avatarURL**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### description?

> `optional` **description**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L10)

***

### firstUnreadMessageId?

> `optional` **firstUnreadMessageId**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L19)

***

### hasUnread?

> `optional` **hasUnread**: `boolean`

Defined in: [src/types/UserPortal/Chat/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L18)

***

### id

> **id**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L8)

***

### isGroup?

> `optional` **isGroup**: `boolean`

Defined in: [src/types/UserPortal/Chat/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L13)

***

### lastMessage?

> `optional` **lastMessage**: `object`

Defined in: [src/types/UserPortal/Chat/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L20)

#### body

> **body**: `string`

#### createdAt

> **createdAt**: `string`

#### creator

> **creator**: `object`

##### creator.avatarMimeType?

> `optional` **avatarMimeType**: `string`

##### creator.avatarURL?

> `optional` **avatarURL**: `string`

##### creator.id

> **id**: `string`

##### creator.name

> **name**: `string`

#### id

> **id**: `string`

#### parentMessage?

> `optional` **parentMessage**: `object`

##### parentMessage.body

> **body**: `string`

##### parentMessage.createdAt

> **createdAt**: `string`

##### parentMessage.creator

> **creator**: `object`

##### parentMessage.creator.id

> **id**: `string`

##### parentMessage.creator.name

> **name**: `string`

##### parentMessage.id

> **id**: `string`

#### updatedAt?

> `optional` **updatedAt**: `string` \| `null`

***

### members?

> `optional` **members**: `object`

Defined in: [src/types/UserPortal/Chat/interface.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L58)

#### edges?

> `optional` **edges**: `object`[]

***

### messages

> **messages**: `object`

Defined in: [src/types/UserPortal/Chat/interface.ts:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L72)

#### edges

> **edges**: `object`[]

***

### name

> **name**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L9)

***

### organization?

> `optional` **organization**: `object`

Defined in: [src/types/UserPortal/Chat/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L41)

#### countryCode?

> `optional` **countryCode**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### unreadMessagesCount?

> `optional` **unreadMessagesCount**: `number`

Defined in: [src/types/UserPortal/Chat/interface.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L17)

***

### updatedAt

> **updatedAt**: `string` \| `null`

Defined in: [src/types/UserPortal/Chat/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L15)

***

### updater?

> `optional` **updater**: `object`

Defined in: [src/types/UserPortal/Chat/interface.ts:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L52)

#### avatarMimeType?

> `optional` **avatarMimeType**: `string`

#### avatarURL?

> `optional` **avatarURL**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`
