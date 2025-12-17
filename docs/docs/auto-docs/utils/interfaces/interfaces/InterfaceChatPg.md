[Admin Docs](/)

***

# Interface: InterfaceChatPg

Defined in: src/utils/interfaces.ts:807

InterfaceChatPg

## Description

Defines the structure for a chat with PostgreSQL-specific fields.

## Properties

### avatarMimeType

> **avatarMimeType**: `string`

Defined in: src/utils/interfaces.ts:811

The MIME type of the chat's avatar.

***

### avatarURL

> **avatarURL**: `string`

Defined in: src/utils/interfaces.ts:812

The URL of the chat's avatar.

***

### createdAt

> **createdAt**: `string`

Defined in: src/utils/interfaces.ts:813

The creation date of the chat record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: src/utils/interfaces.ts:815

The user who created this chat.

***

### description

> **description**: `string`

Defined in: src/utils/interfaces.ts:810

The description of the chat.

***

### id

> **id**: `ID`

Defined in: src/utils/interfaces.ts:808

The unique identifier of the chat.

***

### name

> **name**: `string`

Defined in: src/utils/interfaces.ts:809

The name of the chat.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: src/utils/interfaces.ts:817

The organization associated with this chat.

***

### updatedAt

> **updatedAt**: `string`

Defined in: src/utils/interfaces.ts:814

The last update date of the chat record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: src/utils/interfaces.ts:816

The user who last updated this chat.
