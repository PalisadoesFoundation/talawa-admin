[Admin Docs](/)

***

# Interface: InterfaceChatPg

Defined in: [src/utils/interfaces.ts:807](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L807)

InterfaceChatPg

## Description

Defines the structure for a chat with PostgreSQL-specific fields.

## Properties

### avatarMimeType

> **avatarMimeType**: `string`

Defined in: [src/utils/interfaces.ts:811](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L811)

The MIME type of the chat's avatar.

***

### avatarURL

> **avatarURL**: `string`

Defined in: [src/utils/interfaces.ts:812](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L812)

The URL of the chat's avatar.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:813](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L813)

The creation date of the chat record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:815](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L815)

The user who created this chat.

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:810](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L810)

The description of the chat.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:808](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L808)

The unique identifier of the chat.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:809](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L809)

The name of the chat.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:817](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L817)

The organization associated with this chat.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:814](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L814)

The last update date of the chat record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:816](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L816)

The user who last updated this chat.
