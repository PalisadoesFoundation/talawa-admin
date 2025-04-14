[Admin Docs](/)

***

# Type Alias: PostNode

> **PostNode**: `object`

Defined in: [src/types/Post/type.ts:105](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Post/type.ts#L105)

## Type declaration

### \_id

> **\_id**: `string`

### commentCount

> **commentCount**: `number`

### comments

> **comments**: [`PostComments`](PostComments.md)

### createdAt

> **createdAt**: `string`

### creator

> **creator**: `object`

#### creator.\_id

> **\_id**: `string`

#### creator.email

> **email**: `string`

#### creator.firstName

> **firstName**: `string`

#### creator.lastName

> **lastName**: `string`

### imageUrl

> **imageUrl**: `string` \| `null`

### likeCount

> **likeCount**: `number`

### likedBy

> **likedBy**: `object`[]

### likes

> **likes**: [`PostLikes`](PostLikes.md)

### pinned

> **pinned**: `boolean`

### text

> **text**: `string`

### title

> **title**: `string`

### videoUrl

> **videoUrl**: `string` \| `null`
