[Admin Docs](/)

***

# Interface: InterfaceDataTableTableProps\<T\>

Defined in: [src/types/shared-components/DataTable/props.ts:203](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L203)

Props for the DataTableTable component that renders table rows.

Provides data and configuration for rendering paginated table content,
including row selection, actions, and custom empty states.

## Type Parameters

### T

`T`

The type of data for each row in the table

## Properties

### activeSortBy?

> `optional` **activeSortBy**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:231](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L231)

ID of the currently sorted column

***

### activeSortDir?

> `optional` **activeSortDir**: [`SortDirection`](../../types/type-aliases/SortDirection.md)

Defined in: [src/types/shared-components/DataTable/props.ts:233](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L233)

Current sort direction

***

### allSelectedOnPage?

> `optional` **allSelectedOnPage**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:227](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L227)

Whether all rows on page are selected

***

### ariaBusy?

> `optional` **ariaBusy**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:215](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L215)

ARIA busy state for the table

***

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:213](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L213)

ARIA label for the table element

***

### columns

> **columns**: [`IColumnDef`](../../column/interfaces/IColumnDef.md)\<`T`, `unknown`\>[]

Defined in: [src/types/shared-components/DataTable/props.ts:205](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L205)

Array of column definitions specifying how to render each column

***

### currentSelection

> **currentSelection**: `ReadonlySet`\<[`Key`](../../types/type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/props.ts:243](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L243)

Current selection state

***

### effectiveRowActions

> **effectiveRowActions**: readonly [`IRowAction`](../../hooks/interfaces/IRowAction.md)\<`T`\>[]

Defined in: [src/types/shared-components/DataTable/props.ts:251](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L251)

Array of effective row actions

***

### effectiveSelectable?

> `optional` **effectiveSelectable**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:219](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L219)

Whether selection is enabled

***

### getKey()

> **getKey**: (`row`, `idx`) => `string` \| `number`

Defined in: [src/types/shared-components/DataTable/props.ts:241](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L241)

Function to get unique key for a row

#### Parameters

##### row

`T`

##### idx

`number`

#### Returns

`string` \| `number`

***

### handleHeaderClick()

> **handleHeaderClick**: (`col`) => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:235](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L235)

Callback when header is clicked for sorting

#### Parameters

##### col

[`IColumnDef`](../../column/interfaces/IColumnDef.md)\<`T`, `unknown`\>

#### Returns

`void`

***

### hasRowActions?

> `optional` **hasRowActions**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:221](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L221)

Whether row actions are present

***

### headerCheckboxRef?

> `optional` **headerCheckboxRef**: `RefObject`\<`HTMLInputElement`\>

Defined in: [src/types/shared-components/DataTable/props.ts:223](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L223)

Ref to the header checkbox for select all

***

### keysToShowRows?

> `optional` **keysToShowRows**: `ReadonlySet`\<[`Key`](../../types/type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/props.ts:207](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L207)

Set of row keys to display; if provided, only these rows are shown

***

### loadingMore?

> `optional` **loadingMore**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:253](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L253)

Whether more rows are loading

***

### renderRow()?

> `optional` **renderRow**: (`row`, `index`) => `ReactNode`

Defined in: [src/types/shared-components/DataTable/props.ts:249](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L249)

Custom function to render each row

#### Parameters

##### row

`T`

##### index

`number`

#### Returns

`ReactNode`

***

### selectAllOnPage()

> **selectAllOnPage**: (`checked`) => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:229](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L229)

Callback to select/deselect all rows on page

#### Parameters

##### checked

`boolean`

#### Returns

`void`

***

### skeletonRows?

> `optional` **skeletonRows**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:255](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L255)

Number of skeleton rows to show

***

### someSelectedOnPage?

> `optional` **someSelectedOnPage**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:225](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L225)

Whether some rows on page are selected

***

### sortable?

> `optional` **sortable**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:209](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L209)

Whether columns are sortable (default: true)

***

### sortedRows

> **sortedRows**: readonly `T`[]

Defined in: [src/types/shared-components/DataTable/props.ts:237](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L237)

Array of sorted rows to display

***

### sortState?

> `optional` **sortState**: [`ISortState`](../../types/interfaces/ISortState.md)

Defined in: [src/types/shared-components/DataTable/props.ts:211](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L211)

Current sort state specifying column and direction

***

### startIndex

> **startIndex**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:239](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L239)

Starting index for row numbering

***

### tableClassNames?

> `optional` **tableClassNames**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:217](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L217)

CSS classes to apply to the table

***

### tCommon()

> **tCommon**: (`key`, `options?`) => `string`

Defined in: [src/types/shared-components/DataTable/props.ts:247](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L247)

Translation function for common strings

#### Parameters

##### key

`string`

##### options?

`Record`\<`string`, `unknown`\>

#### Returns

`string`

***

### toggleRowSelection()

> **toggleRowSelection**: (`key`) => `void`

Defined in: [src/types/shared-components/DataTable/props.ts:245](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L245)

Callback to toggle row selection

#### Parameters

##### key

[`Key`](../../types/type-aliases/Key.md)

#### Returns

`void`
