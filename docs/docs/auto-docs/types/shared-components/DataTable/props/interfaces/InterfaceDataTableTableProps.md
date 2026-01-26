[Admin Docs](/)

***

# Interface: InterfaceDataTableTableProps\<T\>

Defined in: [src/types/shared-components/DataTable/props.ts:206](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L206)

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

Defined in: [src/types/shared-components/DataTable/props.ts:242](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L242)

ID of the currently sorted column

***

### activeSortDir?

> `optional` **activeSortDir**: [`SortDirection`](../../types/type-aliases/SortDirection.md)

Defined in: [src/types/shared-components/DataTable/props.ts:244](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L244)

Current sort direction

***

### allSelectedOnPage?

> `optional` **allSelectedOnPage**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:238](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L238)

Whether all rows on page are selected

***

### ariaBusy?

> `optional` **ariaBusy**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:226](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L226)

ARIA busy state for the table

***

### ariaLabel?

> `optional` **ariaLabel**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:224](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L224)

ARIA label for the table element

***

### className?

> `optional` **className**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:216](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L216)

CSS class to apply to the table element

***

### columns

> **columns**: [`IColumnDef`](../../column/interfaces/IColumnDef.md)\<`T`, `unknown`\>[]

Defined in: [src/types/shared-components/DataTable/props.ts:208](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L208)

Array of column definitions specifying how to render each column

***

### currentSelection

> **currentSelection**: `ReadonlySet`\<[`Key`](../../types/type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/props.ts:254](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L254)

Current selection state

***

### effectiveRowActions

> **effectiveRowActions**: readonly [`IRowAction`](../../hooks/interfaces/IRowAction.md)\<`T`\>[]

Defined in: [src/types/shared-components/DataTable/props.ts:262](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L262)

Array of effective row actions

***

### effectiveSelectable?

> `optional` **effectiveSelectable**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:230](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L230)

Whether selection is enabled

***

### getKey()

> **getKey**: (`row`, `idx`) => `string` \| `number`

Defined in: [src/types/shared-components/DataTable/props.ts:252](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L252)

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

Defined in: [src/types/shared-components/DataTable/props.ts:246](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L246)

Callback when header is clicked for sorting

#### Parameters

##### col

[`IColumnDef`](../../column/interfaces/IColumnDef.md)\<`T`, `unknown`\>

#### Returns

`void`

***

### hasRowActions?

> `optional` **hasRowActions**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:232](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L232)

Whether row actions are present

***

### headerCheckboxRef?

> `optional` **headerCheckboxRef**: `RefObject`\<`HTMLInputElement`\>

Defined in: [src/types/shared-components/DataTable/props.ts:234](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L234)

Ref to the header checkbox for select all

***

### keysToShowRows?

> `optional` **keysToShowRows**: `ReadonlySet`\<[`Key`](../../types/type-aliases/Key.md)\>

Defined in: [src/types/shared-components/DataTable/props.ts:210](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L210)

Set of row keys to display; if provided, only these rows are shown

***

### loadingMore?

> `optional` **loadingMore**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:264](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L264)

Whether more rows are loading

***

### noHeader?

> `optional` **noHeader**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:214](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L214)

Whether to hide the header row

***

### renderRow()?

> `optional` **renderRow**: (`row`, `index`) => `ReactNode`

Defined in: [src/types/shared-components/DataTable/props.ts:260](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L260)

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

Defined in: [src/types/shared-components/DataTable/props.ts:240](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L240)

Callback to select/deselect all rows on page

#### Parameters

##### checked

`boolean`

#### Returns

`void`

***

### size?

> `optional` **size**: `"sm"` \| `"lg"`

Defined in: [src/types/shared-components/DataTable/props.ts:212](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L212)

Bootstrap size variant: 'sm' for small or 'lg' for large

***

### skeletonRows?

> `optional` **skeletonRows**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:266](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L266)

Number of skeleton rows to show

***

### someSelectedOnPage?

> `optional` **someSelectedOnPage**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:236](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L236)

Whether some rows on page are selected

***

### sortable?

> `optional` **sortable**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:220](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L220)

Whether columns are sortable (default: true)

***

### sortedRows

> **sortedRows**: readonly `T`[]

Defined in: [src/types/shared-components/DataTable/props.ts:248](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L248)

Array of sorted rows to display

***

### sortState?

> `optional` **sortState**: [`ISortState`](../../types/interfaces/ISortState.md)

Defined in: [src/types/shared-components/DataTable/props.ts:222](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L222)

Current sort state specifying column and direction

***

### startIndex

> **startIndex**: `number`

Defined in: [src/types/shared-components/DataTable/props.ts:250](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L250)

Starting index for row numbering

***

### striped?

> `optional` **striped**: `boolean`

Defined in: [src/types/shared-components/DataTable/props.ts:218](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L218)

Whether to apply striped styling to rows

***

### tableClassNames?

> `optional` **tableClassNames**: `string`

Defined in: [src/types/shared-components/DataTable/props.ts:228](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L228)

CSS classes to apply to the table

***

### tCommon()

> **tCommon**: (`key`, `options?`) => `string`

Defined in: [src/types/shared-components/DataTable/props.ts:258](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L258)

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

Defined in: [src/types/shared-components/DataTable/props.ts:256](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/props.ts#L256)

Callback to toggle row selection

#### Parameters

##### key

[`Key`](../../types/type-aliases/Key.md)

#### Returns

`void`
