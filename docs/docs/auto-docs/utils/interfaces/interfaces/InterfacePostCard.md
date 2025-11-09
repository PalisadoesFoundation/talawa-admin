[Admin Docs](/)

***

# Interface: InterfacePostCard

Defined in: [src/utils/interfaces.ts:2137](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2137)

## Properties

### commentCount

> **commentCount**: `number`

Defined in: [src/utils/interfaces.ts:2152](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2152)

***

### comments

> **comments**: `object`[]

Defined in: [src/utils/interfaces.ts:2155](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2155)

#### body

> **body**: `string`

#### creator

> **creator**: `object`

##### creator.avatarURL?

> `optional` **avatarURL**: `string`

##### creator.id

> **id**: `string`

##### creator.name

> **name**: `string`

#### downVoteCount

> **downVoteCount**: `number`

#### hasUserVoted

> **hasUserVoted**: [`VoteState`](../type-aliases/VoteState.md)

#### id

> **id**: `string`

#### text

> **text**: `string`

#### upVoteCount

> **upVoteCount**: `number`

***

### creator

> **creator**: `object`

Defined in: [src/utils/interfaces.ts:2140](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2140)

#### avatarURL?

> `optional` **avatarURL**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### downVoteCount

> **downVoteCount**: `number`

Defined in: [src/utils/interfaces.ts:2154](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2154)

***

### fetchPosts()

> **fetchPosts**: () => `void`

Defined in: [src/utils/interfaces.ts:2168](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2168)

#### Returns

`void`

***

### hasUserVoted

> **hasUserVoted**: [`VoteState`](../type-aliases/VoteState.md)

Defined in: [src/utils/interfaces.ts:2145](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2145)

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:2138](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2138)

***

### image

> **image**: `string`

Defined in: [src/utils/interfaces.ts:2148](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2148)

***

### isModalView?

> `optional` **isModalView**: `boolean`

Defined in: [src/utils/interfaces.ts:2139](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2139)

***

### pinnedAt?

> `optional` **pinnedAt**: `string`

Defined in: [src/utils/interfaces.ts:2147](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2147)

***

### postedAt

> **postedAt**: `string`

Defined in: [src/utils/interfaces.ts:2146](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2146)

***

### text

> **text**: `string`

Defined in: [src/utils/interfaces.ts:2151](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2151)

***

### title

> **title**: `string`

Defined in: [src/utils/interfaces.ts:2150](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2150)

***

### upVoteCount

> **upVoteCount**: `number`

Defined in: [src/utils/interfaces.ts:2153](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2153)

***

### video

> **video**: `string`

Defined in: [src/utils/interfaces.ts:2149](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2149)
