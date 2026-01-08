[**talawa-admin**](../../../../README.md)

***

# Interface: InterfacePageInfo

Defined in: [src/types/CursorPagination/interface.ts:15](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/CursorPagination/interface.ts#L15)

Page information from a cursor-based pagination query.

This follows the Relay Cursor Connections Specification.

## Properties

### endCursor

> **endCursor**: `string`

Defined in: [src/types/CursorPagination/interface.ts:38](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/CursorPagination/interface.ts#L38)

Cursor pointing to the end of the current page.
Used as the `after` parameter for forward pagination.

***

### hasNextPage

> **hasNextPage**: `boolean`

Defined in: [src/types/CursorPagination/interface.ts:20](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/CursorPagination/interface.ts#L20)

Indicates if there are more items available after the current page.
Used for forward pagination.

***

### hasPreviousPage

> **hasPreviousPage**: `boolean`

Defined in: [src/types/CursorPagination/interface.ts:26](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/CursorPagination/interface.ts#L26)

Indicates if there are more items available before the current page.
Used for backward pagination.

***

### startCursor

> **startCursor**: `string`

Defined in: [src/types/CursorPagination/interface.ts:32](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/CursorPagination/interface.ts#L32)

Cursor pointing to the start of the current page.
Used as the `before` parameter for backward pagination.
