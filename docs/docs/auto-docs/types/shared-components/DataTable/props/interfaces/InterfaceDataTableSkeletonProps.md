[Admin Docs](/)

***

# Interface: InterfaceDataTableSkeletonProps\<T\>

Defined in: [src/types/shared-components/DataTable/props.ts:261](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L261)

Props for the DataTableSkeleton loading placeholder component.

Configures a skeleton table that animates while data is loading,
providing visual feedback of expected table structure.

## Type Parameters

### T

`T`

The type of data for each row in the table

## Properties

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:263](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L263)

ARIA label for the skeleton table

***

### columns

> **columns**: [`IColumnDef`](../../column/interfaces/IColumnDef.md)\<`T`, `unknown`\>[]

Defined in: [src/types/shared-components/DataTable/props.ts:265](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L265)

Array of column definitions to match skeleton structure

***

### effectiveSelectable?

> `optional` **effectiveSelectable**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:267](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L267)

Whether to show selection checkbox column

***

### hasRowActions?

> `optional` **hasRowActions**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:269](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L269)

Whether to show actions column

***

### skeletonRows

> **skeletonRows**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:271](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L271)

Number of skeleton rows to display

***

### tableClassNames?

> `optional` **tableClassNames**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:273](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L273)

CSS class names for the table
