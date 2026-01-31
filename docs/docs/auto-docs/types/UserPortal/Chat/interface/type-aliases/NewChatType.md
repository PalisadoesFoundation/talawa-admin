[Admin Docs](/)

***

# Type Alias: NewChatType

> **NewChatType** = `object`

Defined in: [src/types/UserPortal/Chat/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L15)

Chat type aligned with GraphQL schema.
This is the canonical chat type - use this instead of the legacy GroupChat type.

## Properties

### avatarMimeType?

> `optional` **avatarMimeType**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L19)

***

### avatarURL?

> `optional` **avatarURL**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L20)

***

### createdAt

> **createdAt**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L22)

***

### creator?

> `optional` **creator**: `object`

Defined in: [src/types/UserPortal/Chat/interface.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L54)

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

Defined in: [src/types/UserPortal/Chat/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L18)

***

### firstUnreadMessageId?

> `optional` **firstUnreadMessageId**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L27)

***

### hasUnread?

> `optional` **hasUnread**: `boolean`

Defined in: [src/types/UserPortal/Chat/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L26)

***

### id

> **id**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L16)

***

### isGroup?

> `optional` **isGroup**: `boolean`

Defined in: [src/types/UserPortal/Chat/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L21)

***

### lastMessage?

> `optional` **lastMessage**: `object`

Defined in: [src/types/UserPortal/Chat/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L28)

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

Defined in: [src/types/UserPortal/Chat/interface.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L66)

#### edges?

> `optional` **edges**: `object`[]

***

### messages

> **messages**: `object`

Defined in: [src/types/UserPortal/Chat/interface.ts:80](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L80)

#### edges

> **edges**: `object`[]

***

### name

> **name**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L17)

***

### organization?

> `optional` **organization**: `object`

Defined in: [src/types/UserPortal/Chat/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L49)

#### countryCode?

> `optional` **countryCode**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### unreadMessagesCount?

> `optional` **unreadMessagesCount**: `number`

Defined in: [src/types/UserPortal/Chat/interface.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L25)

***

### updatedAt

> **updatedAt**: `string` \| `null`

Defined in: [src/types/UserPortal/Chat/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L23)

***

### updater?

> `optional` **updater**: `object`

Defined in: [src/types/UserPortal/Chat/interface.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L60)

#### avatarMimeType?

> `optional` **avatarMimeType**: `string`

#### avatarURL?

> `optional` **avatarURL**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`
