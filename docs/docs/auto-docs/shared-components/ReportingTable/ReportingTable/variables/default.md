[Admin Docs](/)

***

# Variable: default

> `const` **default**: `React.FC`\<[`ReportingTableProps`](../../../../types/ReportingTable/interface/type-aliases/ReportingTableProps.md)\>

Defined in: [src/shared-components/ReportingTable/ReportingTable.tsx:84](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/ReportingTable/ReportingTable.tsx#L84)

A flexible reporting table component that wraps MUI DataGrid with optional infinite scroll.

## Remarks

This component provides a consistent table interface across the application with support for:
- Standard DataGrid rendering for static data
- Infinite scroll wrapper for paginated/lazy-loaded data
- Customizable grid and scroll container properties
- Compact column mode for tables with many columns (7+)

## Param

Array of data rows to display in the table

## Param

Column definitions following ReportingTableColumn structure

## Param

Optional additional props passed directly to MUI DataGrid

## Param

When provided, enables infinite scroll with dataLength, next, and hasMore

## Param

Optional styling and behavior props for the InfiniteScroll container

## Returns

A DataGrid wrapped in InfiniteScroll if infiniteProps is provided, otherwise a standalone DataGrid

## Example

```tsx
// Basic usage without infinite scroll
<ReportingTable rows={data} columns={columnDefs} />

// With infinite scroll
<ReportingTable
  rows={displayedRows}
  columns={columnDefs}
  infiniteProps={{
    dataLength: displayedRows.length,
    next: loadMoreData,
    hasMore: hasMoreData
  }}
/>
```
