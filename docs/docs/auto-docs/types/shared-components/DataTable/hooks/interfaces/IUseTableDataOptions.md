[Admin Docs](/)

***

# Interface: IUseTableDataOptions\<TNode, TRow, TData\>

Defined in: [src/types/shared-components/DataTable/hooks.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L32)

Configuration options for fetching table data from a GraphQL connection.

Supports extracting rows from GraphQL Relay connection patterns and transforming
nodes into the desired row format. Integrates with Apollo Client for query management.

## Type Parameters

### TNode

`TNode`

The raw node type from the GraphQL connection

### TRow

`TRow`

The transformed row type after processing (may differ from TNode)

### TData

`TData` = `unknown`

The complete GraphQL query result data shape

## Properties

### deps?

> `optional` **deps**: `DependencyList`

Defined in: [src/types/shared-components/DataTable/hooks.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L47)

React dependency array to control when the data fetching updates

***

### path

> **path**: `DataPath`\<`TNode`, `TData`\>

Defined in: [src/types/shared-components/DataTable/hooks.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L37)

Path to the connection data within the query result.
Can be a function that extracts the connection from data, or an array of keys/indices.

***

### transformNode()?

> `optional` **transformNode**: (`node`) => `TRow`

Defined in: [src/types/shared-components/DataTable/hooks.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L45)

Optional transform function to convert raw node data into row format.
Called for each node in the connection.

#### Parameters

##### node

`TNode`

The raw node from the connection

#### Returns

`TRow`

Transformed row data, or null/undefined to exclude the node
