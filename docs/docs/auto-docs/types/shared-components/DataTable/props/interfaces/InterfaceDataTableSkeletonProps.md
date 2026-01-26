[Admin Docs](/)

***

# Interface: InterfaceDataTableSkeletonProps\<T\>

Defined in: [src/types/shared-components/DataTable/props.ts:277](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L277)

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

Defined in: [src/types/shared-components/DataTable/props.ts:279](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L279)

ARIA label for the skeleton table

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:301](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L301)

CSS class to apply to the skeleton container

***

### columns

> **columns**: [`IColumnDef`](../../column/interfaces/IColumnDef.md)\<`T`, `unknown`\>[]

Defined in: [src/types/shared-components/DataTable/props.ts:281](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L281)

Array of column definitions to match skeleton structure

***

### columnsCount?

> `optional` **columnsCount**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:291](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L291)

Number of columns to display in the skeleton

***

### effectiveSelectable?

> `optional` **effectiveSelectable**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:283](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L283)

Whether to show selection checkbox column

***

### hasRowActions?

> `optional` **hasRowActions**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:285](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L285)

Whether to show actions column

***

### noHeader?

> `optional` **noHeader**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:295](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L295)

Whether to hide the header row in the skeleton

***

### rowsCount?

> `optional` **rowsCount**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:293](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L293)

Number of rows to display in the skeleton

***

### size?

> `optional` **size**: `"sm"` \| `"lg"`

Defined in: [src/types/shared-components/DataTable/props.ts:297](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L297)

Bootstrap size variant: 'sm' for small or 'lg' for large

***

### skeletonRows

> **skeletonRows**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:287](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L287)

Number of skeleton rows to display

***

### striped?

> `optional` **striped**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:299](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L299)

Whether to apply striped styling to skeleton rows

***

### tableClassNames?

> `optional` **tableClassNames**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:289](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L289)

CSS class names for the table
