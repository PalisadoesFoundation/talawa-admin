[Admin Docs](/)

***

# Function: default()

> **default**(): `JSX.Element`

Defined in: [src/screens/UserPortal/Posts/Posts.tsx:112](https://github.com/gautam-divyanshu/talawa-admin/blob/7e5a95aa37ca1c5b95489b6b18ea8cf85fb3559b/src/screens/UserPortal/Posts/Posts.tsx#L112)

`home` component displays the main feed for a user, including posts, promoted content, and options to create a new post.

It utilizes Apollo Client for fetching and managing data through GraphQL queries. The component fetches and displays posts from an organization, promoted advertisements, and handles user interactions for creating new posts. It also manages state for displaying modal dialogs and handling file uploads for new posts.

## Returns

`JSX.Element`

JSX.Element - The rendered `home` component.