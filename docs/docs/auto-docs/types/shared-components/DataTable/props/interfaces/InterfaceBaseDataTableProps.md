[Admin Docs](/)

***

# Interface: InterfaceBaseDataTableProps\<T\>

Defined in: [src/types/shared-components/DataTable/props.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L17)

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

Defined in: [src/types/shared-components/DataTable/props.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L19)

Array of column definitions specifying how to render each column

***

### keysToShowRows?

> `optional` **keysToShowRows**: `ReadonlySet`\<[`Key`](../../types/type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/props.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L23)

Set of row keys to display; if provided, only these rows are shown

***

### onSortChange()?

> `optional` **onSortChange**: (`event`) => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L31)

Callback fired when sort state changes

#### Parameters

##### event

[`ISortChangeEvent`](../../types/interfaces/ISortChangeEvent.md)\<`T`\>

#### Returns

`void`

***

### rowKey?

> `optional` **rowKey**: keyof `T` \| (`row`) => [`Key`](../../types/type-aliases/Key.md)

Defined in: [src/types/shared-components/DataTable/props.ts:25](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L25)

Key or property name or function to extract unique identifier for each row

***

### rows?

> `optional` **rows**: `T`[]

Defined in: [src/types/shared-components/DataTable/props.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L21)

Array of row data to display in the table

***

### sortable?

> `optional` **sortable**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L27)

Whether columns are sortable (default: true)

***

### sortState?

> `optional` **sortState**: [`ISortState`](../../types/interfaces/ISortState.md)

Defined in: [src/types/shared-components/DataTable/props.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L29)

Current sort state specifying column and direction
