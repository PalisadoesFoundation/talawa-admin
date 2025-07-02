[Admin Docs](/)

***

# Interface: InterfacePostCard

Defined in: [src/utils/interfaces.ts:2109](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2109)

InterfacePostCard

## Description

Defines the structure for a post card.

## Properties

### commentCount

> **commentCount**: `number`

Defined in: [src/utils/interfaces.ts:2123](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2123)

The number of comments on the post.

***

### comments

> **comments**: `object`[]

Defined in: [src/utils/interfaces.ts:2124](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2124)

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

Defined in: [src/utils/interfaces.ts:2111](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2111)

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

Defined in: [src/utils/interfaces.ts:2143](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2143)

A function to fetch posts.

#### Returns

`void`

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:2110](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2110)

The unique identifier of the post.

***

### image

> **image**: `string`

Defined in: [src/utils/interfaces.ts:2118](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2118)

The URL of the post's image, or null.

***

### likeCount

> **likeCount**: `number`

Defined in: [src/utils/interfaces.ts:2122](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2122)

The number of likes on the post.

***

### likedBy

> **likedBy**: `object`[]

Defined in: [src/utils/interfaces.ts:2138](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2138)

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

Defined in: [src/utils/interfaces.ts:2117](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2117)

The date and time the post was created.

***

### text

> **text**: `string`

Defined in: [src/utils/interfaces.ts:2120](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2120)

The text content of the post.

***

### title

> **title**: `string`

Defined in: [src/utils/interfaces.ts:2121](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2121)

The title of the post.

***

### video

> **video**: `string`

Defined in: [src/utils/interfaces.ts:2119](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2119)

The URL of the post's video, or null.
