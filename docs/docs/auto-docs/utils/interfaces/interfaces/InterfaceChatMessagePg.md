[Admin Docs](/)

***

# Interface: InterfaceChatMessagePg

Defined in: [src/utils/interfaces.ts:857](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L857)

InterfaceChatMessagePg

## Description

Defines the structure for a chat message with PostgreSQL-specific fields.

## Properties

### body

> **body**: `string`

Defined in: [src/utils/interfaces.ts:859](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L859)

The body content of the chat message.

***

### chat

> **chat**: [`InterfaceChatPg`](InterfaceChatPg.md)

Defined in: [src/utils/interfaces.ts:860](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L860)

The chat associated with this message.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:861](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L861)

The creation date of the chat message.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:862](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L862)

The user who created this message.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:858](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L858)

The unique identifier of the chat message.

***

### parentMessage

> **parentMessage**: `InterfaceChatMessagePg`

Defined in: [src/utils/interfaces.ts:863](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L863)

The parent message if this is a reply.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:864](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L864)

The last update date of the chat message.
