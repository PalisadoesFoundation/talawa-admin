[Admin Docs](/)

***

# Interface: INewChat

Defined in: [src/components/UserPortal/ChatRoom/ChatRoomTypes.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/ChatRoomTypes.ts#L24)

Extended chat type for ChatRoom with additional pagination fields
Extends NewChatType with cursor and pageInfo fields required for infinite scroll

## Extends

- `Omit`\<[`NewChatType`](../../../../../types/Chat/interface/type-aliases/NewChatType.md), `"messages"`\>

## Properties

### avatarMimeType?

> `optional` **avatarMimeType**: `string`

Defined in: [src/types/Chat/interface.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/interface.ts#L7)

#### Inherited from

`Omit.avatarMimeType`

***

### avatarURL?

> `optional` **avatarURL**: `string`

Defined in: [src/types/Chat/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/interface.ts#L8)

#### Inherited from

`Omit.avatarURL`

***

### createdAt

> **createdAt**: `string`

Defined in: [src/types/Chat/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/interface.ts#L10)

#### Inherited from

`Omit.createdAt`

***

### creator?

> `optional` **creator**: `object`

Defined in: [src/types/Chat/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/interface.ts#L42)

#### avatarMimeType?

> `optional` **avatarMimeType**: `string`

#### avatarURL?

> `optional` **avatarURL**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

#### Inherited from

`Omit.creator`

***

### description?

> `optional` **description**: `string`

Defined in: [src/types/Chat/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/interface.ts#L6)

#### Inherited from

`Omit.description`

***

### firstUnreadMessageId?

> `optional` **firstUnreadMessageId**: `string`

Defined in: [src/types/Chat/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/interface.ts#L15)

#### Inherited from

`Omit.firstUnreadMessageId`

***

### hasUnread?

> `optional` **hasUnread**: `boolean`

Defined in: [src/types/Chat/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/interface.ts#L14)

#### Inherited from

`Omit.hasUnread`

***

### id

> **id**: `string`

Defined in: [src/types/Chat/interface.ts:4](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/interface.ts#L4)

#### Inherited from

`Omit.id`

***

### isGroup

> **isGroup**: `boolean`

Defined in: [src/types/Chat/interface.ts:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/interface.ts#L9)

#### Inherited from

`Omit.isGroup`

***

### lastMessage?

> `optional` **lastMessage**: `object`

Defined in: [src/types/Chat/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/interface.ts#L16)

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

> `optional` **updatedAt**: `string`

#### Inherited from

`Omit.lastMessage`

***

### members

> **members**: `object`

Defined in: [src/types/Chat/interface.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/interface.ts#L54)

#### edges

> **edges**: `object`[]

#### Inherited from

`Omit.members`

***

### messages

> **messages**: `object`

Defined in: [src/components/UserPortal/ChatRoom/ChatRoomTypes.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/ChatRoomTypes.ts#L25)

#### edges

> **edges**: `object`[]

#### pageInfo

> **pageInfo**: `object`

##### pageInfo.endCursor

> **endCursor**: `string`

##### pageInfo.hasNextPage

> **hasNextPage**: `boolean`

##### pageInfo.hasPreviousPage

> **hasPreviousPage**: `boolean`

##### pageInfo.startCursor

> **startCursor**: `string`

***

### name

> **name**: `string`

Defined in: [src/types/Chat/interface.ts:5](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/interface.ts#L5)

#### Inherited from

`Omit.name`

***

### organization?

> `optional` **organization**: `object`

Defined in: [src/types/Chat/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/interface.ts#L37)

#### countryCode?

> `optional` **countryCode**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

#### Inherited from

`Omit.organization`

***

### unreadMessagesCount?

> `optional` **unreadMessagesCount**: `number`

Defined in: [src/types/Chat/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/interface.ts#L13)

#### Inherited from

`Omit.unreadMessagesCount`

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/types/Chat/interface.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/interface.ts#L11)

#### Inherited from

`Omit.updatedAt`

***

### updater?

> `optional` **updater**: `object`

Defined in: [src/types/Chat/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Chat/interface.ts#L48)

#### avatarMimeType?

> `optional` **avatarMimeType**: `string`

#### avatarURL?

> `optional` **avatarURL**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

#### Inherited from

`Omit.updater`
