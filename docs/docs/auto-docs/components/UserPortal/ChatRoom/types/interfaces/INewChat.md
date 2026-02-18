[Admin Docs](/)

***

# Interface: INewChat

Defined in: [src/components/UserPortal/ChatRoom/types.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/types.ts#L26)

Chat Types

This file defines TypeScript interfaces for the chat room functionality.
It includes type definitions for chat entities, members, messages, and pagination.

## Remarks

- INewChat: Main interface representing a chat entity.
- Supports both direct messages and group chats.
- Includes pagination information for messages.

## Example

```ts
const chat: INewChat = {
  id: 'chat123',
  name: 'Group Chat',
  isGroup: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  members: { edges: [...] },
  messages: { edges: [...], pageInfo: {...} }
};
```

## Properties

### avatarMimeType?

> `optional` **avatarMimeType**: `string`

Defined in: [src/components/UserPortal/ChatRoom/types.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/types.ts#L30)

***

### avatarURL?

> `optional` **avatarURL**: `string`

Defined in: [src/components/UserPortal/ChatRoom/types.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/types.ts#L31)

***

### createdAt

> **createdAt**: `string`

Defined in: [src/components/UserPortal/ChatRoom/types.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/types.ts#L33)

***

### creator?

> `optional` **creator**: `object`

Defined in: [src/components/UserPortal/ChatRoom/types.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/types.ts#L40)

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

Defined in: [src/components/UserPortal/ChatRoom/types.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/types.ts#L29)

***

### id

> **id**: `string`

Defined in: [src/components/UserPortal/ChatRoom/types.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/types.ts#L27)

***

### isGroup

> **isGroup**: `boolean`

Defined in: [src/components/UserPortal/ChatRoom/types.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/types.ts#L32)

***

### members

> **members**: `object`

Defined in: [src/components/UserPortal/ChatRoom/types.ts:52](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/types.ts#L52)

#### edges

> **edges**: `object`[]

***

### messages

> **messages**: `object`

Defined in: [src/components/UserPortal/ChatRoom/types.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/types.ts#L66)

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

Defined in: [src/components/UserPortal/ChatRoom/types.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/types.ts#L28)

***

### organization?

> `optional` **organization**: `object`

Defined in: [src/components/UserPortal/ChatRoom/types.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/types.ts#L35)

#### countryCode?

> `optional` **countryCode**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/components/UserPortal/ChatRoom/types.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/types.ts#L34)

***

### updater?

> `optional` **updater**: `object`

Defined in: [src/components/UserPortal/ChatRoom/types.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/UserPortal/ChatRoom/types.ts#L46)

#### avatarMimeType?

> `optional` **avatarMimeType**: `string`

#### avatarURL?

> `optional` **avatarURL**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`
