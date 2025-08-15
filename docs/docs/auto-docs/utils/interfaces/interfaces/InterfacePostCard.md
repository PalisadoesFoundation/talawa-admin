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

Defined in: [src/utils/interfaces.ts:2114](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2114)

The number of comments on the post.

***

### comments

> **comments**: `object`[]

Defined in: [src/utils/interfaces.ts:2128](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2128)

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

Defined in: [src/utils/interfaces.ts:2102](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2102)

The creator of the post.

#### avatarURL?

> `optional` **avatarURL**: `string`

#### email

> **email**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### downVoteCount

> **downVoteCount**: `number`

Defined in: [src/utils/interfaces.ts:2127](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2127)

***

### fetchPosts()

> **fetchPosts**: () => `void`

Defined in: [src/utils/interfaces.ts:2141](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2141)

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

Defined in: [src/utils/interfaces.ts:2110](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2110)

The URL of the post's image, or null.

***

### isModalView?

> `optional` **isModalView**: `boolean`

Defined in: [src/utils/interfaces.ts:2101](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2101)

***

### pinnedAt?

> `optional` **pinnedAt**: `string`

Defined in: [src/utils/interfaces.ts:2109](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2109)

***

### postedAt

> **postedAt**: `string`

Defined in: [src/utils/interfaces.ts:2108](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2108)

The date and time the post was created.

***

### text

> **text**: `string`

Defined in: [src/utils/interfaces.ts:2113](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2113)

The text content of the post.

***

### title

> **title**: `string`

Defined in: [src/utils/interfaces.ts:2112](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2112)

The title of the post.

***

### upVoteCount

> **upVoteCount**: `number`

Defined in: [src/utils/interfaces.ts:2126](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2126)

***

### upVoters

> **upVoters**: `object`

Defined in: [src/utils/interfaces.ts:2115](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2115)

An array of users who liked the post.

#### edges

> **edges**: `object`[]

***

### video

> **video**: `string`

Defined in: [src/utils/interfaces.ts:2111](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2111)

The URL of the post's video, or null.
