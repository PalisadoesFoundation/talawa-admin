[Admin Docs](/)

---

# Interface: InterfacePostPg

Defined in: [src/utils/interfaces.ts:1097](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1097)

InterfacePostPg

## Description

Defines the structure for a post with PostgreSQL-specific fields.

## Properties

### caption

> **caption**: `string`

Defined in: [src/utils/interfaces.ts:1099](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1099)

The caption of the post.

---

### commentsCount

> **commentsCount**: `number`

Defined in: [src/utils/interfaces.ts:1100](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1100)

The number of comments on the post.

---

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1101](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1101)

The creation date of the post record.

---

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1102](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1102)

The user who created this post.

---

### downVotesCount

> **downVotesCount**: `number`

Defined in: [src/utils/interfaces.ts:1103](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1103)

The number of downvotes on the post.

---

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1098](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1098)

The unique identifier of the post.

---

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:1104](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1104)

The organization associated with this post.

---

### pinnedAt

> **pinnedAt**: `string`

Defined in: [src/utils/interfaces.ts:1105](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1105)

The date and time the post was pinned.

---

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1107](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1107)

The last update date of the post record.

---

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1108](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1108)

The user who last updated this post.

---

### upVotesCount

> **upVotesCount**: `number`

Defined in: [src/utils/interfaces.ts:1106](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1106)

The number of upvotes on the post.
