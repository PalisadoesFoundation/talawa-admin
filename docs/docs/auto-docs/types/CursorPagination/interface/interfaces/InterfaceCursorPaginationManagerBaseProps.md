[Admin Docs](/)

***

# Interface: InterfaceCursorPaginationManagerBaseProps\<TNode, TVariables\>

Defined in: [src/types/CursorPagination/interface.ts:41](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L41)

Base props shared by both default and external UI modes

## Type Parameters

### TNode

`TNode`

### TVariables

`TVariables` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

## Properties

### dataPath

> **dataPath**: `string`

Defined in: [src/types/CursorPagination/interface.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L63)

Dot-separated path to the connection field in the GraphQL response (e.g. "post.comments")

***

### emptyStateComponent?

> `optional` **emptyStateComponent**: `ReactNode`

Defined in: [src/types/CursorPagination/interface.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L68)

***

### itemsPerPage?

> `optional` **itemsPerPage**: `number`

Defined in: [src/types/CursorPagination/interface.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L64)

***

### keyExtractor()?

> `optional` **keyExtractor**: (`item`, `index`) => `string` \| `number`

Defined in: [src/types/CursorPagination/interface.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L66)

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

Defined in: [src/types/CursorPagination/interface.ts:67](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L67)

***

### onDataChange()?

> `optional` **onDataChange**: (`data`) => `void`

Defined in: [src/types/CursorPagination/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L69)

#### Parameters

##### data

`TNode`[]

#### Returns

`void`

***

### query

> **query**: `DocumentNode`

Defined in: [src/types/CursorPagination/interface.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L45)

***

### queryOptions?

> `optional` **queryOptions**: `Omit`\<`QueryHookOptions`\<`unknown`, `TVariables` & [`InterfacePaginationVariables`](InterfacePaginationVariables.md)\>, `"query"`\> & `object`

Defined in: [src/types/CursorPagination/interface.ts:50](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L50)

Query options including variables (preferred)

#### Type Declaration

##### variables?

> `optional` **variables**: `TVariables`

#### Remarks

Takes precedence over queryVariables when both are provided

***

### ~~queryVariables?~~

> `optional` **queryVariables**: `TVariables`

Defined in: [src/types/CursorPagination/interface.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L61)

Query variables (legacy, use queryOptions.variables instead)

#### Deprecated

Use queryOptions.variables instead. This prop will be removed in a future version.

#### Remarks

When both queryOptions.variables and queryVariables are provided, queryOptions.variables takes precedence

***

### refetchTrigger?

> `optional` **refetchTrigger**: `number`

Defined in: [src/types/CursorPagination/interface.ts:71](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L71)

Changing this numeric prop triggers a refetch when it updates
