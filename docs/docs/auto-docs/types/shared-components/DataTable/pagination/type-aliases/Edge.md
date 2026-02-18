[Admin Docs](/)

***

# Type Alias: Edge\<TNode\>

> **Edge**\<`TNode`\> = \{ `node`: `TNode` \| `null`; \} \| `null`

Defined in: [src/types/shared-components/DataTable/pagination.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/pagination.ts#L28)

A single edge in a GraphQL Relay connection.

Wraps a node (or null) and can be null itself, representing
a single item in a paginated result set.

## Type Parameters

### TNode

`TNode`

The type of node data wrapped by this edge
