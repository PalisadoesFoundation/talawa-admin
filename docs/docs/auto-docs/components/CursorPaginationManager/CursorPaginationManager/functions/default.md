[**talawa-admin**](../../../../README.md)

***

# Function: default()

> **default**\<`TNode`\>(`props`): `Element`

Defined in: [src/components/CursorPaginationManager/CursorPaginationManager.tsx:75](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/CursorPaginationManager/CursorPaginationManager.tsx#L75)

CursorPaginationManager - A reusable component for cursor-based pagination.

Manages cursor-based pagination state and integrates with Apollo Client.
Extracts data from nested GraphQL responses and provides pagination functionality.
Supports both default UI mode and external UI integration (e.g., InfiniteScroll).

## Type Parameters

### TNode

`TNode`

The type of individual items

## Parameters

### props

[`InterfaceCursorPaginationProps`](../../../../types/CursorPagination/interface/interfaces/InterfaceCursorPaginationProps.md)\<`TNode`\>

Component props

## Returns

`Element`

React component for managing cursor pagination

## Example

```tsx
// Default UI mode with built-in Load More button
<CursorPaginationManager<User>
  query={GET_USERS_QUERY}
  queryVariables={{ organizationId: '123' }}
  dataPath="users"
  itemsPerPage={10}
  renderItem={(user) => <UserCard user={user} />}
/>

// External UI mode with InfiniteScroll
<CursorPaginationManager<Tag>
  query={GET_TAGS_QUERY}
  queryVariables={{ id: tagId, first: 10 }}
  dataPath="getChildTags.childTags"
  itemsPerPage={10}
  renderItem={() => <></>}
  useExternalUI={true}
>
  {({ items, loading, pageInfo, handleLoadMore, error }) => (
    <InfiniteScroll
      dataLength={items.length}
      next={handleLoadMore}
      hasMore={pageInfo?.hasNextPage ?? false}
      loader={<Loader />}
    >
      {items.map(item => <Item key={item._id} {...item} />)}
    </InfiniteScroll>
  )}
</CursorPaginationManager>
```
