[Admin Docs](/)

***

# Type Alias: Connection\<TNode\>

> **Connection**\<`TNode`\> = \{ `edges?`: [`Edge`](Edge.md)\<`TNode`\>[] \| `null`; `pageInfo?`: [`PageInfo`](PageInfo.md) \| `null`; \} \| `null` \| `undefined`

Defined in: [src/types/shared-components/DataTable/pagination.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/pagination.ts#L48)

GraphQL Relay connection pattern for paginated data.

Contains an array of edges (each wrapping a node or null) and pagination
metadata. Consumers should iterate the edges array and safely access node
values (which may be null), then use pageInfo to determine pagination state.

## Type Parameters

### TNode

`TNode`

The type of node data in the edges

## Type Declaration

\{ `edges?`: [`Edge`](Edge.md)\<`TNode`\>[] \| `null`; `pageInfo?`: [`PageInfo`](PageInfo.md) \| `null`; \}

### edges?

> `optional` **edges**: [`Edge`](Edge.md)\<`TNode`\>[] \| `null`

Array of edges, each optionally containing a node

### pageInfo?

> `optional` **pageInfo**: [`PageInfo`](PageInfo.md) \| `null`

Pagination state (cursors and next/previous availability)

`null`

`undefined`

## Example

```
connection?.edges?.forEach(edge => {
  if (edge?.node) {
    // Process non-null node
  }
});
```
