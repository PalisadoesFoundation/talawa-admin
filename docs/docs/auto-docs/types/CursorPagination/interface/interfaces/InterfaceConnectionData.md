[**talawa-admin**](../../../../README.md)

***

# Interface: InterfaceConnectionData\<TNode\>

Defined in: [src/types/CursorPagination/interface.ts:23](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/CursorPagination/interface.ts#L23)

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

Defined in: [src/types/CursorPagination/interface.ts:24](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/CursorPagination/interface.ts#L24)

#### cursor

> **cursor**: `string`

#### node

> **node**: `TNode`

***

### pageInfo?

> `optional` **pageInfo**: [`DefaultConnectionPageInfo`](../../../pagination/type-aliases/DefaultConnectionPageInfo.md)

Defined in: [src/types/CursorPagination/interface.ts:28](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/types/CursorPagination/interface.ts#L28)
