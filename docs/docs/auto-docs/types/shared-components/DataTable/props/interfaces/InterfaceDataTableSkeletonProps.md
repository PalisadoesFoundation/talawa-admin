[Admin Docs](/)

***

# Interface: InterfaceDataTableSkeletonProps\<T\>

Defined in: [src/types/shared-components/DataTable/props.ts:266](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L266)

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

Defined in: [src/types/shared-components/DataTable/props.ts:268](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L268)

ARIA label for the skeleton table

***

### columns

> **columns**: [`IColumnDef`](../../column/interfaces/IColumnDef.md)\<`T`, `unknown`\>[]

Defined in: [src/types/shared-components/DataTable/props.ts:270](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L270)

Array of column definitions to match skeleton structure

***

### effectiveSelectable?

> `optional` **effectiveSelectable**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:272](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L272)

Whether to show selection checkbox column

***

### hasRowActions?

> `optional` **hasRowActions**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:274](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L274)

Whether to show actions column

***

### skeletonRows

> **skeletonRows**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:276](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L276)

Number of skeleton rows to display

***

### tableClassNames?

> `optional` **tableClassNames**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:278](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L278)

CSS class names for the table
