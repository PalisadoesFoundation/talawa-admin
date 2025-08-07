[Admin Docs](/)

***

# Interface: InterfacePostCard

Defined in: [src/utils/interfaces.ts:2085](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2085)

InterfacePostCard

## Description

Defines the structure for a post card.

## Properties

### commentCount

> **commentCount**: `number`

Defined in: [src/utils/interfaces.ts:2097](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2097)

The number of comments on the post.

***

### comments

> **comments**: `object`[]

Defined in: [src/utils/interfaces.ts:2111](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2111)

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

Defined in: [src/utils/interfaces.ts:2087](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2087)

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

Defined in: [src/utils/interfaces.ts:2110](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2110)

***

### fetchPosts()

> **fetchPosts**: () => `void`

Defined in: [src/utils/interfaces.ts:2124](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2124)

A function to fetch posts.

#### Returns

`void`

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:2086](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2086)

The unique identifier of the post.

***

### image

> **image**: `string`

Defined in: [src/utils/interfaces.ts:2093](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2093)

The URL of the post's image, or null.

***

### postedAt

> **postedAt**: `string`

Defined in: [src/utils/interfaces.ts:2092](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2092)

The date and time the post was created.

***

### text

> **text**: `string`

Defined in: [src/utils/interfaces.ts:2096](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2096)

The text content of the post.

***

### title

> **title**: `string`

Defined in: [src/utils/interfaces.ts:2095](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2095)

The title of the post.

***

### upVoteCount

> **upVoteCount**: `number`

Defined in: [src/utils/interfaces.ts:2109](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2109)

***

### upVoters

> **upVoters**: `object`

Defined in: [src/utils/interfaces.ts:2098](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2098)

An array of users who liked the post.

#### edges

> **edges**: `object`[]

***

### video

> **video**: `string`

Defined in: [src/utils/interfaces.ts:2094](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2094)

The URL of the post's video, or null.
