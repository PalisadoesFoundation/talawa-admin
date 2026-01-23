[**talawa-admin**](../../../../../README.md)

***

# Interface: IBaseDataTableProps\<T, TValue\>

Defined in: [src/types/shared-components/DataTable/interface.ts:333](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L333)

Props for a generic DataTable component

## Type Parameters

### T

`T`

### TValue

`TValue` = `unknown`

## Properties

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:357](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L357)

Optional accessible label for the table, used for both the visually hidden table caption and as aria-label on the table element.
This improves accessibility for screen readers and navigation.

***

### bulkActions?

> `optional` **bulkActions**: readonly [`IBulkAction`](IBulkAction.md)\<`T`\>[]

Defined in: [src/types/shared-components/DataTable/interface.ts:409](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L409)

Bulk actions shown in a toolbar when rows are selected.

***

### columnFilters?

> `optional` **columnFilters**: `Record`\<`string`, `unknown`\>

Defined in: [src/types/shared-components/DataTable/interface.ts:378](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L378)

***

### columns

> **columns**: [`IColumnDef`](IColumnDef.md)\<`T`, `TValue`\>[]

Defined in: [src/types/shared-components/DataTable/interface.ts:335](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L335)

***

### data

> **data**: `T`[]

Defined in: [src/types/shared-components/DataTable/interface.ts:334](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L334)

***

### emptyMessage?

> `optional` **emptyMessage**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:350](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L350)

***

### error?

> `optional` **error**: `Error`

Defined in: [src/types/shared-components/DataTable/interface.ts:351](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L351)

***

### globalSearch?

> `optional` **globalSearch**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:371](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L371)

***

### initialGlobalSearch?

> `optional` **initialGlobalSearch**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:375](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L375)

***

### initialSelectedKeys?

> `optional` **initialSelectedKeys**: `ReadonlySet`\<[`Key`](../type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/interface.ts:401](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L401)

Initial selected keys for uncontrolled selection.

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:336](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L336)

***

### loadingOverlay?

> `optional` **loadingOverlay**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:364](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L364)

When true and data is already present, show a translucent overlay on top of the table
while a refetch is in flight. This avoids content jump during refresh.

***

### onColumnFiltersChange()?

> `optional` **onColumnFiltersChange**: (`filters`) => `void`

Defined in: [src/types/shared-components/DataTable/interface.ts:379](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L379)

#### Parameters

##### filters

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### onGlobalSearchChange()?

> `optional` **onGlobalSearchChange**: (`q`) => `void`

Defined in: [src/types/shared-components/DataTable/interface.ts:372](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L372)

#### Parameters

##### q

`string`

#### Returns

`void`

***

### onSelectionChange()?

> `optional` **onSelectionChange**: (`next`) => `void`

Defined in: [src/types/shared-components/DataTable/interface.ts:397](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L397)

Callback when selection changes. Required for controlled selection.

#### Parameters

##### next

`ReadonlySet`\<[`Key`](../type-aliases/Key.md)\>

#### Returns

`void`

***

### renderError()?

> `optional` **renderError**: (`error`) => `ReactNode`

Defined in: [src/types/shared-components/DataTable/interface.ts:352](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L352)

#### Parameters

##### error

`Error`

#### Returns

`ReactNode`

***

### renderRow()?

> `optional` **renderRow**: (`row`, `index`) => `ReactNode`

Defined in: [src/types/shared-components/DataTable/interface.ts:349](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L349)

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

Defined in: [src/types/shared-components/DataTable/interface.ts:405](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L405)

Per-row action buttons rendered in an actions column.

***

### rowKey?

> `optional` **rowKey**: keyof `T` \| (`row`) => `string` \| `number`

Defined in: [src/types/shared-components/DataTable/interface.ts:341](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L341)

rowKey: A property name (keyof T) or a function to uniquely identify each row.
If a property name is provided, its value will be coerced to string or number.

***

### searchPlaceholder?

> `optional` **searchPlaceholder**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:368](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L368)

***

### selectable?

> `optional` **selectable**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:389](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L389)

When true, render a checkbox column for row selection.

***

### selectedKeys?

> `optional` **selectedKeys**: `ReadonlySet`\<[`Key`](../type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/interface.ts:393](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L393)

Controlled selection state. When provided with onSelectionChange, selection is controlled.

***

### serverFilter?

> `optional` **serverFilter**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:383](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L383)

***

### serverSearch?

> `optional` **serverSearch**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:382](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L382)

***

### showSearch?

> `optional` **showSearch**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:367](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L367)

***

### skeletonRows?

> `optional` **skeletonRows**: `number`

Defined in: [src/types/shared-components/DataTable/interface.ts:359](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L359)

Number of skeleton rows to show when loading (default: 5)

***

### tableClassName?

> `optional` **tableClassName**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:345](https://github.com/VanshikaSabharwal/talawa-admin/blob/b013ea08c548e04dfa8e27b7d9e9418af9419ded/src/types/shared-components/DataTable/interface.ts#L345)

Optional className applied to the underlying table element.
