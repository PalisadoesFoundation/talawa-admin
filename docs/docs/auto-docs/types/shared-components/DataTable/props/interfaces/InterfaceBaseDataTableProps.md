[Admin Docs](/)

***

# Interface: InterfaceBaseDataTableProps\<T\>

Defined in: [src/types/shared-components/DataTable/props.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L16)

Base props for DataTable component configuration.

Provides core table configuration including column definitions, row data,
sizing, and sorting behavior. Extended by InterfaceDataTableProps for full functionality.

## Type Parameters

### T

`T`

The type of data for each row in the table

## Properties

### columns

> **columns**: [`IColumnDef`](../../column/interfaces/IColumnDef.md)\<`T`, `unknown`\>[]

Defined in: [src/types/shared-components/DataTable/props.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L18)

Array of column definitions specifying how to render each column

***

### keysToShowRows?

> `optional` **keysToShowRows**: `ReadonlySet`\<[`Key`](../../types/type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/props.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L22)

Set of row keys to display; if provided, only these rows are shown

***

### onSortChange()?

> `optional` **onSortChange**: (`event`) => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L30)

Callback fired when sort state changes

#### Parameters

##### event

[`ISortChangeEvent`](../../types/interfaces/ISortChangeEvent.md)\<`T`\>

#### Returns

`void`

***

### rowKey?

> `optional` **rowKey**: keyof `T` \| (`row`) => [`Key`](../../types/type-aliases/Key.md)

Defined in: [src/types/shared-components/DataTable/props.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L24)

Key or property name or function to extract unique identifier for each row

***

### rows?

> `optional` **rows**: `T`[]

Defined in: [src/types/shared-components/DataTable/props.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L20)

Array of row data to display in the table

***

### sortable?

> `optional` **sortable**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L26)

Whether columns are sortable (default: true)

***

### sortState?

> `optional` **sortState**: [`ISortState`](../../types/interfaces/ISortState.md)

Defined in: [src/types/shared-components/DataTable/props.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L28)

Current sort state specifying column and direction
