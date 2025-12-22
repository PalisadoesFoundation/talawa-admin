[Admin Docs](/)

***

# Interface: InterfaceChatPg

Defined in: [src/utils/interfaces.ts:833](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L833)

InterfaceChatPg

## Description

Defines the structure for a chat with PostgreSQL-specific fields.

## Properties

### avatarMimeType

> **avatarMimeType**: `string`

Defined in: [src/utils/interfaces.ts:837](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L837)

The MIME type of the chat's avatar.

***

### avatarURL

> **avatarURL**: `string`

Defined in: [src/utils/interfaces.ts:838](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L838)

The URL of the chat's avatar.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:839](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L839)

The creation date of the chat record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:841](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L841)

The user who created this chat.

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:836](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L836)

The description of the chat.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:834](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L834)

The unique identifier of the chat.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:835](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L835)

The name of the chat.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:843](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L843)

The organization associated with this chat.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:840](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L840)

The last update date of the chat record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:842](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L842)

The user who last updated this chat.
