[Admin Docs](/)

***

# Interface: InterfaceChatPg

Defined in: [src/utils/interfaces.ts:797](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L797)

InterfaceChatPg
Defines the structure for a chat with PostgreSQL-specific fields.

## Properties

### avatarMimeType

> **avatarMimeType**: `string`

Defined in: [src/utils/interfaces.ts:801](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L801)

The MIME type of the chat's avatar.

***

### avatarURL

> **avatarURL**: `string`

Defined in: [src/utils/interfaces.ts:802](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L802)

The URL of the chat's avatar.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:803](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L803)

The creation date of the chat record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:805](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L805)

The user who created this chat.

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:800](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L800)

The description of the chat.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:798](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L798)

The unique identifier of the chat.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:799](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L799)

The name of the chat.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:807](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L807)

The organization associated with this chat.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:804](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L804)

The last update date of the chat record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:806](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L806)

The user who last updated this chat.
