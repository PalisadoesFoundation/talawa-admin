[Admin Docs](/)

***

# Interface: InterfacePostCard

Defined in: [src/utils/interfaces.ts:1588](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1588)

Defines the structure for a post card.

## Properties

### attachmentURL?

> `optional` **attachmentURL**: `string`

Defined in: [src/utils/interfaces.ts:1600](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1600)

***

### body?

> `optional` **body**: `string`

Defined in: [src/utils/interfaces.ts:1602](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1602)

***

### commentCount

> **commentCount**: `number`

Defined in: [src/utils/interfaces.ts:1604](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1604)

***

### creator

> **creator**: `object`

Defined in: [src/utils/interfaces.ts:1591](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1591)

#### avatarURL?

> `optional` **avatarURL**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### downVoteCount

> **downVoteCount**: `number`

Defined in: [src/utils/interfaces.ts:1606](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1606)

***

### fetchPosts()

> **fetchPosts**: () => `Promise`\<`unknown`\>

Defined in: [src/utils/interfaces.ts:1607](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1607)

#### Returns

`Promise`\<`unknown`\>

***

### hasUserVoted

> **hasUserVoted**: [`VoteState`](../type-aliases/VoteState.md)

Defined in: [src/utils/interfaces.ts:1596](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1596)

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:1589](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1589)

***

### isModalView?

> `optional` **isModalView**: `boolean`

Defined in: [src/utils/interfaces.ts:1590](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1590)

***

### mimeType?

> `optional` **mimeType**: `string`

Defined in: [src/utils/interfaces.ts:1599](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1599)

***

### pinnedAt?

> `optional` **pinnedAt**: `string`

Defined in: [src/utils/interfaces.ts:1598](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1598)

***

### postedAt

> **postedAt**: `string`

Defined in: [src/utils/interfaces.ts:1597](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1597)

***

### text

> **text**: `string`

Defined in: [src/utils/interfaces.ts:1603](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1603)

***

### title

> **title**: `string`

Defined in: [src/utils/interfaces.ts:1601](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1601)

***

### upVoteCount

> **upVoteCount**: `number`

Defined in: [src/utils/interfaces.ts:1605](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1605)
