[Admin Docs](/)

***

# Interface: InterfaceCursorPaginationManagerProps\<TNode, TVariables\>

Defined in: [src/types/CursorPagination/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L31)

Props for CursorPaginationManager component.

## Type Parameters

### TNode

`TNode`

### TVariables

`TVariables` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

## Properties

### children()?

> `optional` **children**: (`props`) => `ReactNode`

Defined in: [src/types/CursorPagination/interface.ts:51](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L51)

Render prop for external UI integration (e.g., InfiniteScroll)

#### Parameters

##### props

[`InterfaceCursorPaginationRenderProps`](InterfaceCursorPaginationRenderProps.md)\<`TNode`\>

#### Returns

`ReactNode`

***

### dataPath

> **dataPath**: `string`

Defined in: [src/types/CursorPagination/interface.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L38)

Dot-separated path to the connection field in the GraphQL response (e.g. "post.comments")

***

### emptyStateComponent?

> `optional` **emptyStateComponent**: `ReactNode`

Defined in: [src/types/CursorPagination/interface.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L44)

***

### itemsPerPage?

> `optional` **itemsPerPage**: `number`

Defined in: [src/types/CursorPagination/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L39)

***

### keyExtractor()?

> `optional` **keyExtractor**: (`item`, `index`) => `string` \| `number`

Defined in: [src/types/CursorPagination/interface.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L42)

Optional function to extract unique key from item

#### Parameters

##### item

`TNode`

##### index

`number`

#### Returns

`string` \| `number`

***

### loadingComponent?

> `optional` **loadingComponent**: `ReactNode`

Defined in: [src/types/CursorPagination/interface.ts:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L43)

***

### onDataChange()?

> `optional` **onDataChange**: (`data`) => `void`

Defined in: [src/types/CursorPagination/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L45)

#### Parameters

##### data

`TNode`[]

#### Returns

`void`

***

### query

> **query**: `DocumentNode`

Defined in: [src/types/CursorPagination/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L35)

***

### queryVariables?

> `optional` **queryVariables**: `TVariables`

Defined in: [src/types/CursorPagination/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L36)

***

### refetchTrigger?

> `optional` **refetchTrigger**: `number`

Defined in: [src/types/CursorPagination/interface.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L47)

Changing this numeric prop triggers a refetch when it updates

***

### renderItem()

> **renderItem**: (`item`, `index`) => `ReactNode`

Defined in: [src/types/CursorPagination/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L40)

#### Parameters

##### item

`TNode`

##### index

`number`

#### Returns

`ReactNode`

***

### useExternalUI?

> `optional` **useExternalUI**: `boolean`

Defined in: [src/types/CursorPagination/interface.ts:49](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L49)

When true, component only manages data and exposes children as render prop
