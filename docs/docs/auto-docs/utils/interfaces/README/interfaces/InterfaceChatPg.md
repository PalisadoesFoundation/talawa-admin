[Admin Docs](/)

***

# Interface: InterfaceChatPg

Defined in: [src/utils/interfaces.ts:888](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L888)

InterfaceChatPg

## Description

Defines the structure for a chat with PostgreSQL-specific fields.

## Properties

### avatarMimeType

> **avatarMimeType**: `string`

Defined in: [src/utils/interfaces.ts:892](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L892)

The MIME type of the chat's avatar.

***

### avatarURL

> **avatarURL**: `string`

Defined in: [src/utils/interfaces.ts:893](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L893)

The URL of the chat's avatar.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:894](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L894)

The creation date of the chat record.

***

### creator

> **creator**: [`InterfaceUserPg`]/auto-docs/utils/interfaces/README/interfaces/InterfaceUserPg

Defined in: [src/utils/interfaces.ts:896](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L896)

The user who created this chat.

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:891](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L891)

The description of the chat.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:889](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L889)

The unique identifier of the chat.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:890](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L890)

The name of the chat.

***

### organization

> **organization**: [`InterfaceOrganizationPg`]/auto-docs/utils/interfaces/README/interfaces/InterfaceOrganizationPg

Defined in: [src/utils/interfaces.ts:898](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L898)

The organization associated with this chat.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:895](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L895)

The last update date of the chat record.

***

### updater

> **updater**: [`InterfaceUserPg`]/auto-docs/utils/interfaces/README/interfaces/InterfaceUserPg

Defined in: [src/utils/interfaces.ts:897](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L897)

The user who last updated this chat.
