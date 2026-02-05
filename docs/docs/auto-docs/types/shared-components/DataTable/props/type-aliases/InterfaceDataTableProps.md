[Admin Docs](/)

***

# Type Alias: InterfaceDataTableProps\<T\>

> **InterfaceDataTableProps**\<`T`\> = `object`

Defined in: [src/types/shared-components/DataTable/props.ts:100](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L100)

Complete props for the DataTable component.

Extends base configuration with pagination, filtering, searching, selection,
and bulk actions. Supports both client-side and server-side data handling.

## Type Parameters

### T

`T`

The type of data for each row in the table

## Properties

### actionableRows?

> `optional` **actionableRows**: `ReadonlySet`\<[`Key`](../../types/type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/props.ts:181](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L181)

***

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:138](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L138)

ARIA label for the table element

***

### bulkActions?

> `optional` **bulkActions**: `ReadonlyArray`\<[`IBulkAction`](../../hooks/interfaces/IBulkAction.md)\<`T`\>\>

Defined in: [src/types/shared-components/DataTable/props.ts:180](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L180)

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:114](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L114)

CSS class to apply to the table element

***

### columnFilter?

> `optional` **columnFilter**: `Record`\<`string`, `unknown`\>

Defined in: [src/types/shared-components/DataTable/props.ts:158](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L158)

***

### columnFilters?

> `optional` **columnFilters**: `Record`\<`string`, `unknown`\>

Defined in: [src/types/shared-components/DataTable/props.ts:159](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L159)

***

### columns

> **columns**: [`IColumnDef`](../../column/interfaces/IColumnDef.md)\<`T`, `unknown`\>[]

Defined in: [src/types/shared-components/DataTable/props.ts:102](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L102)

Array of column definitions specifying how to render each column

***

### currentPage?

> `optional` **currentPage**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:166](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L166)

***

### data

> **data**: `T`[]

Defined in: [src/types/shared-components/DataTable/props.ts:124](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L124)

For backward compatibility: use rows instead

***

### disableSort?

> `optional` **disableSort**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:190](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L190)

***

### emptyMessage?

> `optional` **emptyMessage**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:134](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L134)

Message to display when table is empty

***

### error?

> `optional` **error**: `Error` \| `null`

Defined in: [src/types/shared-components/DataTable/props.ts:130](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L130)

Error from the last data fetch operation

***

### globalSearch?

> `optional` **globalSearch**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:156](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L156)

***

### initialGlobalSearch?

> `optional` **initialGlobalSearch**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:155](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L155)

Initial global search value

***

### initialSelectedKeys?

> `optional` **initialSelectedKeys**: `ReadonlySet`\<[`Key`](../../types/type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/props.ts:178](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L178)

***

### initialSortBy?

> `optional` **initialSortBy**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:148](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L148)

Initial sort property

***

### initialSortDirection?

> `optional` **initialSortDirection**: [`SortDirection`](../../types/type-aliases/SortDirection.md)

Defined in: [src/types/shared-components/DataTable/props.ts:149](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L149)

***

### keysToShowRows?

> `optional` **keysToShowRows**: `ReadonlySet`\<[`Key`](../../types/type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/props.ts:106](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L106)

Set of row keys to display; if provided, only these rows are shown

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:126](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L126)

Whether the table is loading initial data

***

### loadingMore?

> `optional` **loadingMore**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:128](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L128)

Whether additional data is currently loading

***

### loadingOverlay?

> `optional` **loadingOverlay**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:144](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L144)

Whether to show a loading overlay during pagination

***

### noHeader?

> `optional` **noHeader**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:110](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L110)

Whether to hide the header row

***

### onColumnFilterChange()?

> `optional` **onColumnFilterChange**: (`filters`) => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:160](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L160)

#### Parameters

##### filters

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### onColumnFiltersChange()?

> `optional` **onColumnFiltersChange**: (`filters`) => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:161](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L161)

#### Parameters

##### filters

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### onGlobalSearchChange()?

> `optional` **onGlobalSearchChange**: (`q`) => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:157](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L157)

#### Parameters

##### q

`string`

#### Returns

`void`

***

### onLoadMore()?

> `optional` **onLoadMore**: () => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:170](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L170)

#### Returns

`void`

***

### onPageChange()?

> `optional` **onPageChange**: (`page`) => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:167](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L167)

#### Parameters

##### page

`number`

#### Returns

`void`

***

### onSelectedRowsChange()?

> `optional` **onSelectedRowsChange**: (`next`) => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:177](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L177)

#### Parameters

##### next

`ReadonlySet`\<[`Key`](../../types/type-aliases/Key.md)\>

#### Returns

`void`

***

### onSelectionChange()?

> `optional` **onSelectionChange**: (`next`) => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:176](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L176)

#### Parameters

##### next

`ReadonlySet`\<[`Key`](../../types/type-aliases/Key.md)\>

#### Returns

`void`

***

### onSortChange()?

