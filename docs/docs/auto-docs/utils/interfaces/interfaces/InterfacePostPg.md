[Admin Docs](/)

***

# Interface: InterfacePostPg

Defined in: [src/utils/interfaces.ts:1056](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1056)

Defines the structure for a post with PostgreSQL-specific fields.

## Properties

### caption

> **caption**: `string`

Defined in: [src/utils/interfaces.ts:1058](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1058)

The caption of the post.

***

### commentsCount

> **commentsCount**: `number`

Defined in: [src/utils/interfaces.ts:1059](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1059)

The number of comments on the post.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1060](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1060)

The creation date of the post record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1061](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1061)

The user who created this post.

***

### downVotesCount

> **downVotesCount**: `number`

Defined in: [src/utils/interfaces.ts:1062](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1062)

The number of downvotes on the post.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1057](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1057)

The unique identifier of the post.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:1063](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1063)

The organization associated with this post.

***

### pinnedAt

> **pinnedAt**: `string`

Defined in: [src/utils/interfaces.ts:1064](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1064)

The date and time the post was pinned.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1066](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1066)

The last update date of the post record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1067](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1067)

The user who last updated this post.

***

### upVotesCount

> **upVotesCount**: `number`

Defined in: [src/utils/interfaces.ts:1065](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1065)

The number of upvotes on the post.
