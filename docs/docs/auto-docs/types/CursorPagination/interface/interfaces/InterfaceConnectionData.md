[Admin Docs](/)

***

# Interface: InterfaceConnectionData\<TNode\>

Defined in: [src/types/CursorPagination/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L18)

Represents the GraphQL connection structure with edges and pageInfo.
This follows the Relay cursor pagination specification.

## Type Parameters

### TNode

`TNode`

The type of individual items in the connection

## Properties

### edges

> **edges**: `object`[]

Defined in: [src/types/CursorPagination/interface.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L19)

#### cursor

> **cursor**: `string`

#### node

> **node**: `TNode`

***

### pageInfo

> **pageInfo**: [`DefaultConnectionPageInfo`](../../../pagination/type-aliases/DefaultConnectionPageInfo.md)

Defined in: [src/types/CursorPagination/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/CursorPagination/interface.ts#L23)
