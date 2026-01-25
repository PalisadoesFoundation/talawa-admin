[Admin Docs](/)

***

# Interface: IPaginationControlsProps

Defined in: [src/types/shared-components/DataTable/interface.ts:325](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L325)

Props for pagination controls (minimal API used by current component)

TYPE SAFETY AUDIT:
- page, pageSize, totalItems are strictly typed as number (not string | number | any)
- TypeScript prevents string/unknown types at compile-time
- All callers (DataTable.tsx verified as only caller) provide numeric values
- No string-to-number coercion needed; Number.isFinite() checks are defensive only

CALL SITE VERIFICATION:
- DataTable.tsx: pageSize = 10 (default numeric), totalItems = (totalItems ?? data.length)
- All props destructured from typed IDataTableProps<T> interface
- No URL parameters or form inputs directly coerced to number here

Future consideration: If external callers provide string pageSize/totalItems,
restore explicit coercion: Number.isFinite(Number(totalItems)) && Number.isFinite(Number(pageSize))

## Properties

### onPageChange()

> **onPageChange**: (`page`) => `void`

Defined in: [src/types/shared-components/DataTable/interface.ts:333](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L333)

Callback when page changes

#### Parameters

##### page

`number`

#### Returns

`void`

***

### page

> **page**: `number`

Defined in: [src/types/shared-components/DataTable/interface.ts:327](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L327)

Current page number (1-indexed)

***

### pageSize

> **pageSize**: `number`

Defined in: [src/types/shared-components/DataTable/interface.ts:329](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L329)

Number of items per page

***

### totalItems

> **totalItems**: `number`

Defined in: [src/types/shared-components/DataTable/interface.ts:331](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L331)

Total number of items across all pages
