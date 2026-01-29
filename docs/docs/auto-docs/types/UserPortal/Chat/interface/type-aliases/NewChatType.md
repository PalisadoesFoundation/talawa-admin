[Admin Docs](/)

***

# Type Alias: NewChatType

> **NewChatType** = `object`

Defined in: [src/types/UserPortal/Chat/interface.ts:3](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L3)

## Properties

### avatarMimeType?

> `optional` **avatarMimeType**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L7)

***

### avatarURL?

> `optional` **avatarURL**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L8)

***

### createdAt

> **createdAt**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L10)

***

### creator?

> `optional` **creator**: `object`

Defined in: [src/types/UserPortal/Chat/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L42)

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

Defined in: [src/types/UserPortal/Chat/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L6)

***

### firstUnreadMessageId?

> `optional` **firstUnreadMessageId**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L15)

***

### hasUnread?

> `optional` **hasUnread**: `boolean`

Defined in: [src/types/UserPortal/Chat/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L14)

***

### id

> **id**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:4](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L4)

***

### isGroup

> **isGroup**: `boolean`

Defined in: [src/types/UserPortal/Chat/interface.ts:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L9)

***

### lastMessage?

> `optional` **lastMessage**: `object`

Defined in: [src/types/UserPortal/Chat/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L16)

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

### members

> **members**: `object`

Defined in: [src/types/UserPortal/Chat/interface.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L54)

#### edges

> **edges**: `object`[]

***

### messages

> **messages**: `object`

Defined in: [src/types/UserPortal/Chat/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L68)

#### edges

> **edges**: `object`[]

***

### name

> **name**: `string`

Defined in: [src/types/UserPortal/Chat/interface.ts:5](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L5)

***

### organization?

> `optional` **organization**: `object`

Defined in: [src/types/UserPortal/Chat/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L37)

#### countryCode?

> `optional` **countryCode**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### unreadMessagesCount?

> `optional` **unreadMessagesCount**: `number`

Defined in: [src/types/UserPortal/Chat/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L13)

***

### updatedAt

> **updatedAt**: `string` \| `null`

Defined in: [src/types/UserPortal/Chat/interface.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L11)

***

### updater?

> `optional` **updater**: `object`

Defined in: [src/types/UserPortal/Chat/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/Chat/interface.ts#L48)

#### avatarMimeType?

> `optional` **avatarMimeType**: `string`

#### avatarURL?

> `optional` **avatarURL**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`
