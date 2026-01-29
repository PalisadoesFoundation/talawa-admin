[Admin Docs](/)

***

# Interface: IColumnDef\<T, TValue\>

Defined in: [src/types/shared-components/DataTable/column.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/column.ts#L13)

Column definition for DataTable.

Specifies how a column should render, behave, and interact with sorting, filtering,
and searching. Each column maps to a specific property or accessor within row data.

## Type Parameters

### T

`T`

The type of data for each row in the table

### TValue

`TValue` = `unknown`

The type of the value extracted by the accessor (defaults to unknown)

## Properties

### accessor

> **accessor**: [`Accessor`](../../types/type-aliases/Accessor.md)\<`T`, `TValue`\>

Defined in: [src/types/shared-components/DataTable/column.ts:19](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/column.ts#L19)

Accessor function or key to extract the value from row data

***

### header

> **header**: [`HeaderRender`](../../types/type-aliases/HeaderRender.md)

Defined in: [src/types/shared-components/DataTable/column.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/column.ts#L17)

Column header text or React component to render

***

### id

> **id**: `string`

Defined in: [src/types/shared-components/DataTable/column.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/column.ts#L15)

Unique identifier for this column

***

### meta?

> `optional` **meta**: `object`

Defined in: [src/types/shared-components/DataTable/column.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/column.ts#L32)

Metadata and configuration for column behavior.

#### align?

> `optional` **align**: `"center"` \| `"left"` \| `"right"`

Text alignment for cell content ('left', 'center', or 'right')

#### ariaLabel?

> `optional` **ariaLabel**: `string`

ARIA label for accessibility when header content is not descriptive

#### filterable?

> `optional` **filterable**: `boolean`

Whether this column supports filtering (default: false)

#### filterFn()?

> `optional` **filterFn**: (`row`, `value`) => `boolean`

Custom filter predicate to match rows against a filter value.

##### Parameters

###### row

`T`

Row to evaluate

###### value

`unknown`

Filter value to match against

##### Returns

`boolean`

true if row matches the filter

#### getSearchValue()?

> `optional` **getSearchValue**: (`row`) => `string`

Custom function to extract searchable text from a row.
Used when performing global search on this column.

##### Parameters

###### row

`T`

Row data to extract search value from

##### Returns

`string`

String representation for search matching

#### searchable?

> `optional` **searchable**: `boolean`

Whether this column is included in global search (default: false)

#### sortable?

> `optional` **sortable**: `boolean`

Whether this column supports sorting (default: true)

#### sortFn()?

> `optional` **sortFn**: (`a`, `b`) => `number`

Custom comparator function for sorting this column.

##### Parameters

###### a

`T`

First row for comparison

###### b

`T`

Second row for comparison

##### Returns

`number`

Negative if a \< b, 0 if equal, positive if a \> b

#### width?

> `optional` **width**: `string` \| `number`

CSS width for this column (e.g., '100px', '20%')

***

### render()?

> `optional` **render**: (`value`, `row`) => `ReactNode`

Defined in: [src/types/shared-components/DataTable/column.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/column.ts#L28)

Optional custom render function for cell values.
Receives the extracted value and the full row data.

#### Parameters

##### value

`TValue`

The value extracted by the accessor

##### row

`T`

The complete row data object

#### Returns

`ReactNode`

React node to render in the cell
