[Admin Docs](/)

***

# Interface: InterfaceCommentCardProps

Defined in: [src/types/UserPortal/CommentCard/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/CommentCard/interface.ts#L6)

Props for CommentCard component.

## Properties

### creator

> **creator**: `object`

Defined in: [src/types/UserPortal/CommentCard/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/CommentCard/interface.ts#L15)

The creator of the comment, including their ID, name, and optional avatar URL.

#### avatarURL?

> `optional` **avatarURL**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### hasUserVoted?

> `optional` **hasUserVoted**: `object`

Defined in: [src/types/UserPortal/CommentCard/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/CommentCard/interface.ts#L24)

Object indicating if current user has voted and the vote type.

#### voteType

> **voteType**: [`VoteType`](../../../../../utils/interfaces/type-aliases/VoteType.md)

***

### id

> **id**: `string`

Defined in: [src/types/UserPortal/CommentCard/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/CommentCard/interface.ts#L10)

The unique identifier of the comment.

***

### refetchComments()?

> `optional` **refetchComments**: () => `void`

Defined in: [src/types/UserPortal/CommentCard/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/CommentCard/interface.ts#L39)

Optional callback to refresh comments after modifications.

#### Returns

`void`

***

### text

> **text**: `string`

Defined in: [src/types/UserPortal/CommentCard/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/CommentCard/interface.ts#L34)

The text content of the comment.

***

### upVoteCount

> **upVoteCount**: `number`

Defined in: [src/types/UserPortal/CommentCard/interface.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/UserPortal/CommentCard/interface.ts#L29)

The number of upvotes (likes) on the comment.
