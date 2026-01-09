[Admin Docs](/)

***

# Interface: InterfaceCursorPaginationRenderProps\<TNode, TData\>

Defined in: [src/types/CursorPagination/interface.ts:80](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L80)

Props passed to children render function when useExternalUI is true

## Type Parameters

### TNode

`TNode`

### TData

`TData` = `unknown`

## Properties

### error

> **error**: `any`

Defined in: [src/types/CursorPagination/interface.ts:87](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L87)

***

### handleLoadMore()

> **handleLoadMore**: () => `Promise`\<`void`\>

Defined in: [src/types/CursorPagination/interface.ts:85](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L85)

#### Returns

`Promise`\<`void`\>

***

### handleRefetch()

> **handleRefetch**: () => `Promise`\<`void`\>

Defined in: [src/types/CursorPagination/interface.ts:86](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L86)

#### Returns

`Promise`\<`void`\>

***

### items

> **items**: `TNode`[]

Defined in: [src/types/CursorPagination/interface.ts:81](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L81)

***

### loading

> **loading**: `boolean`

Defined in: [src/types/CursorPagination/interface.ts:82](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L82)

***

### loadingMore

> **loadingMore**: `boolean`

Defined in: [src/types/CursorPagination/interface.ts:83](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L83)

***

### pageInfo

> **pageInfo**: [`InterfacePageInfo`](InterfacePageInfo.md)

Defined in: [src/types/CursorPagination/interface.ts:84](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L84)

***

### queryData

> **queryData**: `TData`

Defined in: [src/types/CursorPagination/interface.ts:89](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L89)

The full query data from Apollo Client
