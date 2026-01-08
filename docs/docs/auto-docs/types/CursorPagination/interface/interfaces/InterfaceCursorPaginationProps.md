[Admin Docs](/)

***

# Interface: InterfaceCursorPaginationProps\<TData, TNode\>

Defined in: [src/types/CursorPagination/interface.ts:155](https://github.com/ad1tyayadav/talawa-admin/blob/610e1eba4f5f98b7fa4c709055eb2481e5114540/src/types/CursorPagination/interface.ts#L155)

Props for the CursorPaginationManager component.

## Examples

Forward pagination (loading next page):
```tsx
<CursorPaginationManager
  paginationDirection="forward"
  data={queryData?.posts}
  queryVariables={{ first: 10, after: null }}
  onLoadMore={(variables) => refetch(variables)}
  getConnection={(data) => data}
>
  {({ items, loading, hasMore, loadMore }) => (
    <div>
      {items.map(item => <PostCard key={item.id} post={item} />)}
      {hasMore && <button onClick={loadMore}>Load More</button>}
    </div>
  )}
</CursorPaginationManager>
```

Backward pagination (loading previous page, e.g., for chat messages):
```tsx
<CursorPaginationManager
  paginationDirection="backward"
  data={queryData?.chat?.messages}
  queryVariables={{ last: 10, before: null }}
  onLoadMore={(variables) => refetch(variables)}
  getConnection={(data) => data}
  scrollContainerRef={messagesContainerRef}
>
  {({ items, loading, hasMore, loadMore }) => (
    <div ref={messagesContainerRef}>
      {hasMore && <button onClick={loadMore}>Load Older</button>}
      {items.map(msg => <Message key={msg.id} message={msg} />)}
    </div>
  )}
</CursorPaginationManager>
```

## Type Parameters

### TData

`TData`

The type of data returned by the query.

### TNode

`TNode`

The type of individual items being paginated.

## Properties

### children()?

> `optional` **children**: (`props`) => `ReactNode`

Defined in: [src/types/CursorPagination/interface.ts:217](https://github.com/ad1tyayadav/talawa-admin/blob/610e1eba4f5f98b7fa4c709055eb2481e5114540/src/types/CursorPagination/interface.ts#L217)

Render function that receives pagination state and renders the UI.
Required for Controlled Mode (unless renderItem is used in Smart Mode).

#### Parameters

##### props

[`InterfaceCursorPaginationRenderProps`](InterfaceCursorPaginationRenderProps.md)\<`TNode`\>

The render props containing items, loading state, and loadMore function.

#### Returns

`ReactNode`

***

### data?

> `optional` **data**: `TData`

Defined in: [src/types/CursorPagination/interface.ts:171](https://github.com/ad1tyayadav/talawa-admin/blob/610e1eba4f5f98b7fa4c709055eb2481e5114540/src/types/CursorPagination/interface.ts#L171)

The data returned from the GraphQL query containing the connection.

***

### dataPath?

> `optional` **dataPath**: `string`

Defined in: [src/types/CursorPagination/interface.ts:245](https://github.com/ad1tyayadav/talawa-admin/blob/610e1eba4f5f98b7fa4c709055eb2481e5114540/src/types/CursorPagination/interface.ts#L245)

Path to extract the connection from the query result.
e.g., "chat.messages" or "organizations.0.userTags"

***

### emptyStateComponent?

> `optional` **emptyStateComponent**: `ReactNode`

Defined in: [src/types/CursorPagination/interface.ts:265](https://github.com/ad1tyayadav/talawa-admin/blob/610e1eba4f5f98b7fa4c709055eb2481e5114540/src/types/CursorPagination/interface.ts#L265)

Component to display when list is empty.

***

### getConnection()?

> `optional` **getConnection**: (`data`) => [`InterfaceConnection`](InterfaceConnection.md)\<`TNode`\>

Defined in: [src/types/CursorPagination/interface.ts:180](https://github.com/ad1tyayadav/talawa-admin/blob/610e1eba4f5f98b7fa4c709055eb2481e5114540/src/types/CursorPagination/interface.ts#L180)

Function to extract the connection from the query data.
Required for Controlled Mode.

#### Parameters

##### data

`TData`

The query data.

#### Returns

[`InterfaceConnection`](InterfaceConnection.md)\<`TNode`\>

The connection object containing edges and pageInfo.

***

### itemsPerPage

> **itemsPerPage**: `number`

Defined in: [src/types/CursorPagination/interface.ts:200](https://github.com/ad1tyayadav/talawa-admin/blob/610e1eba4f5f98b7fa4c709055eb2481e5114540/src/types/CursorPagination/interface.ts#L200)

Number of items to fetch per page.

***

### keyExtractor()?

> `optional` **keyExtractor**: (`item`) => `string`

Defined in: [src/types/CursorPagination/interface.ts:255](https://github.com/ad1tyayadav/talawa-admin/blob/610e1eba4f5f98b7fa4c709055eb2481e5114540/src/types/CursorPagination/interface.ts#L255)

Function to extract unique key from an item.

#### Parameters

##### item

`TNode`

#### Returns

`string`

***

### loadingComponent?

> `optional` **loadingComponent**: `ReactNode`

Defined in: [src/types/CursorPagination/interface.ts:260](https://github.com/ad1tyayadav/talawa-admin/blob/610e1eba4f5f98b7fa4c709055eb2481e5114540/src/types/CursorPagination/interface.ts#L260)

Component to display while loading.

***

### onDataChange()?

> `optional` **onDataChange**: (`items`) => `void`

Defined in: [src/types/CursorPagination/interface.ts:275](https://github.com/ad1tyayadav/talawa-admin/blob/610e1eba4f5f98b7fa4c709055eb2481e5114540/src/types/CursorPagination/interface.ts#L275)

Callback when data is changed (Smart Mode).

#### Parameters

##### items

`TNode`[]

#### Returns

`void`

***

### onItemsChange()?

> `optional` **onItemsChange**: (`items`) => `void`

Defined in: [src/types/CursorPagination/interface.ts:231](https://github.com/ad1tyayadav/talawa-admin/blob/610e1eba4f5f98b7fa4c709055eb2481e5114540/src/types/CursorPagination/interface.ts#L231)

Optional callback fired when items change.
Useful for side effects like scroll position management.

#### Parameters

##### items

`TNode`[]

#### Returns

`void`

***

### onLoadMore()?

> `optional` **onLoadMore**: (`variables`) => `Promise`\<`unknown`\>

Defined in: [src/types/CursorPagination/interface.ts:209](https://github.com/ad1tyayadav/talawa-admin/blob/610e1eba4f5f98b7fa4c709055eb2481e5114540/src/types/CursorPagination/interface.ts#L209)

Callback function to load more items.
Required for Controlled Mode.

#### Parameters

##### variables

`Record`\<`string`, `unknown`\>

The new query variables to fetch the next/previous page.

#### Returns

`Promise`\<`unknown`\>

A promise that resolves when the data is loaded.

***

### paginationDirection?

> `optional` **paginationDirection**: `"forward"` \| `"backward"`

Defined in: [src/types/CursorPagination/interface.ts:166](https://github.com/ad1tyayadav/talawa-admin/blob/610e1eba4f5f98b7fa4c709055eb2481e5114540/src/types/CursorPagination/interface.ts#L166)

Direction of pagination.

- `'forward'`: Load next page using `first` and `after` parameters.
  New items are appended to the end of the list.
- `'backward'`: Load previous page using `last` and `before` parameters.
  New items are prepended to the beginning of the list.

#### Default Value

```ts
'forward'
```

***

### query?

> `optional` **query**: `DocumentNode`

Defined in: [src/types/CursorPagination/interface.ts:239](https://github.com/ad1tyayadav/talawa-admin/blob/610e1eba4f5f98b7fa4c709055eb2481e5114540/src/types/CursorPagination/interface.ts#L239)

GraphQL query to fetch data.
If provided, the component will manage data fetching.

***

### queryVariables?

> `optional` **queryVariables**: `object`

Defined in: [src/types/CursorPagination/interface.ts:189](https://github.com/ad1tyayadav/talawa-admin/blob/610e1eba4f5f98b7fa4c709055eb2481e5114540/src/types/CursorPagination/interface.ts#L189)

Current query variables.
Used to determine pagination state.
Required for Controlled Mode.

#### Index Signature

\[`key`: `string`\]: `unknown`

#### after?

> `optional` **after**: `string`

#### before?

> `optional` **before**: `string`

#### first?

> `optional` **first**: `number`

#### last?

> `optional` **last**: `number`

***

### refetchTrigger?

> `optional` **refetchTrigger**: `number`

Defined in: [src/types/CursorPagination/interface.ts:270](https://github.com/ad1tyayadav/talawa-admin/blob/610e1eba4f5f98b7fa4c709055eb2481e5114540/src/types/CursorPagination/interface.ts#L270)

Trigger to force refetch (for Smart Mode).

***

### renderItem()?

> `optional` **renderItem**: (`item`) => `ReactNode`

Defined in: [src/types/CursorPagination/interface.ts:250](https://github.com/ad1tyayadav/talawa-admin/blob/610e1eba4f5f98b7fa4c709055eb2481e5114540/src/types/CursorPagination/interface.ts#L250)

Render function for individual items (alternative to children render props).

#### Parameters

##### item

`TNode`

#### Returns

`ReactNode`

***

### scrollContainerRef?

> `optional` **scrollContainerRef**: `RefObject`\<`HTMLElement`\>

Defined in: [src/types/CursorPagination/interface.ts:225](https://github.com/ad1tyayadav/talawa-admin/blob/610e1eba4f5f98b7fa4c709055eb2481e5114540/src/types/CursorPagination/interface.ts#L225)

Optional ref to the scroll container.
Required for backward pagination to maintain scroll position.
