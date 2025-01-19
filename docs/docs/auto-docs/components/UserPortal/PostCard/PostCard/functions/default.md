[Admin Docs](/)

***

# Function: default()

> **default**(`props`): `JSX.Element`

Defined in: [src/components/UserPortal/PostCard/PostCard.tsx:69](https://github.com/abhassen44/talawa-admin/blob/bb7b6d5252385a81ad100b897eb0cba4f7ba10d2/src/components/UserPortal/PostCard/PostCard.tsx#L69)

PostCard component displays an individual post, including its details, interactions, and comments.

The component allows users to:
- View the post's details in a modal.
- Edit or delete the post.
- Like or unlike the post.
- Add comments to the post.
- Like or dislike individual comments.

## Parameters

### props

[`InterfacePostCard`](../../../../../utils/interfaces/interfaces/InterfacePostCard.md)

The properties passed to the component including post details, comments, and related actions.

## Returns

`JSX.Element`

JSX.Element representing a post card with interactive features.
