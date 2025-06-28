[Admin Docs](/)

***

# Interface: InterfacePostCard

Defined in: [src/utils/interfaces.ts:2212](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2212)

InterfacePostCard

## Description

Defines the structure for a post card.

## Properties

### commentCount

> **commentCount**: `number`

Defined in: [src/utils/interfaces.ts:2226](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2226)

The number of comments on the post.

***

### comments

> **comments**: `object`[]

Defined in: [src/utils/interfaces.ts:2227](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2227)

An array of comments on the post.

#### creator

> **creator**: `object`

##### creator.email

> **email**: `string`

##### creator.firstName

> **firstName**: `string`

##### creator.id

> **id**: `string`

##### creator.lastName

> **lastName**: `string`

#### id

> **id**: `string`

#### likeCount

> **likeCount**: `number`

#### likedBy

> **likedBy**: `object`[]

#### text

> **text**: `string`

***

### creator

> **creator**: `object`

Defined in: [src/utils/interfaces.ts:2214](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2214)

The creator of the post.

#### email

> **email**: `string`

#### firstName

> **firstName**: `string`

#### id

> **id**: `string`

#### lastName

> **lastName**: `string`

***

### fetchPosts()

> **fetchPosts**: () => `void`

Defined in: [src/utils/interfaces.ts:2246](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2246)

A function to fetch posts.

#### Returns

`void`

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:2213](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2213)

The unique identifier of the post.

***

### image

> **image**: `string`

Defined in: [src/utils/interfaces.ts:2221](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2221)

The URL of the post's image, or null.

***

### likeCount

> **likeCount**: `number`

Defined in: [src/utils/interfaces.ts:2225](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2225)

The number of likes on the post.

***

### likedBy

> **likedBy**: `object`[]

Defined in: [src/utils/interfaces.ts:2241](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2241)

An array of users who liked the post.

#### firstName

> **firstName**: `string`

#### id

> **id**: `string`

#### lastName

> **lastName**: `string`

***

### postedAt

> **postedAt**: `string`

Defined in: [src/utils/interfaces.ts:2220](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2220)

The date and time the post was created.

***

### text

> **text**: `string`

Defined in: [src/utils/interfaces.ts:2223](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2223)

The text content of the post.

***

### title

> **title**: `string`

Defined in: [src/utils/interfaces.ts:2224](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2224)

The title of the post.

***

### video

> **video**: `string`

Defined in: [src/utils/interfaces.ts:2222](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2222)

The URL of the post's video, or null.
