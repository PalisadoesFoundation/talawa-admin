[Admin Docs](/)

***

# Interface: InterfacePostCard

Defined in: [src/utils/interfaces.ts:2122](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2122)

## Properties

### commentCount

> **commentCount**: `number`

Defined in: [src/utils/interfaces.ts:2137](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2137)

***

### comments

> **comments**: `object`[]

Defined in: [src/utils/interfaces.ts:2140](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2140)

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

> **hasUserVoted**: [`VoteState`](utils\interfaces\README\type-aliases\VoteState.md)

#### id

> **id**: `string`

#### text

> **text**: `string`

#### upVoteCount

> **upVoteCount**: `number`

***

### creator

> **creator**: `object`

Defined in: [src/utils/interfaces.ts:2125](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2125)

#### avatarURL?

> `optional` **avatarURL**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### downVoteCount

> **downVoteCount**: `number`

Defined in: [src/utils/interfaces.ts:2139](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2139)

***

### fetchPosts()

> **fetchPosts**: () => `void`

Defined in: [src/utils/interfaces.ts:2153](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2153)

#### Returns

`void`

***

### hasUserVoted

> **hasUserVoted**: [`VoteState`](utils\interfaces\README\type-aliases\VoteState.md)

Defined in: [src/utils/interfaces.ts:2130](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2130)

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:2123](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2123)

***

### image

> **image**: `string`

Defined in: [src/utils/interfaces.ts:2133](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2133)

***

### isModalView?

> `optional` **isModalView**: `boolean`

Defined in: [src/utils/interfaces.ts:2124](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2124)

***

### pinnedAt?

> `optional` **pinnedAt**: `string`

Defined in: [src/utils/interfaces.ts:2132](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2132)

***

### postedAt

> **postedAt**: `string`

Defined in: [src/utils/interfaces.ts:2131](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2131)

***

### text

> **text**: `string`

Defined in: [src/utils/interfaces.ts:2136](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2136)

***

### title

> **title**: `string`

Defined in: [src/utils/interfaces.ts:2135](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2135)

***

### upVoteCount

> **upVoteCount**: `number`

Defined in: [src/utils/interfaces.ts:2138](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2138)

***

### video

> **video**: `string`

Defined in: [src/utils/interfaces.ts:2134](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2134)
