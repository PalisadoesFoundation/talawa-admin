[Admin Docs](/)

***

# Interface: InterfaceConnectionData\<TNode\>

Defined in: [src/types/CursorPagination/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L21)

Represents the GraphQL connection structure with edges and pageInfo.
This follows the Relay cursor pagination specification.

## Type Parameters

### TNode

`TNode`

## Properties

### edges

> **edges**: `object`[]

Defined in: [src/types/CursorPagination/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L22)

#### cursor

> **cursor**: `string`

#### node

> **node**: `TNode`

***

### pageInfo?

> `optional` **pageInfo**: [`DefaultConnectionPageInfo`](../../../pagination/type-aliases/DefaultConnectionPageInfo.md)

Defined in: [src/types/CursorPagination/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L26)
