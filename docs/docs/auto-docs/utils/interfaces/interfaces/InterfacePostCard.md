[Admin Docs](/)

***

# Interface: InterfacePostCard

Defined in: [src/utils/interfaces.ts:2099](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2099)

InterfacePostCard

## Description

Defines the structure for a post card.

## Properties

### commentCount

> **commentCount**: `number`

Defined in: [src/utils/interfaces.ts:2111](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2111)

The number of comments on the post.

***

### comments

> **comments**: `object`[]

Defined in: [src/utils/interfaces.ts:2125](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2125)

An array of comments on the post.

#### body

> **body**: `string`

#### creator

> **creator**: `object`

##### creator.email

> **email**: `string`

##### creator.id

> **id**: `string`

##### creator.name

> **name**: `string`

#### downVoteCount

> **downVoteCount**: `number`

#### id

> **id**: `string`

#### text

> **text**: `string`

#### upVoteCount

> **upVoteCount**: `number`

#### upVoters

> **upVoters**: `object`[]

***

### creator

> **creator**: `object`

Defined in: [src/utils/interfaces.ts:2101](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2101)

The creator of the post.

#### email

> **email**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### downVoteCount

> **downVoteCount**: `number`

Defined in: [src/utils/interfaces.ts:2124](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2124)

***

### fetchPosts()

> **fetchPosts**: () => `void`

Defined in: [src/utils/interfaces.ts:2138](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2138)

A function to fetch posts.

#### Returns

`void`

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:2100](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2100)

The unique identifier of the post.

***

### image

> **image**: `string`

Defined in: [src/utils/interfaces.ts:2107](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2107)

The URL of the post's image, or null.

***

### postedAt

> **postedAt**: `string`

Defined in: [src/utils/interfaces.ts:2106](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2106)

The date and time the post was created.

***

### text

> **text**: `string`

Defined in: [src/utils/interfaces.ts:2110](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2110)

The text content of the post.

***

### title

> **title**: `string`

Defined in: [src/utils/interfaces.ts:2109](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2109)

The title of the post.

***

### upVoteCount

> **upVoteCount**: `number`

Defined in: [src/utils/interfaces.ts:2123](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2123)

***

### upVoters

> **upVoters**: `object`

Defined in: [src/utils/interfaces.ts:2112](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2112)

An array of users who liked the post.

#### edges

> **edges**: `object`[]

***

### video

> **video**: `string`

Defined in: [src/utils/interfaces.ts:2108](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2108)

The URL of the post's video, or null.
