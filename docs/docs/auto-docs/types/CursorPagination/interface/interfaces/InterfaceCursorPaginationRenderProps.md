[Admin Docs](/)

***

# Interface: InterfaceCursorPaginationRenderProps\<TNode, TData\>

Defined in: [src/types/CursorPagination/interface.ts:125](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L125)

Props passed to children render function when useExternalUI is true

## Type Parameters

### TNode

`TNode`

### TData

`TData` = `unknown`

## Properties

### error

> **error**: `ApolloError`

Defined in: [src/types/CursorPagination/interface.ts:132](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L132)

***

### handleLoadMore()

> **handleLoadMore**: () => `Promise`\<`void`\>

Defined in: [src/types/CursorPagination/interface.ts:130](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L130)

#### Returns

`Promise`\<`void`\>

***

### handleRefetch()

> **handleRefetch**: () => `Promise`\<`void`\>

Defined in: [src/types/CursorPagination/interface.ts:131](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L131)

#### Returns

`Promise`\<`void`\>

***

### items

> **items**: `TNode`[]

Defined in: [src/types/CursorPagination/interface.ts:126](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L126)

***

### loading

> **loading**: `boolean`

Defined in: [src/types/CursorPagination/interface.ts:127](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L127)

***

### loadingMore

> **loadingMore**: `boolean`

Defined in: [src/types/CursorPagination/interface.ts:128](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L128)

***

### pageInfo

> **pageInfo**: [`InterfacePageInfo`](InterfacePageInfo.md)

Defined in: [src/types/CursorPagination/interface.ts:129](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L129)

***

### queryData

> **queryData**: `TData`

Defined in: [src/types/CursorPagination/interface.ts:134](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L134)

The full query data from Apollo Client
