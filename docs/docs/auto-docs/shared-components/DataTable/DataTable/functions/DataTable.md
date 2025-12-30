[Admin Docs](/)

***

# Function: DataTable()

> **DataTable**\<`T`\>(`props`): `Element`

Defined in: [src/shared-components/DataTable/DataTable.tsx:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/DataTable.tsx#L38)

DataTable is a generic, type-safe table component for rendering tabular data with flexible columns, loading, and error states.

## Type Parameters

### T

`T`

The type of each row in the data array.

## Parameters

### props

[`IDataTableProps`](../../../../types/shared-components/DataTable/interface/interfaces/IDataTableProps.md)\<`T`\>

The props for the DataTable component.
  - columns: Array of column definitions (id, header, accessor, optional render).
  - data: Array of data rows of type T.
  - loading: If true, shows a loading skeleton.
  - rowKey: Property name or function to uniquely identify each row.
  - emptyMessage: Message to display when data is empty.
  - error: Error object to display error state.
  - renderError: Optional function to customize error rendering.

## Returns

`Element`

The rendered table, loading, empty, or error state.
