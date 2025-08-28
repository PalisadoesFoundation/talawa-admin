[Admin Docs](/)

***

# Interface: InterfacePostCard

Defined in: [src/utils/interfaces.ts:2117](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2117)

InterfacePostCard

## Description

Defines the structure for a post card.

## Properties

### commentCount

> **commentCount**: `number`

Defined in: [src/utils/interfaces.ts:2131](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2131)

The number of comments on the post.

***

### comments

> **comments**: `object`[]

Defined in: [src/utils/interfaces.ts:2132](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2132)

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

Defined in: [src/utils/interfaces.ts:2119](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2119)

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

Defined in: [src/utils/interfaces.ts:2151](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2151)

A function to fetch posts.

#### Returns

`void`

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:2118](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2118)

The unique identifier of the post.

***

### image

> **image**: `string`

Defined in: [src/utils/interfaces.ts:2126](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2126)

The URL of the post's image, or null.

***

### likeCount

> **likeCount**: `number`

Defined in: [src/utils/interfaces.ts:2130](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2130)

The number of likes on the post.

***

### likedBy

> **likedBy**: `object`[]

Defined in: [src/utils/interfaces.ts:2146](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2146)

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

Defined in: [src/utils/interfaces.ts:2125](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2125)

The date and time the post was created.

***

### text

> **text**: `string`

Defined in: [src/utils/interfaces.ts:2128](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2128)

The text content of the post.

***

### title

> **title**: `string`

Defined in: [src/utils/interfaces.ts:2129](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2129)

The title of the post.

***

### video

> **video**: `string`

Defined in: [src/utils/interfaces.ts:2127](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2127)

The URL of the post's video, or null.
