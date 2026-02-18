[Admin Docs](/)

***

# Function: DataTableSkeleton()

> **DataTableSkeleton**\<`T`\>(`props`): `Element`

Defined in: [src/shared-components/DataTable/DataTableSkeleton.tsx:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/DataTableSkeleton.tsx#L32)

DataTableSkeleton component that displays a loading skeleton matching the table layout.

Renders a responsive table structure with skeleton cells for each column and row,
including optional selection checkbox and actions columns. The skeleton respects
the column definitions to ensure consistent layout during data loading.

## Type Parameters

### T

`T`

## Parameters

### props

[`InterfaceDataTableSkeletonProps`](../../../../types/shared-components/DataTable/props/interfaces/InterfaceDataTableSkeletonProps.md)\<`T`\>

The component props (`InterfaceDataTableSkeletonProps<T>`):
  - ariaLabel: Optional accessible label
  - columns: Column definitions determining structure
  - effectiveSelectable: Whether to show selection checkbox
  - hasRowActions: Whether to show actions column
  - skeletonRows: Number of skeleton rows to display
  - tableClassNames: CSS class names for the table

## Returns

`Element`

The rendered skeleton table component
