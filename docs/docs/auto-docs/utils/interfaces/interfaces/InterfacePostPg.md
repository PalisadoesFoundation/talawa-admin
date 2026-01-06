[Admin Docs](/)

***

# Interface: InterfacePostPg

Defined in: [src/utils/interfaces.ts:1087](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1087)

InterfacePostPg
Defines the structure for a post with PostgreSQL-specific fields.

## Properties

### caption

> **caption**: `string`

Defined in: [src/utils/interfaces.ts:1089](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1089)

The caption of the post.

***

### commentsCount

> **commentsCount**: `number`

Defined in: [src/utils/interfaces.ts:1090](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1090)

The number of comments on the post.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1091](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1091)

The creation date of the post record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1092](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1092)

The user who created this post.

***

### downVotesCount

> **downVotesCount**: `number`

Defined in: [src/utils/interfaces.ts:1093](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1093)

The number of downvotes on the post.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1088](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1088)

The unique identifier of the post.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:1094](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1094)

The organization associated with this post.

***

### pinnedAt

> **pinnedAt**: `string`

Defined in: [src/utils/interfaces.ts:1095](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1095)

The date and time the post was pinned.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1097](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1097)

The last update date of the post record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1098](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1098)

The user who last updated this post.

***

### upVotesCount

> **upVotesCount**: `number`

Defined in: [src/utils/interfaces.ts:1096](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1096)

The number of upvotes on the post.
