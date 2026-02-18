[Admin Docs](/)

***

# Function: LoadingMoreRows()

> **LoadingMoreRows**\<`T`\>(`props`): `Element`

Defined in: [src/shared-components/DataTable/LoadingMoreRows.tsx:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/LoadingMoreRows.tsx#L29)

LoadingMoreRows component that displays skeleton rows appended to a table.

Renders placeholder rows with skeleton cells to indicate data is being loaded,
matching the table structure with optional selection checkboxes and actions columns.
Useful for infinite scroll or "load more" pagination patterns.

## Type Parameters

### T

`T`

## Parameters

### props

[`InterfaceLoadingMoreRowsProps`](../../../../types/shared-components/DataTable/props/interfaces/InterfaceLoadingMoreRowsProps.md)\<`T`\>

The component props (`InterfaceLoadingMoreRowsProps<T>`):
  - columns: Column definitions determining structure
  - effectiveSelectable: Whether to show selection checkbox column
  - hasRowActions: Whether to show actions column
  - skeletonRows: Number of skeleton rows to display

## Returns

`Element`

A fragment containing skeleton table rows
