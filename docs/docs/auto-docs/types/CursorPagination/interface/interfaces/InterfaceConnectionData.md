[**talawa-admin**](../../../../README.md)

***

# Interface: InterfaceConnectionData\<TNode\>

Defined in: [src/types/CursorPagination/interface.ts:26](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/CursorPagination/interface.ts#L26)

Represents the GraphQL connection structure with edges and pageInfo.
This follows the Relay cursor pagination specification.

## Remarks

While the Relay spec requires both edges and pageInfo, this interface
makes pageInfo optional to gracefully handle incomplete responses.
When pageInfo is missing, items are still rendered but pagination is disabled.

## Type Parameters

### TNode

`TNode`

The type of individual items in the connection

## Properties

### edges

> **edges**: `object`[]

Defined in: [src/types/CursorPagination/interface.ts:27](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/CursorPagination/interface.ts#L27)

#### cursor

> **cursor**: `string`

#### node

> **node**: `TNode`

***

### pageInfo?

> `optional` **pageInfo**: [`DefaultConnectionPageInfo`](../../../AdminPortal/pagination/type-aliases/DefaultConnectionPageInfo.md)

Defined in: [src/types/CursorPagination/interface.ts:31](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/CursorPagination/interface.ts#L31)
