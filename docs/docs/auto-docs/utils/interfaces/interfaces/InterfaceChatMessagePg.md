[Admin Docs](/)

***

# Interface: InterfaceChatMessagePg

Defined in: [src/utils/interfaces.ts:912](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L912)

InterfaceChatMessagePg

## Description

Defines the structure for a chat message with PostgreSQL-specific fields.

## Properties

### body

> **body**: `string`

Defined in: [src/utils/interfaces.ts:914](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L914)

The body content of the chat message.

***

### chat

> **chat**: [`InterfaceChatPg`](InterfaceChatPg.md)

Defined in: [src/utils/interfaces.ts:915](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L915)

The chat associated with this message.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:916](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L916)

The creation date of the chat message.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:917](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L917)

The user who created this message.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:913](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L913)

The unique identifier of the chat message.

***

### parentMessage

> **parentMessage**: `InterfaceChatMessagePg`

Defined in: [src/utils/interfaces.ts:918](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L918)

The parent message if this is a reply.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:919](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L919)

The last update date of the chat message.
