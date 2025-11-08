[Admin Docs](/)

***

# Interface: InterfacePost

Defined in: [src/types/Post/interface.ts:91](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/interface.ts#L91)

## Properties

### attachments?

> `optional` **attachments**: [`InterfaceAttachment`](InterfaceAttachment.md)[]

Defined in: [src/types/Post/interface.ts:98](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/interface.ts#L98)

***

### caption?

> `optional` **caption**: `string`

Defined in: [src/types/Post/interface.ts:93](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/interface.ts#L93)

***

### commentCount

> **commentCount**: `number`

Defined in: [src/types/Post/interface.ts:101](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/interface.ts#L101)

***

### comments?

> `optional` **comments**: `object`

Defined in: [src/types/Post/interface.ts:120](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/interface.ts#L120)

#### edges

> **edges**: `object`[]

#### pageInfo

> **pageInfo**: `object`

##### pageInfo.endCursor

> **endCursor**: `string`

##### pageInfo.hasNextPage

> **hasNextPage**: `boolean`

##### pageInfo.hasPreviousPage

> **hasPreviousPage**: `boolean`

##### pageInfo.startCursor

> **startCursor**: `string`

***

### commentsCount

> **commentsCount**: `number`

Defined in: [src/types/Post/interface.ts:102](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/interface.ts#L102)

***

### createdAt

> **createdAt**: `string`

Defined in: [src/types/Post/interface.ts:94](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/interface.ts#L94)

***

### creator?

> `optional` **creator**: [`InterfaceCreator`](InterfaceCreator.md)

Defined in: [src/types/Post/interface.ts:97](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/interface.ts#L97)

***

### downVoters?

> `optional` **downVoters**: `object`

Defined in: [src/types/Post/interface.ts:109](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/interface.ts#L109)

#### edges

> **edges**: `object`[]

***

### downVotesCount

> **downVotesCount**: `number`

Defined in: [src/types/Post/interface.ts:103](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/interface.ts#L103)

***

### hasUserVoted?

> `optional` **hasUserVoted**: `object`

Defined in: [src/types/Post/interface.ts:105](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/interface.ts#L105)

#### hasVoted

> **hasVoted**: `boolean`

#### voteType

> **voteType**: `string`

***

### id

> **id**: `string`

Defined in: [src/types/Post/interface.ts:92](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/interface.ts#L92)

***

### imageUrl?

> `optional` **imageUrl**: `string`

Defined in: [src/types/Post/interface.ts:99](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/interface.ts#L99)

***

### pinned?

> `optional` **pinned**: `boolean`

Defined in: [src/types/Post/interface.ts:96](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/interface.ts#L96)

***

### pinnedAt?

> `optional` **pinnedAt**: `string`

Defined in: [src/types/Post/interface.ts:95](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/interface.ts#L95)

***

### upVotesCount

> **upVotesCount**: `number`

Defined in: [src/types/Post/interface.ts:104](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/interface.ts#L104)

***

### videoUrl?

> `optional` **videoUrl**: `string`

Defined in: [src/types/Post/interface.ts:100](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/interface.ts#L100)
