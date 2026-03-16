[Admin Docs](/)

***

# Interface: IPaginationControlProps

Defined in: [src/types/shared-components/PaginationControl/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PaginationControl/interface.ts#L20)

Props accepted by the PaginationControl component.

## Param

Current active page (1-indexed).

## Param

Total number of pages.

## Param

Number of items displayed per page.

## Param

Total number of items across all pages.

## Param

Array of selectable page-size values. Defaults to [10, 25, 50, 100].

## Param

Callback invoked with the new 1-indexed page number when the page changes.

## Param

Callback invoked with the new page size when the rows-per-page selector changes.

## Param

When true, all navigation controls and the page-size selector are disabled (e.g. during loading).

## Properties

### currentPage

> **currentPage**: `number`

Defined in: [src/types/shared-components/PaginationControl/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PaginationControl/interface.ts#L21)

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [src/types/shared-components/PaginationControl/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PaginationControl/interface.ts#L28)

***

### enableJumpToPage?

> `optional` **enableJumpToPage**: `boolean`

Defined in: [src/types/shared-components/PaginationControl/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PaginationControl/interface.ts#L32)

When true, renders the optional "Jump to page" input control.

***

### onJumpToPage()?

> `optional` **onJumpToPage**: (`page`) => `void`

Defined in: [src/types/shared-components/PaginationControl/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PaginationControl/interface.ts#L37)

Optional override invoked when the jump-to-page input submits.
Defaults to calling `onPageChange`.

#### Parameters

##### page

`number`

#### Returns

`void`

***

### onPageChange()

> **onPageChange**: (`page`) => `void`

Defined in: [src/types/shared-components/PaginationControl/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PaginationControl/interface.ts#L26)

#### Parameters

##### page

`number`

#### Returns

`void`

***

### onPageSizeChange()

> **onPageSizeChange**: (`size`) => `void`

Defined in: [src/types/shared-components/PaginationControl/interface.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PaginationControl/interface.ts#L27)

#### Parameters

##### size

`number`

#### Returns

`void`

***

### pageSize

> **pageSize**: `number`

Defined in: [src/types/shared-components/PaginationControl/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PaginationControl/interface.ts#L23)

***

### pageSizeOptions?

> `optional` **pageSizeOptions**: `number`[]

Defined in: [src/types/shared-components/PaginationControl/interface.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PaginationControl/interface.ts#L25)

***

### totalItems

> **totalItems**: `number`

Defined in: [src/types/shared-components/PaginationControl/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PaginationControl/interface.ts#L24)

***

### totalPages

> **totalPages**: `number`

Defined in: [src/types/shared-components/PaginationControl/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PaginationControl/interface.ts#L22)
