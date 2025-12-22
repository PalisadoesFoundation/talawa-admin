[Admin Docs](/)

***

# Function: enrichPostNode()

> **enrichPostNode**(`post`): `object`

Defined in: [src/screens/OrgPost/OrgPostMocks.helpers.ts:3](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrgPost/OrgPostMocks.helpers.ts#L3)

## Parameters

### post

[`IPostNode`](../../OrgPostMocks.types/interfaces/IPostNode.md)

## Returns

`object`

### \_\_typename

> **\_\_typename**: `string` = `'Post'`

### attachments

> **attachments**: `any`[]

### caption

> **caption**: `string`

### comments

> **comments**: `unknown`[]

### commentsCount

> **commentsCount**: `number`

### createdAt

> **createdAt**: `string`

### creator

> **creator**: `object`

#### creator.\_\_typename

> **\_\_typename**: `string` = `'User'`

#### creator.avatarURL

> **avatarURL**: `string`

#### creator.emailAddress

> **emailAddress**: `string`

#### creator.firstName

> **firstName**: `string`

#### creator.id

> **id**: `string`

#### creator.lastName

> **lastName**: `string`

#### creator.name

> **name**: `string`

### downVotesCount

> **downVotesCount**: `number`

### hasUserVoted

> **hasUserVoted**: \{ `hasVoted`: `boolean`; `voteType`: `string`; \} \| \{ `__typename`: `string`; `hasVoted`: `false`; `voteType`: `string`; \}

### id

> **id**: `string`

### imageUrl

> **imageUrl**: `string`

### pinned

> **pinned**: `boolean`

### pinnedAt

> **pinnedAt**: `string`

### postsCount

> **postsCount**: `number`

### updatedAt

> **updatedAt**: `string`

### upVotesCount

> **upVotesCount**: `number`

### videoUrl

> **videoUrl**: `string`
