[Admin Docs](/)

***

# Interface: InterfaceBaseDataTableProps\<T, TValue\>

Defined in: [src/types/shared-components/DataTable/interface.ts:339](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L339)

Props for a generic DataTable component

## Type Parameters

### T

`T`

### TValue

`TValue` = `unknown`

## Properties

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:363](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L363)

Optional accessible label for the table, used for both the visually hidden table caption and as aria-label on the table element.
This improves accessibility for screen readers and navigation.

***

### bulkActions?

> `optional` **bulkActions**: readonly [`IBulkAction`](IBulkAction.md)\<`T`\>[]

Defined in: [src/types/shared-components/DataTable/interface.ts:415](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L415)

Bulk actions shown in a toolbar when rows are selected.

***

### columnFilters?

> `optional` **columnFilters**: `Record`\<`string`, `unknown`\>

Defined in: [src/types/shared-components/DataTable/interface.ts:384](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L384)

***

### columns

> **columns**: [`IColumnDef`](IColumnDef.md)\<`T`, `TValue`\>[]

Defined in: [src/types/shared-components/DataTable/interface.ts:341](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L341)

***

### data

> **data**: `T`[]

Defined in: [src/types/shared-components/DataTable/interface.ts:340](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L340)

***

### emptyMessage?

> `optional` **emptyMessage**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:356](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L356)

***

### error?

> `optional` **error**: `Error`

Defined in: [src/types/shared-components/DataTable/interface.ts:357](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L357)

***

### globalSearch?

> `optional` **globalSearch**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:377](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L377)

***

### initialGlobalSearch?

> `optional` **initialGlobalSearch**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:381](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L381)

***

### initialSelectedKeys?

> `optional` **initialSelectedKeys**: `ReadonlySet`\<[`Key`](../type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/interface.ts:407](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L407)

Initial selected keys for uncontrolled selection.

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:342](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L342)

***

### loadingOverlay?

> `optional` **loadingOverlay**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:370](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L370)

When true and data is already present, show a translucent overlay on top of the table
while a refetch is in flight. This avoids content jump during refresh.

***

### onColumnFiltersChange()?

> `optional` **onColumnFiltersChange**: (`filters`) => `void`

Defined in: [src/types/shared-components/DataTable/interface.ts:385](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L385)

#### Parameters

##### filters

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### onGlobalSearchChange()?

> `optional` **onGlobalSearchChange**: (`q`) => `void`

Defined in: [src/types/shared-components/DataTable/interface.ts:378](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L378)

#### Parameters

##### q

`string`

#### Returns

`void`

***

### onSelectionChange()?

> `optional` **onSelectionChange**: (`next`) => `void`

Defined in: [src/types/shared-components/DataTable/interface.ts:403](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L403)

Callback when selection changes. Required for controlled selection.

#### Parameters

##### next

`ReadonlySet`\<[`Key`](../type-aliases/Key.md)\>

#### Returns

`void`

***

### renderError()?

> `optional` **renderError**: (`error`) => `ReactNode`

Defined in: [src/types/shared-components/DataTable/interface.ts:358](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L358)

#### Parameters

##### error

`Error`

#### Returns

`ReactNode`

***

### renderRow()?

> `optional` **renderRow**: (`row`, `index`) => `ReactNode`

Defined in: [src/types/shared-components/DataTable/interface.ts:355](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L355)

Optional custom row renderer. When provided, rows are rendered using this function.

#### Parameters

##### row

`T`

##### index

`number`

#### Returns

`ReactNode`

***

### rowActions?

> `optional` **rowActions**: readonly [`IRowAction`](IRowAction.md)\<`T`\>[]

Defined in: [src/types/shared-components/DataTable/interface.ts:411](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L411)

Per-row action buttons rendered in an actions column.

***

### rowKey?

> `optional` **rowKey**: keyof `T` \| (`row`) => `string` \| `number`

Defined in: [src/types/shared-components/DataTable/interface.ts:347](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L347)

rowKey: A property name (keyof T) or a function to uniquely identify each row.
If a property name is provided, its value will be coerced to string or number.

***

### searchPlaceholder?

> `optional` **searchPlaceholder**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:374](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L374)

***

### selectable?

> `optional` **selectable**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:395](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L395)

When true, render a checkbox column for row selection.

***

### selectedKeys?

> `optional` **selectedKeys**: `ReadonlySet`\<[`Key`](../type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/interface.ts:399](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L399)

Controlled selection state. When provided with onSelectionChange, selection is controlled.

***

### serverFilter?

> `optional` **serverFilter**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:389](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L389)

***

### serverSearch?

> `optional` **serverSearch**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:388](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L388)

***

### showSearch?

> `optional` **showSearch**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:373](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L373)

***

### skeletonRows?

> `optional` **skeletonRows**: `number`

Defined in: [src/types/shared-components/DataTable/interface.ts:365](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L365)

Number of skeleton rows to show when loading (default: 5)

***

### tableClassName?

> `optional` **tableClassName**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:351](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L351)

Optional className applied to the underlying table element.
