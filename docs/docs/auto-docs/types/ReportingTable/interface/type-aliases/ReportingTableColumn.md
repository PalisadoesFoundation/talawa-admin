[Admin Docs](/)

***

# Type Alias: ReportingTableColumn

> **ReportingTableColumn** = `Partial`\<`GridColDef`\> & `object`

Defined in: [src/types/ReportingTable/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ReportingTable/interface.ts#L15)

ReportingTableColumnDef
App-level column shape used across the app. It's a thin composition over
MUI's `GridColDef` exposing the props we use commonly in screen files.

## Type Declaration

### align?

> `optional` **align**: `"left"` \| `"center"` \| `"right"`

Alignment for the column content

### field

> **field**: `string`

Unique field id for the column (required)

### flex?

> `optional` **flex**: `number`

Flex grow for the column

### headerAlign?

> `optional` **headerAlign**: `"left"` \| `"center"` \| `"right"`

Alignment for the column header

### headerClassName?

> `optional` **headerClassName**: `string`

Additional class applied to the header cell

### headerName?

> `optional` **headerName**: `string`

Header name for the column

### minWidth?

> `optional` **minWidth**: `number`

Minimum width for the column

### renderCell()?

> `optional` **renderCell**: (`params`) => `ReactNode`

Custom renderer for the cell

#### Parameters

##### params

`ReportingCellParams`

#### Returns

`ReactNode`

### sortable?

> `optional` **sortable**: `boolean`

Whether the column is sortable

### valueGetter()?

> `optional` **valueGetter**: (`value`, `row`, `column`, `apiRef`) => `unknown`

Custom value getter for the cell

#### Parameters

##### value

`unknown`

##### row

[`ReportingRow`](ReportingRow.md)

##### column

`GridColDef`

##### apiRef

`unknown`

#### Returns

`unknown`
