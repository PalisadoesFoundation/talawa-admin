[Admin Docs](/)

***

# Interface: InterfacePostPg

Defined in: [src/utils/interfaces.ts:1123](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1123)

InterfacePostPg

## Description

Defines the structure for a post with PostgreSQL-specific fields.

## Properties

### caption

> **caption**: `string`

Defined in: [src/utils/interfaces.ts:1125](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1125)

The caption of the post.

***

### commentsCount

> **commentsCount**: `number`

Defined in: [src/utils/interfaces.ts:1126](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1126)

The number of comments on the post.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1127](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1127)

The creation date of the post record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1128](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1128)

The user who created this post.

***

### downVotesCount

> **downVotesCount**: `number`

Defined in: [src/utils/interfaces.ts:1129](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1129)

The number of downvotes on the post.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1124](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1124)

The unique identifier of the post.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:1130](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1130)

The organization associated with this post.

***

### pinnedAt

> **pinnedAt**: `string`

Defined in: [src/utils/interfaces.ts:1131](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1131)

The date and time the post was pinned.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1133](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1133)

The last update date of the post record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1134](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1134)

The user who last updated this post.

***

### upVotesCount

> **upVotesCount**: `number`

Defined in: [src/utils/interfaces.ts:1132](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1132)

The number of upvotes on the post.
