[Admin Docs](/)

***

# Interface: InterfacePostCard

Defined in: [src/utils/interfaces.ts:2136](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2136)

## Properties

### commentCount

> **commentCount**: `number`

Defined in: [src/utils/interfaces.ts:2151](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2151)

***

### comments

> **comments**: `object`[]

Defined in: [src/utils/interfaces.ts:2154](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2154)

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

Defined in: [src/utils/interfaces.ts:2139](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2139)

#### avatarURL?

> `optional` **avatarURL**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### downVoteCount

> **downVoteCount**: `number`

Defined in: [src/utils/interfaces.ts:2153](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2153)

***

### fetchPosts()

> **fetchPosts**: () => `void`

Defined in: [src/utils/interfaces.ts:2167](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2167)

#### Returns

`void`

***

### hasUserVoted

> **hasUserVoted**: [`VoteState`](../type-aliases/VoteState.md)

Defined in: [src/utils/interfaces.ts:2144](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2144)

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:2137](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2137)

***

### image

> **image**: `string`

Defined in: [src/utils/interfaces.ts:2147](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2147)

***

### isModalView?

> `optional` **isModalView**: `boolean`

Defined in: [src/utils/interfaces.ts:2138](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2138)

***

### pinnedAt?

> `optional` **pinnedAt**: `string`

Defined in: [src/utils/interfaces.ts:2146](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2146)

***

### postedAt

> **postedAt**: `string`

Defined in: [src/utils/interfaces.ts:2145](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2145)

***

### text

> **text**: `string`

Defined in: [src/utils/interfaces.ts:2150](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2150)

***

### title

> **title**: `string`

Defined in: [src/utils/interfaces.ts:2149](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2149)

***

### upVoteCount

> **upVoteCount**: `number`

Defined in: [src/utils/interfaces.ts:2152](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2152)

***

### video

> **video**: `string`

Defined in: [src/utils/interfaces.ts:2148](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2148)
