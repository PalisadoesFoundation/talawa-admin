[Admin Docs](/)

---

# Interface: InterfaceChatMessagePg

Defined in: [src/utils/interfaces.ts:831](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L831)

InterfaceChatMessagePg

## Description

Defines the structure for a chat message with PostgreSQL-specific fields.

## Properties

### body

> **body**: `string`

Defined in: [src/utils/interfaces.ts:833](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L833)

The body content of the chat message.

---

### chat

> **chat**: [`InterfaceChatPg`](InterfaceChatPg.md)

Defined in: [src/utils/interfaces.ts:834](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L834)

The chat associated with this message.

---

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:835](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L835)

The creation date of the chat message.

---

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:836](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L836)

The user who created this message.

---

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:832](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L832)

The unique identifier of the chat message.

---

### parentMessage

> **parentMessage**: `InterfaceChatMessagePg`

Defined in: [src/utils/interfaces.ts:837](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L837)

The parent message if this is a reply.

---

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:838](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L838)

The last update date of the chat message.
