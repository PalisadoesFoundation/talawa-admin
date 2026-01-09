[Admin Docs](/)

***

# Interface: InterfaceCursorPaginationProps\<TNode\>

Defined in: [src/types/CursorPagination/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L14)

Props for CursorPaginationManager component.

## Type Parameters

### TNode

`TNode`

## Properties

### dataPath

> **dataPath**: `string`

Defined in: [src/types/CursorPagination/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L18)

Dot-separated path to the connection field in the GraphQL response (e.g. "post.comments")

***

### emptyStateComponent?

> `optional` **emptyStateComponent**: `ReactNode`

Defined in: [src/types/CursorPagination/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L23)

***

### itemsPerPage?

> `optional` **itemsPerPage**: `number`

Defined in: [src/types/CursorPagination/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L19)

***

### keyExtractor()?

> `optional` **keyExtractor**: (`item`, `index`) => `string` \| `number`

Defined in: [src/types/CursorPagination/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L21)

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

Defined in: [src/types/CursorPagination/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L22)

***

### onDataChange()?

> `optional` **onDataChange**: (`data`) => `void`

Defined in: [src/types/CursorPagination/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L24)

#### Parameters

##### data

`TNode`[]

#### Returns

`void`

***

### query

> **query**: `DocumentNode`

Defined in: [src/types/CursorPagination/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L15)

***

### queryVariables?

> `optional` **queryVariables**: `Record`\<`string`, `unknown`\>

Defined in: [src/types/CursorPagination/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L16)

***

### refetchTrigger?

> `optional` **refetchTrigger**: `number`

Defined in: [src/types/CursorPagination/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L26)

Changing this numeric prop triggers a refetch when it updates
