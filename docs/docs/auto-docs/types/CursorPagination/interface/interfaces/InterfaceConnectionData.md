[**talawa-admin**](../README.md)

***

# Interface: InterfaceConnectionData\<TNode\>

Defined in: [interface.ts:35](https://github.com/ad1tyayadav/talawa-admin/blob/a607752def4dd25da0fb886e7d6ece4050eddbe0/src/types/CursorPagination/interface.ts#L35)

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

Defined in: [interface.ts:36](https://github.com/ad1tyayadav/talawa-admin/blob/a607752def4dd25da0fb886e7d6ece4050eddbe0/src/types/CursorPagination/interface.ts#L36)

#### cursor

> **cursor**: `string`

#### node

> **node**: `TNode`

***

### pageInfo?

> `optional` **pageInfo**: `DefaultConnectionPageInfo`

Defined in: [interface.ts:40](https://github.com/ad1tyayadav/talawa-admin/blob/a607752def4dd25da0fb886e7d6ece4050eddbe0/src/types/CursorPagination/interface.ts#L40)
