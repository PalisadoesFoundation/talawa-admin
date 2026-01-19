[Admin Docs](/)

***

# Interface: InterfaceChatMessagePg

Defined in: [src/utils/interfaces.ts:834](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L834)

InterfaceChatMessagePg

## Description

Defines the structure for a chat message with PostgreSQL-specific fields.

## Properties

### body

> **body**: `string`

Defined in: [src/utils/interfaces.ts:836](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L836)

The body content of the chat message.

***

### chat

> **chat**: [`InterfaceChatPg`](InterfaceChatPg.md)

Defined in: [src/utils/interfaces.ts:837](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L837)

The chat associated with this message.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:838](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L838)

The creation date of the chat message.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:839](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L839)

The user who created this message.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:835](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L835)

The unique identifier of the chat message.

***

### parentMessage

> **parentMessage**: `InterfaceChatMessagePg`

Defined in: [src/utils/interfaces.ts:840](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L840)

The parent message if this is a reply.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:841](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L841)

The last update date of the chat message.
