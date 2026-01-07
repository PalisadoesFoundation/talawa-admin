[Admin Docs](/)

***

# Interface: InterfaceCursorPaginationProps\<TNode\>

Defined in: [src/types/CursorPagination/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L13)

Props for CursorPaginationManager component.

## Type Parameters

### TNode

`TNode`

## Properties

### children()?

> `optional` **children**: (`props`) => `ReactNode`

Defined in: [src/types/CursorPagination/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L28)

Render prop for external UI integration (e.g., InfiniteScroll)

#### Parameters

##### props

[`InterfaceCursorPaginationRenderProps`](InterfaceCursorPaginationRenderProps.md)\<`TNode`\>

#### Returns

`ReactNode`

***

### dataPath

> **dataPath**: `string`

Defined in: [src/types/CursorPagination/interface.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L17)

Dot-separated path to the connection field in the GraphQL response (e.g. "post.comments")

***

### emptyStateComponent?

> `optional` **emptyStateComponent**: `ReactNode`

Defined in: [src/types/CursorPagination/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L21)

***

### itemsPerPage?

> `optional` **itemsPerPage**: `number`

Defined in: [src/types/CursorPagination/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L18)

***

### loadingComponent?

> `optional` **loadingComponent**: `ReactNode`

Defined in: [src/types/CursorPagination/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L20)

***

### onDataChange()?

> `optional` **onDataChange**: (`data`) => `void`

Defined in: [src/types/CursorPagination/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L22)

#### Parameters

##### data

`TNode`[]

#### Returns

`void`

***

### query

> **query**: `DocumentNode`

Defined in: [src/types/CursorPagination/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L14)

***

### queryVariables?

> `optional` **queryVariables**: `Record`\<`string`, `unknown`\>

Defined in: [src/types/CursorPagination/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L15)

***

### refetchTrigger?

> `optional` **refetchTrigger**: `number`

Defined in: [src/types/CursorPagination/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L24)

Changing this numeric prop triggers a refetch when it updates

***

### renderItem()

> **renderItem**: (`item`, `index`) => `ReactNode`

Defined in: [src/types/CursorPagination/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L19)

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

Defined in: [src/types/CursorPagination/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L26)

When true, component only manages data and exposes children as render prop
