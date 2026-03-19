[Admin Docs](/)

***

# Interface: InterfacePaginationControlsProps

Defined in: [src/types/shared-components/DataTable/pagination.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/pagination.ts#L64)

Props for a pagination controls component.

Displays pagination UI with page indicators and navigation buttons
allowing users to move between pages of data.

## Properties

### onPageChange()

> **onPageChange**: (`page`) => `void`

Defined in: [src/types/shared-components/DataTable/pagination.ts:76](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/pagination.ts#L76)

Callback fired when user navigates to a different page.

#### Parameters

##### page

`number`

The new page number

#### Returns

`void`

***

### page

> **page**: `number`

Defined in: [src/types/shared-components/DataTable/pagination.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/pagination.ts#L66)

Current page number (typically 1-indexed)

***

### pageSize

> **pageSize**: `number`

Defined in: [src/types/shared-components/DataTable/pagination.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/pagination.ts#L68)

Number of items per page

***

### totalItems

> **totalItems**: `number`

Defined in: [src/types/shared-components/DataTable/pagination.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/pagination.ts#L70)

Total number of items across all pages
