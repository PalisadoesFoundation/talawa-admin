[Admin Docs](/)

***

# Interface: InterfaceChatMessagePg

Defined in: [src/utils/interfaces.ts:802](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L802)

Defines the structure for a chat message with PostgreSQL-specific fields.

## Properties

### body

> **body**: `string`

Defined in: [src/utils/interfaces.ts:804](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L804)

The body content of the chat message.

***

### chat

> **chat**: [`InterfaceChatPg`](InterfaceChatPg.md)

Defined in: [src/utils/interfaces.ts:805](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L805)

The chat associated with this message.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:806](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L806)

The creation date of the chat message.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:807](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L807)

The user who created this message.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:803](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L803)

The unique identifier of the chat message.

***

### parentMessage

> **parentMessage**: `InterfaceChatMessagePg`

Defined in: [src/utils/interfaces.ts:808](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L808)

The parent message if this is a reply.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:809](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L809)

The last update date of the chat message.
