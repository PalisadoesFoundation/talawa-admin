[Admin Docs](/)

***

# Interface: InterfaceCursorPaginationManagerProps\<TNode, TVariables\>

Defined in: [src/types/CursorPagination/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L32)

Props for the CursorPaginationManager component.

## Type Parameters

### TNode

`TNode`

The type of individual items extracted from edges

### TVariables

`TVariables` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

The GraphQL query variables type (defaults to Record<string, unknown>)

## Properties

### dataPath

> **dataPath**: `string`

Defined in: [src/types/CursorPagination/interface.ts:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L51)

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

Defined in: [src/types/CursorPagination/interface.ts:110](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L110)

Custom component to show when no items are available

***

### itemsPerPage?

> `optional` **itemsPerPage**: `number`

Defined in: [src/types/CursorPagination/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L57)

Number of items to fetch per page

#### Default

```ts
10
```

***

### keyExtractor()?

> `optional` **keyExtractor**: (`item`, `index`) => `string` \| `number`

Defined in: [src/types/CursorPagination/interface.ts:100](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L100)

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

Defined in: [src/types/CursorPagination/interface.ts:105](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L105)

Custom loading component to show during initial data fetch

***

### onDataChange()?

> `optional` **onDataChange**: (`data`) => `void`

Defined in: [src/types/CursorPagination/interface.ts:115](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L115)

Callback invoked when the data changes (initial load or after loading more)

#### Parameters

##### data

`TNode`[]

#### Returns

`void`

***

### query

> **query**: `DocumentNode`

Defined in: [src/types/CursorPagination/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L39)

GraphQL query document for fetching data

***

### queryVariables?

> `optional` **queryVariables**: `Omit`\<`TVariables`, `"first"` \| `"after"`\>

Defined in: [src/types/CursorPagination/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L44)

Query variables (excluding pagination variables like 'first' and 'after')

***

### refetchTrigger?

> `optional` **refetchTrigger**: `number`

Defined in: [src/types/CursorPagination/interface.ts:121](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L121)

Trigger value that causes a refetch when changed
Can be a number (counter) or any value that changes

***

### renderItem()

> **renderItem**: (`item`, `index`) => `ReactNode`

Defined in: [src/types/CursorPagination/interface.ts:82](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L82)

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
