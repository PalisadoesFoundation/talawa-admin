[Admin Docs](/)

***

# Interface: InterfaceCursorPaginationManagerProps\<TNode, TVariables\>

Defined in: [interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L49)

Props for the CursorPaginationManager component.

## Type Parameters

### TNode

`TNode`

The type of individual items extracted from edges

### TVariables

`TVariables` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

The GraphQL query variables type (defaults to `Record<string, unknown>`)

## Properties

### dataPath

> **dataPath**: `string`

Defined in: [interface.ts:89](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L89)

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

Defined in: [interface.ts:148](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L148)

Custom component to show when no items are available

***

### itemsPerPage?

> `optional` **itemsPerPage**: `number`

Defined in: [interface.ts:95](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L95)

Number of items to fetch per page

#### Default Value

```ts
10
```

***

### keyExtractor()?

> `optional` **keyExtractor**: (`item`, `index`) => `string` \| `number`

Defined in: [interface.ts:138](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L138)

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

Defined in: [interface.ts:143](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L143)

Custom loading component to show during initial data fetch

***

### onDataChange()?

> `optional` **onDataChange**: (`data`) => `void`

Defined in: [interface.ts:153](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L153)

Callback invoked when the data changes (initial load or after loading more)

#### Parameters

##### data

`TNode`[]

#### Returns

`void`

***

### paginationDirection?

> `optional` **paginationDirection**: `"forward"` \| `"backward"`

Defined in: [interface.ts:77](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L77)

Direction of pagination.

- `'forward'`: Load next page using `first` and `after` parameters (default).
  New items are appended to the end of the list.
- `'backward'`: Load previous page using `last` and `before` parameters.
  New items are prepended to the beginning. Used for chat messages.

#### Default Value

```ts
'forward'
```

#### Example

```tsx
// Forward pagination (default):
<CursorPaginationManager paginationDirection="forward" ... />

// Backward pagination for chat messages:
<CursorPaginationManager paginationDirection="backward" ... />
```

***

### query

> **query**: `DocumentNode`

Defined in: [interface.ts:56](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L56)

GraphQL query document for fetching data

***

### queryVariables?

> `optional` **queryVariables**: `Omit`\<`TVariables`, `"first"` \| `"after"` \| `"last"` \| `"before"`\>

Defined in: [interface.ts:82](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L82)

Query variables (excluding pagination variables like 'first', 'after', 'last', 'before')

***

### refetchTrigger?

> `optional` **refetchTrigger**: `number`

Defined in: [interface.ts:159](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L159)

Trigger value that causes a refetch when changed
Can be a number (counter) or any value that changes

***

### renderItem()

> **renderItem**: (`item`, `index`) => `ReactNode`

Defined in: [interface.ts:120](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L120)

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

### scrollContainerRef?

> `optional` **scrollContainerRef**: `RefObject`\<`HTMLElement`\>

Defined in: [interface.ts:184](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L184)

Optional ref to the scroll container element.
Required for backward pagination to maintain scroll position when prepending items.

#### Remarks

When loading older messages in backward pagination, new items are prepended,
which would normally cause the scroll position to jump. By providing a
scrollContainerRef, the component automatically adjusts the scroll position
to maintain the user's view.

#### Example

```tsx
const messagesRef = useRef<HTMLDivElement>(null);

<div ref={messagesRef}>
  <CursorPaginationManager
    paginationDirection="backward"
    scrollContainerRef={messagesRef}
    ...
  />
</div>
```
