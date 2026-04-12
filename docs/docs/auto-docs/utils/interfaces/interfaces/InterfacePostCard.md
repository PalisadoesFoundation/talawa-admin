[Admin Docs](/)

***

# Interface: InterfacePostCard

Defined in: [src/utils/interfaces.ts:1680](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1680)

Defines the structure for a post card.

## Properties

### attachmentURL?

> `optional` **attachmentURL**: `string`

Defined in: [src/utils/interfaces.ts:1692](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1692)

***

### body?

> `optional` **body**: `string`

Defined in: [src/utils/interfaces.ts:1694](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1694)

***

### commentCount

> **commentCount**: `number`

Defined in: [src/utils/interfaces.ts:1696](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1696)

***

### creator

> **creator**: `object`

Defined in: [src/utils/interfaces.ts:1683](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1683)

#### avatarURL?

> `optional` **avatarURL**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### downVoteCount

> **downVoteCount**: `number`

Defined in: [src/utils/interfaces.ts:1698](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1698)

***

### fetchPosts()

> **fetchPosts**: () => `Promise`\<`unknown`\>

Defined in: [src/utils/interfaces.ts:1699](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1699)

#### Returns

`Promise`\<`unknown`\>

***

### hasUserVoted

> **hasUserVoted**: [`VoteState`](../type-aliases/VoteState.md)

Defined in: [src/utils/interfaces.ts:1688](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1688)

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:1681](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1681)

***

### isModalView?

> `optional` **isModalView**: `boolean`

Defined in: [src/utils/interfaces.ts:1682](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1682)

***

### mimeType?

> `optional` **mimeType**: `string`

Defined in: [src/utils/interfaces.ts:1691](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1691)

***

### pinnedAt?

> `optional` **pinnedAt**: `string`

Defined in: [src/utils/interfaces.ts:1690](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1690)

***

### postedAt

> **postedAt**: `string`

Defined in: [src/utils/interfaces.ts:1689](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1689)

***

### text

> **text**: `string`

Defined in: [src/utils/interfaces.ts:1695](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1695)

***

### title

> **title**: `string`

Defined in: [src/utils/interfaces.ts:1693](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1693)

***

### upVoteCount

> **upVoteCount**: `number`

Defined in: [src/utils/interfaces.ts:1697](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1697)
