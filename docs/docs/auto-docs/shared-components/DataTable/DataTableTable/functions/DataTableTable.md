[Admin Docs](/)

***

# Function: DataTableTable()

> **DataTableTable**\<`T`\>(`props`): `Element`

Defined in: [src/shared-components/DataTable/DataTableTable.tsx:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/DataTableTable.tsx#L60)

DataTableTable component for rendering the core table structure.

Renders the HTML table with headers, rows, selection checkboxes, sorting indicators,
and action cells. Handles user interactions for sorting, row selection, and displays
loading states during pagination. Includes sorting UI, selection controls, and action cells.

## Type Parameters

### T

`T`

## Parameters

### props

[`InterfaceDataTableTableProps`](../../../../types/shared-components/DataTable/props/interfaces/InterfaceDataTableTableProps.md)\<`T`\>

The component props (`InterfaceDataTableTableProps<T>`):
  Table structure (columns, sortedRows, ariaLabel, tableClassNames)
  Sorting (activeSortBy, activeSortDir, handleHeaderClick)
  Selection (effectiveSelectable, currentSelection, toggleRowSelection, headerCheckboxRef, selectAllOnPage, someSelectedOnPage, allSelectedOnPage)
  Rendering (renderRow, getKey, startIndex)
  Actions (hasRowActions, effectiveRowActions)
  Loading (loadingMore, skeletonRows, ariaBusy)
  Utilities (tCommon)

## Returns

`Element`

The rendered table JSX element with headers, rows, and optional loading indicators
