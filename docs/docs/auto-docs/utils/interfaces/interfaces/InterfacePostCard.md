[Admin Docs](/)

***

# Interface: InterfacePostCard

Defined in: [src/utils/interfaces.ts:1596](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1596)

Defines the structure for a post card.

## Properties

### attachmentURL?

> `optional` **attachmentURL**: `string`

Defined in: [src/utils/interfaces.ts:1608](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1608)

***

### body?

> `optional` **body**: `string`

Defined in: [src/utils/interfaces.ts:1610](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1610)

***

### commentCount

> **commentCount**: `number`

Defined in: [src/utils/interfaces.ts:1612](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1612)

***

### creator

> **creator**: `object`

Defined in: [src/utils/interfaces.ts:1599](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1599)

#### avatarURL?

> `optional` **avatarURL**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### downVoteCount

> **downVoteCount**: `number`

Defined in: [src/utils/interfaces.ts:1614](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1614)

***

### fetchPosts()

> **fetchPosts**: () => `Promise`\<`unknown`\>

Defined in: [src/utils/interfaces.ts:1615](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1615)

#### Returns

`Promise`\<`unknown`\>

***

### hasUserVoted

> **hasUserVoted**: [`VoteState`](../type-aliases/VoteState.md)

Defined in: [src/utils/interfaces.ts:1604](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1604)

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:1597](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1597)

***

### isModalView?

> `optional` **isModalView**: `boolean`

Defined in: [src/utils/interfaces.ts:1598](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1598)

***

### mimeType?

> `optional` **mimeType**: `string`

Defined in: [src/utils/interfaces.ts:1607](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1607)

***

### pinnedAt?

> `optional` **pinnedAt**: `string`

Defined in: [src/utils/interfaces.ts:1606](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1606)

***

### postedAt

> **postedAt**: `string`

Defined in: [src/utils/interfaces.ts:1605](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1605)

***

### text

> **text**: `string`

Defined in: [src/utils/interfaces.ts:1611](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1611)

***

### title

> **title**: `string`

Defined in: [src/utils/interfaces.ts:1609](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1609)

***

### upVoteCount

> **upVoteCount**: `number`

Defined in: [src/utils/interfaces.ts:1613](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1613)
