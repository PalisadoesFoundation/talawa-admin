[Admin Docs](/)

***

# Interface: InterfaceChatMessagePg

Defined in: [src/utils/interfaces.ts:825](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L825)

InterfaceChatMessagePg

## Description

Defines the structure for a chat message with PostgreSQL-specific fields.

## Properties

### body

> **body**: `string`

Defined in: [src/utils/interfaces.ts:827](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L827)

The body content of the chat message.

***

### chat

> **chat**: [`InterfaceChatPg`](utils\interfaces\README\interfaces\InterfaceChatPg.md)

Defined in: [src/utils/interfaces.ts:828](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L828)

The chat associated with this message.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:829](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L829)

The creation date of the chat message.

***

### creator

> **creator**: [`InterfaceUserPg`](utils\interfaces\README\interfaces\InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:830](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L830)

The user who created this message.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:826](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L826)

The unique identifier of the chat message.

***

### parentMessage

> **parentMessage**: `InterfaceChatMessagePg`

Defined in: [src/utils/interfaces.ts:831](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L831)

The parent message if this is a reply.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:832](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L832)

The last update date of the chat message.