> `optional` **onSortChange**: (`event`) => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:122](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L122)

Callback fired when sort state changes

#### Parameters

##### event

[`ISortChangeEvent`](../../types/interfaces/ISortChangeEvent.md)\<`T`\>

#### Returns

`void`

***

### page?

> `optional` **page**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:165](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L165)

***

### pageInfo?

> `optional` **pageInfo**: [`InterfacePageInfo`](../../pagination/interfaces/InterfacePageInfo.md) \| `null`

Defined in: [src/types/shared-components/DataTable/props.ts:169](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L169)

***

### pageSize?

> `optional` **pageSize**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:164](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L164)

***

### paginationMode?

> `optional` **paginationMode**: `"client"` \| `"server"` \| `"none"`

Defined in: [src/types/shared-components/DataTable/props.ts:163](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L163)

***

### refetch()?

> `optional` **refetch**: (...`args`) => `unknown`

Defined in: [src/types/shared-components/DataTable/props.ts:189](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L189)

Optional refetch function for server-side data.

Apollo v4 no longer exposes the previous `QueryResult` type in the same way,
so we keep this intentionally loose to avoid coupling to internal types.

#### Parameters

##### args

...`unknown`[]

#### Returns

`unknown`

***

### renderError()?

> `optional` **renderError**: (`error`) => `ReactNode`

Defined in: [src/types/shared-components/DataTable/props.ts:136](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L136)

Custom function to render error state

#### Parameters

##### error

`Error`

#### Returns

`ReactNode`

***

### renderRow()?

> `optional` **renderRow**: (`row`, `index`) => `ReactNode`

Defined in: [src/types/shared-components/DataTable/props.ts:132](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L132)

Custom function to render each row

#### Parameters

##### row

`T`

##### index

`number`

#### Returns

`ReactNode`

***

### rowActions?

> `optional` **rowActions**: `ReadonlyArray`\<[`IRowAction`](../../hooks/interfaces/IRowAction.md)\<`T`\>\>

Defined in: [src/types/shared-components/DataTable/props.ts:179](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L179)

***

### rowKey?

> `optional` **rowKey**: keyof `T` \| (`row`) => [`Key`](../../types/type-aliases/Key.md)

Defined in: [src/types/shared-components/DataTable/props.ts:112](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L112)

Key or property name or function to extract unique identifier for each row

***

### rows?

> `optional` **rows**: `T`[]

Defined in: [src/types/shared-components/DataTable/props.ts:104](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L104)

Array of row data to display in the table

***

### searchBarProps?

> `optional` **searchBarProps**: `Omit`\<[`InterfaceSearchBarProps`](../interfaces/InterfaceSearchBarProps.md), `"value"` \| `"onChange"`\>

Defined in: [src/types/shared-components/DataTable/props.ts:162](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L162)

***

### searchPlaceholder?

> `optional` **searchPlaceholder**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:151](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L151)

Search placeholder text

***

### selectable?

> `optional` **selectable**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:173](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L173)

***

### selectedKeys?

> `optional` **selectedKeys**: `ReadonlySet`\<[`Key`](../../types/type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/props.ts:174](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L174)

***

### selectedRows?

> `optional` **selectedRows**: `ReadonlySet`\<[`Key`](../../types/type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/props.ts:175](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L175)

***

### serverFilter?

> `optional` **serverFilter**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:172](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L172)

***

### serverSearch?

> `optional` **serverSearch**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:171](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L171)

***

### serverSort?

> `optional` **serverSort**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:140](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L140)

Whether sorting is handled server-side

***

### showSearch?

> `optional` **showSearch**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:153](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L153)

Whether to show search bar

***

### showViewMoreButton?

> `optional` **showViewMoreButton**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:182](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L182)

***

### size?

> `optional` **size**: `"sm"` \| `"lg"`

Defined in: [src/types/shared-components/DataTable/props.ts:108](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L108)

Bootstrap size variant: 'sm' for small or 'lg' for large

***

### skeletonRows?

> `optional` **skeletonRows**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:142](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L142)

Number of skeleton rows to show during loading

***

### sortable?

> `optional` **sortable**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:118](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L118)

Whether columns are sortable (default: true)

***

### sortBy?

> `optional` **sortBy**: [`ISortState`](../../types/interfaces/ISortState.md)[]

Defined in: [src/types/shared-components/DataTable/props.ts:146](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L146)

Current sort state as array (controlled sorting)

***

### sortState?

> `optional` **sortState**: [`ISortState`](../../types/interfaces/ISortState.md)

Defined in: [src/types/shared-components/DataTable/props.ts:120](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L120)

Current sort state specifying column and direction

***

### striped?

> `optional` **striped**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:116](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L116)

Whether to apply striped styling to rows

***

### tableBodyClassName?

> `optional` **tableBodyClassName**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:191](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L191)

***

### tableClassName?

> `optional` **tableClassName**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:192](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L192)

***

### totalItems?

> `optional` **totalItems**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:168](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L168)
