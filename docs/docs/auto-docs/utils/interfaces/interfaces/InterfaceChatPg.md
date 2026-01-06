[Admin Docs](/)

***

# Interface: InterfaceChatPg

Defined in: [src/utils/interfaces.ts:779](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L779)

Defines the structure for a chat with PostgreSQL-specific fields.

## Properties

### avatarMimeType

> **avatarMimeType**: `string`

Defined in: [src/utils/interfaces.ts:783](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L783)

The MIME type of the chat's avatar.

***

### avatarURL

> **avatarURL**: `string`

Defined in: [src/utils/interfaces.ts:784](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L784)

The URL of the chat's avatar.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:785](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L785)

The creation date of the chat record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:787](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L787)

The user who created this chat.

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:782](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L782)

The description of the chat.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:780](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L780)

The unique identifier of the chat.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:781](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L781)

The name of the chat.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:789](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L789)

The organization associated with this chat.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:786](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L786)

The last update date of the chat record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:788](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L788)

The user who last updated this chat.
