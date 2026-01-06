[Admin Docs](/)

***

# Interface: InterfaceChatMessagePg

Defined in: [src/utils/interfaces.ts:821](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L821)

InterfaceChatMessagePg
Defines the structure for a chat message with PostgreSQL-specific fields.

## Properties

### body

> **body**: `string`

Defined in: [src/utils/interfaces.ts:823](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L823)

The body content of the chat message.

***

### chat

> **chat**: [`InterfaceChatPg`](InterfaceChatPg.md)

Defined in: [src/utils/interfaces.ts:824](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L824)

The chat associated with this message.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:825](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L825)

The creation date of the chat message.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:826](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L826)

The user who created this message.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:822](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L822)

The unique identifier of the chat message.

***

### parentMessage

> **parentMessage**: `InterfaceChatMessagePg`

Defined in: [src/utils/interfaces.ts:827](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L827)

The parent message if this is a reply.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:828](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L828)

The last update date of the chat message.
