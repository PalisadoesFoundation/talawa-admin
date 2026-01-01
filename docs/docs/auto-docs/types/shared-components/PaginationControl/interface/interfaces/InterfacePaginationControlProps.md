[Admin Docs](/)

***

# Interface: InterfacePaginationControlProps

Defined in: [src/types/shared-components/PaginationControl/interface.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PaginationControl/interface.ts#L7)

Props for the PaginationControl component

Provides standardized pagination interface across Talawa Admin.
Replaces inconsistent pagination patterns (paginationModel, onPaginationModelChange, MUI Pagination).

## Properties

### currentPage

> **currentPage**: `number`

Defined in: [src/types/shared-components/PaginationControl/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PaginationControl/interface.ts#L12)

Current page number (1-indexed)
First page = 1, Second page = 2, etc.

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [src/types/shared-components/PaginationControl/interface.ts:53](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PaginationControl/interface.ts#L53)

Disables all pagination controls
Useful during loading states

#### Default

```ts
false
```

***

### onPageChange()

> **onPageChange**: (`n`) => `void`

Defined in: [src/types/shared-components/PaginationControl/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PaginationControl/interface.ts#L40)

Callback when page changes

#### Parameters

##### n

`number`

New page number (1-indexed)

#### Returns

`void`

***

### onPageSizeChange()

> **onPageSizeChange**: (`n`) => `void`

Defined in: [src/types/shared-components/PaginationControl/interface.ts:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PaginationControl/interface.ts#L46)

Callback when page size changes

#### Parameters

##### n

`number`

New page size

#### Returns

`void`

***

### pageSize

> **pageSize**: `number`

Defined in: [src/types/shared-components/PaginationControl/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PaginationControl/interface.ts#L23)

Number of items per page

***

### pageSizeOptions?

> `optional` **pageSizeOptions**: `number`[]

Defined in: [src/types/shared-components/PaginationControl/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PaginationControl/interface.ts#L34)

Available options for page size selection

#### Default

```ts
[10, 25, 50, 100]
```

***

### totalItems

> **totalItems**: `number`

Defined in: [src/types/shared-components/PaginationControl/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PaginationControl/interface.ts#L28)

Total number of items across all pages

***

### totalPages

> **totalPages**: `number`

Defined in: [src/types/shared-components/PaginationControl/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/PaginationControl/interface.ts#L18)

Total number of pages
Calculated as: Math.ceil(totalItems / pageSize)
