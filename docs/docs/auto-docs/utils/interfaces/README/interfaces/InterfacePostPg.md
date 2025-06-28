[Admin Docs](/)

***

# Interface: InterfacePostPg

Defined in: [src/utils/interfaces.ts:1194](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1194)

InterfacePostPg

## Description

Defines the structure for a post with PostgreSQL-specific fields.

## Properties

### caption

> **caption**: `string`

Defined in: [src/utils/interfaces.ts:1196](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1196)

The caption of the post.

***

### commentsCount

> **commentsCount**: `number`

Defined in: [src/utils/interfaces.ts:1197](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1197)

The number of comments on the post.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1198](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1198)

The creation date of the post record.

***

### creator

> **creator**: [`InterfaceUserPg`]/auto-docs/utils/interfaces/README/interfaces/InterfaceUserPg

Defined in: [src/utils/interfaces.ts:1199](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1199)

The user who created this post.

***

### downVotesCount

> **downVotesCount**: `number`

Defined in: [src/utils/interfaces.ts:1200](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1200)

The number of downvotes on the post.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1195](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1195)

The unique identifier of the post.

***

### organization

> **organization**: [`InterfaceOrganizationPg`]/auto-docs/utils/interfaces/README/interfaces/InterfaceOrganizationPg

Defined in: [src/utils/interfaces.ts:1201](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1201)

The organization associated with this post.

***

### pinnedAt

> **pinnedAt**: `string`

Defined in: [src/utils/interfaces.ts:1202](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1202)

The date and time the post was pinned.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1204](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1204)

The last update date of the post record.

***

### updater

> **updater**: [`InterfaceUserPg`]/auto-docs/utils/interfaces/README/interfaces/InterfaceUserPg

Defined in: [src/utils/interfaces.ts:1205](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1205)

The user who last updated this post.

***

### upVotesCount

> **upVotesCount**: `number`

Defined in: [src/utils/interfaces.ts:1203](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1203)

The number of upvotes on the post.
