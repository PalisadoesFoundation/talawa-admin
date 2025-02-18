[Admin Docs](/)

***

# Function: default()

> **default**(): `JSX.Element`

Defined in: [src/screens/OrgPost/OrgPost.tsx:111](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrgPost/OrgPost.tsx#L111)

OrgPost Component

This component is responsible for rendering and managing organization posts.
It allows users to create, view, and navigate through posts associated with an organization.

Features:
- Fetches and displays organization posts using GraphQL queries.
- Supports creating new posts with image/video uploads.
- Pagination for navigating between post pages.
- Search functionality for filtering posts by title or text.
- Sorting options to view the latest or oldest posts.
- Allows pinning posts for priority display.

Dependencies:
- Apollo Client for GraphQL queries and mutations.
- React Bootstrap for styling and UI components.
- react-toastify for success and error notifications.
- i18next for internationalization.
- Utility functions like convertToBase64 and errorHandler.

Props: None

State:
- postmodalisOpen: boolean - Controls the visibility of the create post modal.
- postformState: object - Stores post form data (title, info, media, pinPost).
- sortingOption: string - Stores the current sorting option ('latest', 'oldest').
- file: File | null - Stores the selected media file.
- after, before: string | null | undefined - Cursor values for pagination.
- first, last: number | null - Number of posts to fetch for pagination.
- showTitle: boolean - Controls whether to search by title or text.

GraphQL Queries:
- ORGANIZATION_POST_LIST: Fetches organization posts with pagination.
- CREATE_POST_MUTATION: Creates a new post for the organization.

## Returns

`JSX.Element`
