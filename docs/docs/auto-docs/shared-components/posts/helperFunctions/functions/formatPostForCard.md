[Admin Docs](/)

***

# Function: formatPostForCard()

> **formatPostForCard**(`post`, `t`, `refetch`): `object`

Defined in: [src/shared-components/posts/helperFunctions.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/posts/helperFunctions.ts#L23)

Formats a post object to match the PostCard component's expected interface.

This function transforms a raw post object from the GraphQL API into the format
required by the PostCard component, handling missing values with appropriate fallbacks
and formatting dates safely.

## Parameters

### post

[`InterfacePost`](../../../../types/Post/interface/interfaces/InterfacePost.md)

The raw post object from the API

### t

(`key`) => `string`

Translation function for internationalized text

### refetch

() => `Promise`\<`unknown`\>

Function to refetch posts data, typically from Apollo Client

## Returns

`object`

An object formatted to match the InterfacePostCard interface

### attachmentURL

> **attachmentURL**: `string`

### body

> **body**: `string` = `post.body`

### commentCount

> **commentCount**: `number`

### creator

> **creator**: `object`

#### creator.avatarURL

> **avatarURL**: `string` = `post.creator.avatarURL`

#### creator.id

> **id**: `string`

#### creator.name

> **name**: `string`

### downVoteCount

> **downVoteCount**: `number`

### fetchPosts()

> **fetchPosts**: () => `Promise`\<`unknown`\> = `refetch`

#### Returns

`Promise`\<`unknown`\>

### hasUserVoted

> **hasUserVoted**: `object`

#### hasUserVoted.hasVoted

> **hasVoted**: `boolean`

#### hasUserVoted.voteType

> **voteType**: `"up_vote"` \| `"down_vote"`

### id

> **id**: `string` = `post.id`

### mimeType

> **mimeType**: `string`

### pinnedAt

> **pinnedAt**: `string`

### postedAt

> **postedAt**: `string`

### text

> **text**: `string`

### title

> **title**: `string`

### upVoteCount

> **upVoteCount**: `number`

## Example

```tsx
const formattedPost = formatPostForCard(rawPost, t, refetch);
<PostCard {...formattedPost} />
```
