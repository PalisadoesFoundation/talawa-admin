[Admin Docs](/)

***

# Interface: InterfacePostCard

Defined in: [src/utils/interfaces.ts:1707](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1707)

Defines the structure for a post card.

## Properties

### attachmentURL?

> `optional` **attachmentURL**: `string`

Defined in: [src/utils/interfaces.ts:1719](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1719)

***

### body?

> `optional` **body**: `string`

Defined in: [src/utils/interfaces.ts:1721](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1721)

***

### commentCount

> **commentCount**: `number`

Defined in: [src/utils/interfaces.ts:1723](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1723)

***

### creator

> **creator**: `object`

Defined in: [src/utils/interfaces.ts:1710](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1710)

#### avatarURL?

> `optional` **avatarURL**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### downVoteCount

> **downVoteCount**: `number`

Defined in: [src/utils/interfaces.ts:1725](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1725)

***

### fetchPosts()

> **fetchPosts**: () => `Promise`\<`unknown`\>

Defined in: [src/utils/interfaces.ts:1726](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1726)

#### Returns

`Promise`\<`unknown`\>

***

### hasUserVoted

> **hasUserVoted**: [`VoteState`](../type-aliases/VoteState.md)

Defined in: [src/utils/interfaces.ts:1715](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1715)

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:1708](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1708)

***

### isModalView?

> `optional` **isModalView**: `boolean`

Defined in: [src/utils/interfaces.ts:1709](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1709)

***

### mimeType?

> `optional` **mimeType**: `string`

Defined in: [src/utils/interfaces.ts:1718](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1718)

***

### pinnedAt?

> `optional` **pinnedAt**: `string`

Defined in: [src/utils/interfaces.ts:1717](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1717)

***

### postedAt

> **postedAt**: `string`

Defined in: [src/utils/interfaces.ts:1716](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1716)

***

### text

> **text**: `string`

Defined in: [src/utils/interfaces.ts:1722](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1722)

***

### title

> **title**: `string`

Defined in: [src/utils/interfaces.ts:1720](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1720)

***

### upVoteCount

> **upVoteCount**: `number`

Defined in: [src/utils/interfaces.ts:1724](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1724)
