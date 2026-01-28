[Admin Docs](/)

***

# Function: CursorPaginationManager()

> **CursorPaginationManager**\<`TData`, `TNode`, `TVariables`\>(`props`): `ReactElement`

Defined in: [src/components/CursorPaginationManager/CursorPaginationManager.tsx:127](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/CursorPaginationManager/CursorPaginationManager.tsx#L127)

CursorPaginationManager - A reusable component for cursor-based pagination

Manages cursor-based pagination state and integrates with Apollo Client.
Extracts data from nested GraphQL responses and provides "Load More" functionality.

## Type Parameters

### TData

`TData`

The complete GraphQL query response type

### TNode

`TNode`

The type of individual items

### TVariables

`TVariables` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

The GraphQL query variables type

## Parameters

### props

[`InterfaceCursorPaginationManagerProps`](../../../../types/CursorPagination/interface/interfaces/InterfaceCursorPaginationManagerProps.md)\<`TData`, `TNode`, `TVariables`\>

## Returns

`ReactElement`

## Example

```tsx
import { CursorPaginationManager } from 'components/CursorPaginationManager/CursorPaginationManager';
import { gql } from '@apollo/client';

const GET_USERS_QUERY = gql`
  query GetUsers($first: Int!, $after: String) {
    users(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          name
          email
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

function UsersList() {
  return (
    <CursorPaginationManager
      query={GET_USERS_QUERY}
      dataPath="users"
      itemsPerPage={10}
      renderItem={(user) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      )}
    />
  );
}
```

## Remarks

**Integration Requirements:**
- GraphQL query MUST follow Relay cursor pagination spec (edges, node, pageInfo)
- Query MUST accept `first: Int!` and `after: String` variables
- pageInfo MUST include: hasNextPage, hasPreviousPage, startCursor, endCursor
- Use `dataPath` prop to specify where connection data is in response (e.g., "users" or "organization.members")

**Features:**
- Automatic loading, empty, and error states using shared components
- "Load More" button with cursor-based pagination
- Manual refetch via `refetchTrigger` prop
- Custom loading/empty states via props
- Data change callbacks via `onDataChange`
