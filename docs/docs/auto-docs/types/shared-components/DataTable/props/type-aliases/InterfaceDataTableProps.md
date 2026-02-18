[Admin Docs](/)

***

# Type Alias: InterfaceDataTableProps\<T\>

> **InterfaceDataTableProps**\<`T`\> = `object`

Defined in: [src/types/shared-components/DataTable/props.ts:101](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L101)

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

Defined in: [src/types/shared-components/DataTable/props.ts:182](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L182)

***

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:139](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L139)

ARIA label for the table element

***

### bulkActions?

> `optional` **bulkActions**: `ReadonlyArray`\<[`IBulkAction`](../../hooks/interfaces/IBulkAction.md)\<`T`\>\>

Defined in: [src/types/shared-components/DataTable/props.ts:181](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L181)

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:115](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L115)

CSS class to apply to the table element

***

### columnFilter?

> `optional` **columnFilter**: `Record`\<`string`, `unknown`\>

Defined in: [src/types/shared-components/DataTable/props.ts:159](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L159)

***

### columnFilters?

> `optional` **columnFilters**: `Record`\<`string`, `unknown`\>

Defined in: [src/types/shared-components/DataTable/props.ts:160](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L160)

***

### columns

> **columns**: [`IColumnDef`](../../column/interfaces/IColumnDef.md)\<`T`, `unknown`\>[]

Defined in: [src/types/shared-components/DataTable/props.ts:103](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L103)

Array of column definitions specifying how to render each column

***

### currentPage?

> `optional` **currentPage**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:167](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L167)

***

### data

> **data**: `T`[]

Defined in: [src/types/shared-components/DataTable/props.ts:125](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L125)

For backward compatibility: use rows instead

***

### disableSort?

> `optional` **disableSort**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:185](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L185)

***

### emptyMessage?

> `optional` **emptyMessage**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:135](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L135)

Message to display when table is empty

***

### error?

> `optional` **error**: `Error` \| `null`

Defined in: [src/types/shared-components/DataTable/props.ts:131](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L131)

Error from the last data fetch operation

***

### globalSearch?

> `optional` **globalSearch**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:157](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L157)

***

### initialGlobalSearch?

> `optional` **initialGlobalSearch**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:156](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L156)

Initial global search value

***

### initialSelectedKeys?

> `optional` **initialSelectedKeys**: `ReadonlySet`\<[`Key`](../../types/type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/props.ts:179](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L179)

***

### initialSortBy?

> `optional` **initialSortBy**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:149](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L149)

Initial sort property

***

### initialSortDirection?

> `optional` **initialSortDirection**: [`SortDirection`](../../types/type-aliases/SortDirection.md)

Defined in: [src/types/shared-components/DataTable/props.ts:150](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L150)

***

### keysToShowRows?

> `optional` **keysToShowRows**: `ReadonlySet`\<[`Key`](../../types/type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/props.ts:107](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L107)

Set of row keys to display; if provided, only these rows are shown

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:127](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L127)

Whether the table is loading initial data

***

### loadingMore?

> `optional` **loadingMore**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:129](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L129)

Whether additional data is currently loading

***

### loadingOverlay?

> `optional` **loadingOverlay**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:145](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L145)

Whether to show a loading overlay during pagination

***

### noHeader?

> `optional` **noHeader**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:111](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L111)

Whether to hide the header row

***

### onColumnFilterChange()?

> `optional` **onColumnFilterChange**: (`filters`) => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:161](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L161)

#### Parameters

##### filters

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### onColumnFiltersChange()?

> `optional` **onColumnFiltersChange**: (`filters`) => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:162](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L162)

#### Parameters

##### filters

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### onGlobalSearchChange()?

> `optional` **onGlobalSearchChange**: (`q`) => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:158](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L158)

#### Parameters

##### q

`string`

#### Returns

`void`

***

### onLoadMore()?

> `optional` **onLoadMore**: () => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:171](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L171)

#### Returns

`void`

***

### onPageChange()?

> `optional` **onPageChange**: (`page`) => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:168](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L168)

#### Parameters

##### page

`number`

#### Returns

`void`

***

### onSelectedRowsChange()?

> `optional` **onSelectedRowsChange**: (`next`) => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:178](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L178)

#### Parameters

##### next

`ReadonlySet`\<[`Key`](../../types/type-aliases/Key.md)\>

#### Returns

`void`

***

### onSelectionChange()?

> `optional` **onSelectionChange**: (`next`) => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:177](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L177)

#### Parameters

##### next

`ReadonlySet`\<[`Key`](../../types/type-aliases/Key.md)\>

