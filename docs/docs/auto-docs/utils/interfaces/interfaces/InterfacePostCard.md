[Admin Docs](/)

***

# Interface: InterfacePostCard

Defined in: [src/utils/interfaces.ts:2121](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2121)

InterfacePostCard

## Description

Defines the structure for a post card.

## Properties

### commentCount

> **commentCount**: `number`

Defined in: [src/utils/interfaces.ts:2136](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2136)

The number of comments on the post.

***

### comments

> **comments**: `object`[]

Defined in: [src/utils/interfaces.ts:2150](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2150)

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

Defined in: [src/utils/interfaces.ts:2124](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2124)

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

Defined in: [src/utils/interfaces.ts:2149](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2149)

***

### fetchPosts()

> **fetchPosts**: () => `void`

Defined in: [src/utils/interfaces.ts:2163](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2163)

A function to fetch posts.

#### Returns

`void`

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:2122](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2122)

The unique identifier of the post.

***

### image

> **image**: `string`

Defined in: [src/utils/interfaces.ts:2132](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2132)

The URL of the post's image, or null.

***

### isModalView?

> `optional` **isModalView**: `boolean`

Defined in: [src/utils/interfaces.ts:2123](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2123)

***

### pinnedAt?

> `optional` **pinnedAt**: `string`

Defined in: [src/utils/interfaces.ts:2131](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2131)

***

### postedAt

> **postedAt**: `string`

Defined in: [src/utils/interfaces.ts:2130](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2130)

The date and time the post was created.

***

### text

> **text**: `string`

Defined in: [src/utils/interfaces.ts:2135](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2135)

The text content of the post.

***

### title

> **title**: `string`

Defined in: [src/utils/interfaces.ts:2134](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2134)

The title of the post.

***

### upVoteCount

> **upVoteCount**: `number`

Defined in: [src/utils/interfaces.ts:2148](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2148)

***

### upVoters

> **upVoters**: `object`

Defined in: [src/utils/interfaces.ts:2137](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2137)

An array of users who liked the post.

#### edges

> **edges**: `object`[]

***

### video

> **video**: `string`

Defined in: [src/utils/interfaces.ts:2133](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2133)

The URL of the post's video, or null.
