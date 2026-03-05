[Admin Docs](/)

***

# Interface: InterfacePageInfo

Defined in: [src/types/shared-components/DataTable/pagination.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/pagination.ts#L7)

Pagination state information for cursor-based pagination.

Used in GraphQL Relay connection pattern to track pagination cursors
and availability of next/previous pages.

## Properties

### endCursor?

> `optional` **endCursor**: `string`

Defined in: [src/types/shared-components/DataTable/pagination.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/pagination.ts#L15)

Cursor pointing to the end of the current result set

***

### hasNextPage

> **hasNextPage**: `boolean`

Defined in: [src/types/shared-components/DataTable/pagination.ts:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/pagination.ts#L9)

Whether more items exist after the current set (has next page)

***

### hasPreviousPage

> **hasPreviousPage**: `boolean`

Defined in: [src/types/shared-components/DataTable/pagination.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/pagination.ts#L11)

Whether items existed before the current set (has previous page)

***

### startCursor?

> `optional` **startCursor**: `string`

Defined in: [src/types/shared-components/DataTable/pagination.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/pagination.ts#L13)

Cursor pointing to the start of the current result set
