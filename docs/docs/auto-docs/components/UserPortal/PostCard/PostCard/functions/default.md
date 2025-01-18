[Admin Docs](/)

***

# Function: default()

> **default**(`props`): `JSX.Element`

Defined in: [src/components/UserPortal/PostCard/PostCard.tsx:69](https://github.com/gautam-divyanshu/talawa-admin/blob/69cd9f147d3701d1db7821366b2c564d1fb49f77/src/components/UserPortal/PostCard/PostCard.tsx#L69)

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
