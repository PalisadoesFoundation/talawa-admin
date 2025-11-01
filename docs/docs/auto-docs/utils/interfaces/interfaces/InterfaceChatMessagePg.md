[**talawa-admin**](../../../README.md)

***

# Interface: InterfaceChatMessagePg

Defined in: [src/utils/interfaces.ts:828](https://github.com/iamanishx/talawa-admin/blob/7201593995ccfacf6f05849e614f59bf2c15323f/src/utils/interfaces.ts#L828)

InterfaceChatMessagePg

## Description

Defines the structure for a chat message with PostgreSQL-specific fields.

## Properties

### body

> **body**: `string`

Defined in: [src/utils/interfaces.ts:830](https://github.com/iamanishx/talawa-admin/blob/7201593995ccfacf6f05849e614f59bf2c15323f/src/utils/interfaces.ts#L830)

The body content of the chat message.

***

### chat

> **chat**: [`InterfaceChatPg`](InterfaceChatPg.md)

Defined in: [src/utils/interfaces.ts:831](https://github.com/iamanishx/talawa-admin/blob/7201593995ccfacf6f05849e614f59bf2c15323f/src/utils/interfaces.ts#L831)

The chat associated with this message.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:832](https://github.com/iamanishx/talawa-admin/blob/7201593995ccfacf6f05849e614f59bf2c15323f/src/utils/interfaces.ts#L832)

The creation date of the chat message.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:833](https://github.com/iamanishx/talawa-admin/blob/7201593995ccfacf6f05849e614f59bf2c15323f/src/utils/interfaces.ts#L833)

The user who created this message.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:829](https://github.com/iamanishx/talawa-admin/blob/7201593995ccfacf6f05849e614f59bf2c15323f/src/utils/interfaces.ts#L829)

The unique identifier of the chat message.

***

### parentMessage

> **parentMessage**: `InterfaceChatMessagePg`

Defined in: [src/utils/interfaces.ts:834](https://github.com/iamanishx/talawa-admin/blob/7201593995ccfacf6f05849e614f59bf2c15323f/src/utils/interfaces.ts#L834)

The parent message if this is a reply.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:835](https://github.com/iamanishx/talawa-admin/blob/7201593995ccfacf6f05849e614f59bf2c15323f/src/utils/interfaces.ts#L835)

The last update date of the chat message.
