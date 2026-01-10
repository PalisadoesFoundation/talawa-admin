[Admin Docs](/)

***

# Interface: InterfaceConnectionData\<TNode\>

Defined in: [src/types/CursorPagination/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L22)

Connection data structure following Relay cursor pagination spec

## Remarks

While the Relay spec requires both edges and pageInfo, this interface
makes pageInfo optional to gracefully handle incomplete responses.
When pageInfo is missing, items are still rendered but pagination is disabled.

## Type Parameters

### TNode

`TNode`

## Properties

### edges

> **edges**: `object`[]

Defined in: [src/types/CursorPagination/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L23)

#### cursor

> **cursor**: `string`

#### node

> **node**: `TNode`

***

### pageInfo?

> `optional` **pageInfo**: [`InterfacePageInfo`](InterfacePageInfo.md)

Defined in: [src/types/CursorPagination/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L24)

***

### totalCount?

> `optional` **totalCount**: `number`

Defined in: [src/types/CursorPagination/interface.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L25)