#### Returns

`void`

***

### onSortChange()?

> `optional` **onSortChange**: (`event`) => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:123](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L123)

Callback fired when sort state changes

#### Parameters

##### event

[`ISortChangeEvent`](../../types/interfaces/ISortChangeEvent.md)\<`T`\>

#### Returns

`void`

***

### page?

> `optional` **page**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:166](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L166)

***

### pageInfo?

> `optional` **pageInfo**: [`InterfacePageInfo`](../../pagination/interfaces/InterfacePageInfo.md) \| `null`

Defined in: [src/types/shared-components/DataTable/props.ts:170](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L170)

***

### pageSize?

> `optional` **pageSize**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:165](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L165)

***

### paginationMode?

> `optional` **paginationMode**: `"client"` \| `"server"` \| `"none"`

Defined in: [src/types/shared-components/DataTable/props.ts:164](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L164)

***

### refetch?

> `optional` **refetch**: `QueryResult`\<`unknown`\>\[`"refetch"`\]

Defined in: [src/types/shared-components/DataTable/props.ts:184](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L184)

***

### renderError()?

> `optional` **renderError**: (`error`) => `ReactNode`

Defined in: [src/types/shared-components/DataTable/props.ts:137](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L137)

Custom function to render error state

#### Parameters

##### error

`Error`

#### Returns

`ReactNode`

***

### renderRow()?

> `optional` **renderRow**: (`row`, `index`) => `ReactNode`

Defined in: [src/types/shared-components/DataTable/props.ts:133](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L133)

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

Defined in: [src/types/shared-components/DataTable/props.ts:180](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L180)

***

### rowKey?

> `optional` **rowKey**: keyof `T` \| (`row`) => [`Key`](../../types/type-aliases/Key.md)

Defined in: [src/types/shared-components/DataTable/props.ts:113](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L113)

Key or property name or function to extract unique identifier for each row

***

### rows?

> `optional` **rows**: `T`[]

Defined in: [src/types/shared-components/DataTable/props.ts:105](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L105)

Array of row data to display in the table

***

### searchBarProps?

> `optional` **searchBarProps**: `Omit`\<[`InterfaceSearchBarProps`](../interfaces/InterfaceSearchBarProps.md), `"value"` \| `"onChange"`\>

Defined in: [src/types/shared-components/DataTable/props.ts:163](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L163)

***

### searchPlaceholder?

> `optional` **searchPlaceholder**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:152](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L152)

Search placeholder text

***

### selectable?

> `optional` **selectable**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:174](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L174)

***

### selectedKeys?

> `optional` **selectedKeys**: `ReadonlySet`\<[`Key`](../../types/type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/props.ts:175](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L175)

***

### selectedRows?

> `optional` **selectedRows**: `ReadonlySet`\<[`Key`](../../types/type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/props.ts:176](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L176)

***

### serverFilter?

> `optional` **serverFilter**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:173](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L173)

***

### serverSearch?

> `optional` **serverSearch**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:172](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L172)

***

### serverSort?

> `optional` **serverSort**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:141](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L141)

Whether sorting is handled server-side

***

### showSearch?

> `optional` **showSearch**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:154](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L154)

Whether to show search bar

***

### showViewMoreButton?

> `optional` **showViewMoreButton**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:183](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L183)

***

### size?

> `optional` **size**: `"sm"` \| `"lg"`

Defined in: [src/types/shared-components/DataTable/props.ts:109](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L109)

Bootstrap size variant: 'sm' for small or 'lg' for large

***

### skeletonRows?

> `optional` **skeletonRows**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:143](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L143)

Number of skeleton rows to show during loading

***

### sortable?

> `optional` **sortable**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:119](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L119)

Whether columns are sortable (default: true)

***

### sortBy?

> `optional` **sortBy**: [`ISortState`](../../types/interfaces/ISortState.md)[]

Defined in: [src/types/shared-components/DataTable/props.ts:147](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L147)

Current sort state as array (controlled sorting)

***

### sortState?

> `optional` **sortState**: [`ISortState`](../../types/interfaces/ISortState.md)

Defined in: [src/types/shared-components/DataTable/props.ts:121](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L121)

Current sort state specifying column and direction

***

### striped?

> `optional` **striped**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:117](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L117)

Whether to apply striped styling to rows

***

### tableBodyClassName?

> `optional` **tableBodyClassName**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:186](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L186)

***

### tableClassName?

> `optional` **tableClassName**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:187](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L187)

***

### totalItems?

> `optional` **totalItems**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:169](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L169)
