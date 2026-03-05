[Admin Docs](/)

***

# Interface: InterfaceCursorPaginationManagerProps\<TData, TNode, TVariables\>

Defined in: [src/types/CursorPagination/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L40)

Props for the CursorPaginationManager component.

## Type Parameters

### TData

`TData`

### TNode

`TNode`

The type of individual items extracted from edges

### TVariables

`TVariables` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

The GraphQL query variables type (defaults to `Record<string, unknown>`)

## Properties

### actionRef?

> `optional` **actionRef**: `Ref`\<[`InterfaceCursorPaginationManagerRef`](InterfaceCursorPaginationManagerRef.md)\<`TNode`\>\>

Defined in: [src/types/CursorPagination/interface.ts:166](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L166)

Ref to access imperative actions

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/CursorPagination/interface.ts:171](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L171)

Custom class name for the container

***

### dataPath

> **dataPath**: `string`

Defined in: [src/types/CursorPagination/interface.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L60)

Dot-separated path to extract connection data from the query response

#### Examples

```ts
"users" for data.users
```

```ts
"organization.members" for data.organization.members
```

***

### emptyStateComponent?

> `optional` **emptyStateComponent**: `ReactNode`

Defined in: [src/types/CursorPagination/interface.ts:119](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L119)

Custom component to show when no items are available

***

### infiniteScroll?

> `optional` **infiniteScroll**: `boolean`

Defined in: [src/types/CursorPagination/interface.ts:176](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L176)

Enable infinite scroll behavior (auto-load when reaching threshold)

***

### itemsPerPage?

> `optional` **itemsPerPage**: `number`

Defined in: [src/types/CursorPagination/interface.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L66)

Number of items to fetch per page
default 10

***

### keyExtractor()?

> `optional` **keyExtractor**: (`item`, `index`) => `string` \| `number`

Defined in: [src/types/CursorPagination/interface.ts:109](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L109)

Optional function to extract a unique key for each item

#### Parameters

##### item

`TNode`

The current item

##### index

`number`

The index of the item in the array

#### Returns

`string` \| `number`

A unique string or number identifier for the item

#### Remarks

Provides a stable key for React reconciliation. When not provided,
falls back to using the array index as the key.

#### Example

```tsx
keyExtractor={(user) => user.id}
```

***

### loadingComponent?

> `optional` **loadingComponent**: `ReactNode`

Defined in: [src/types/CursorPagination/interface.ts:114](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L114)

Custom loading component to show during initial data fetch

***

### onContentScroll()?

> `optional` **onContentScroll**: (`e`) => `void`

Defined in: [src/types/CursorPagination/interface.ts:161](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L161)

Callback to handle scroll events or restoration.
If provided, the manager might delegate some scroll logic to the parent.

#### Parameters

##### e

`UIEvent`\<`HTMLElement`\>

#### Returns

`void`

***

### onDataChange()?

> `optional` **onDataChange**: (`data`) => `void`

Defined in: [src/types/CursorPagination/interface.ts:124](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L124)

Callback invoked when the data changes (initial load or after loading more)

#### Parameters

##### data

`TNode`[]

#### Returns

`void`

***

### onQueryResult()?

> `optional` **onQueryResult**: (`data`) => `void`

Defined in: [src/types/CursorPagination/interface.ts:155](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L155)

Callback to return the full query result data.
Useful when the parent component needs access to metadata in the response
(e.g., chat title, member count) outside of the connection data.

#### Parameters

##### data

`TData`

#### Returns

`void`

***

### paginationType?

> `optional` **paginationType**: `"forward"` \| `"backward"`

Defined in: [src/types/CursorPagination/interface.ts:137](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L137)

Direction of pagination.
'forward': Uses 'first' and 'after' (default)
'backward': Uses 'last' and 'before' (mapped via variableKeyMap if needed)

***

### query

> **query**: `DocumentNode`

Defined in: [src/types/CursorPagination/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L48)

GraphQL query document for fetching data

***

### queryVariables?

> `optional` **queryVariables**: `Omit`\<`TVariables`, `"first"` \| `"after"`\>

Defined in: [src/types/CursorPagination/interface.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L53)

Query variables (excluding pagination variables like 'first' and 'after')

***

### refetchTrigger?

> `optional` **refetchTrigger**: `number`

Defined in: [src/types/CursorPagination/interface.ts:130](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L130)

Trigger value that causes a refetch when changed
Can be a number (counter) or any value that changes

***

### renderItem()

> **renderItem**: (`item`, `index`) => `ReactNode`

Defined in: [src/types/CursorPagination/interface.ts:91](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L91)

Function to render each item in the list

#### Parameters

##### item

`TNode`

##### index

`number`

#### Returns

`ReactNode`

#### Remarks

When items have stable unique identifiers, provide a keyExtractor function
to ensure proper React reconciliation. If keyExtractor is not provided,
the component falls back to using the array index as the key, which works
for append-only pagination but may cause issues if items are reordered.

#### Example

```tsx
// With keyExtractor for stable keys:
<CursorPaginationManager
  keyExtractor={(user) => user.id}
  renderItem={(user) => <div>{user.name}</div>}
/>

// Without keyExtractor (uses index):
<CursorPaginationManager
  renderItem={(user) => <div>{user.name}</div>}
/>
```

***

### scrollThreshold?

> `optional` **scrollThreshold**: `number`

Defined in: [src/types/CursorPagination/interface.ts:182](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L182)

Distance from edge (top for backward, bottom for forward) to trigger load more.
Default: 50px

***

### variableKeyMap?

> `optional` **variableKeyMap**: `object`

Defined in: [src/types/CursorPagination/interface.ts:143](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L143)

Map generic pagination variables (first, after, last, before) to custom query variable names.
Useful when the query uses different variable names (e.g., 'lastMessages' instead of 'last').

#### after?

> `optional` **after**: `string`

#### before?

> `optional` **before**: `string`

#### first?

> `optional` **first**: `string`

#### last?

> `optional` **last**: `string`
