[**talawa-admin**](../../../../README.md)

***

# Interface: InterfaceCursorPaginationRenderProps\<T\>

Defined in: [src/types/CursorPagination/interface.ts:80](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/CursorPagination/interface.ts#L80)

Render props passed to the children function of CursorPaginationManager.

## Type Parameters

### T

`T`

The type of the items being paginated.

## Properties

### error?

> `optional` **error**: `Error`

Defined in: [src/types/CursorPagination/interface.ts:107](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/CursorPagination/interface.ts#L107)

Error that occurred during loading, if any.

***

### hasMore

> **hasMore**: `boolean`

Defined in: [src/types/CursorPagination/interface.ts:96](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/CursorPagination/interface.ts#L96)

Indicates if there are more items available to load.
- For forward pagination: equals `hasNextPage`
- For backward pagination: equals `hasPreviousPage`

***

### items

> **items**: `T`[]

Defined in: [src/types/CursorPagination/interface.ts:84](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/CursorPagination/interface.ts#L84)

Array of items to render.

***

### loading

> **loading**: `boolean`

Defined in: [src/types/CursorPagination/interface.ts:89](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/CursorPagination/interface.ts#L89)

Indicates if more items are currently being loaded.

***

### loadMore()

> **loadMore**: () => `Promise`\<`void`\>

Defined in: [src/types/CursorPagination/interface.ts:102](https://github.com/ad1tyayadav/talawa-admin/blob/113d6bb4150eecf2f42bfd13d7ecd3aa2d021635/src/types/CursorPagination/interface.ts#L102)

Function to trigger loading more items.
Typically called when user scrolls or clicks a "load more" button.

#### Returns

`Promise`\<`void`\>
