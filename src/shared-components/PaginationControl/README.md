# PaginationControl Component

A standardized, accessible pagination component that replaces inconsistent pagination patterns across Talawa Admin.

## Overview

`PaginationControl` provides a consistent pagination interface with:
- Page navigation buttons (first, previous, next, last)
- Current page indicator
- Customizable "rows per page" selector
- Item range display ("Showing X-Y of Z")
- Full keyboard navigation support
- Complete accessibility (ARIA labels, screen reader support)
- Responsive mobile design

## Replaces

This component replaces the following deprecated patterns:
- `paginationModel` / `onPaginationModelChange` (MUI DataGrid)
- `<Pagination>` component (MUI Pagination)
- `PaginationList` component
- Custom "Rows per page" implementations

## Installation

The component is available as a shared component:

```typescript
import { PaginationControl } from 'shared-components/PaginationControl/PaginationControl';
import type { InterfacePaginationControlProps } from 'types/shared-components/PaginationControl/interface';
```

## Basic Usage

```typescript
import React, { useState } from 'react';
import { PaginationControl } from 'shared-components/PaginationControl/PaginationControl';

function UserListScreen() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const totalItems = 247; // From your data source

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div>
      {/* Your data display */}
      <UserTable data={paginatedData} />

      {/* Pagination control */}
      <PaginationControl
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1); // Reset to first page when changing page size
        }}
      />
    </div>
  );
}
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `currentPage` | `number` | Current active page (1-indexed: 1, 2, 3...) |
| `totalPages` | `number` | Total number of pages available |
| `pageSize` | `number` | Number of items displayed per page |
| `totalItems` | `number` | Total number of items across all pages |
| `onPageChange` | `(page: number) => void` | Callback when page changes. Receives new page number (1-indexed) |
| `onPageSizeChange` | `(size: number) => void` | Callback when page size changes. Receives new page size |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pageSizeOptions` | `number[]` | `[10, 25, 50, 100]` | Available page size options in the dropdown |
| `disabled` | `boolean` | `false` | Disables all pagination controls (useful during loading) |

## Keyboard Navigation

The component supports full keyboard navigation:

| Key | Action |
|-----|--------|
| `←` (Arrow Left) | Go to previous page |
| `→` (Arrow Right) | Go to next page |
| `Home` | Go to first page |
| `End` | Go to last page |
| `Tab` | Navigate between controls |

## Accessibility

The component is fully accessible:

-  **ARIA labels** on all buttons and controls
-  **Live regions** announce page changes to screen readers
-  **Keyboard navigation** works without a mouse
-  **Focus indicators** for keyboard users
-  **Disabled states** properly communicated
-  **Semantic HTML** with proper roles

## Edge Cases

The component handles all edge cases gracefully:

### Empty Data
```typescript
<PaginationControl
  currentPage={1}
  totalPages={0}
  pageSize={25}
  totalItems={0}
  onPageChange={handlePageChange}
  onPageSizeChange={handlePageSizeChange}
/>
// Displays: "No items to display"
```

### Single Page
```typescript
<PaginationControl
  currentPage={1}
  totalPages={1}
  pageSize={25}
  totalItems={5}
  onPageChange={handlePageChange}
  onPageSizeChange={handlePageSizeChange}
/>
// All navigation buttons disabled
```

### Last Page with Partial Items
```typescript
// 247 items, 25 per page, on page 10
// Shows: "Showing 226-247 of 247"
```

## Migration Guide

### From MUI DataGrid Pagination

**Before:**
```typescript
const [paginationModel, setPaginationModel] = useState({
  page: 0,
  pageSize: 25,
});

<DataGrid
  paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  // ...
/>
```

**After:**
```typescript
const [currentPage, setCurrentPage] = useState(1); // 1-indexed
const [pageSize, setPageSize] = useState(25);

// Your data fetching logic here

<PaginationControl
  currentPage={currentPage}
  totalPages={Math.ceil(totalItems / pageSize)}
  pageSize={pageSize}
  totalItems={totalItems}
  onPageChange={setCurrentPage}
  onPageSizeChange={(size) => {
    setPageSize(size);
    setCurrentPage(1);
  }}
/>
```

### From PaginationList Component

**Before:**
```typescript
const [page, setPage] = useState(0); // 0-indexed

<PaginationList
  count={users.length}
  rowsPerPage={rowsPerPage}
  page={page}
  onPageChange={(e, newPage) => setPage(newPage)}
  onRowsPerPageChange={(e) => setRowsPerPage(Number(e.target.value))}
/>
```

**After:**
```typescript
const [currentPage, setCurrentPage] = useState(1); // 1-indexed

<PaginationControl
  currentPage={currentPage}
  totalPages={Math.ceil(users.length / pageSize)}
  pageSize={pageSize}
  totalItems={users.length}
  onPageChange={setCurrentPage}
  onPageSizeChange={setPageSize}
/>
```

## Styling

The component uses CSS modules and can be customized via the CSS file:
- `src/shared-components/PaginationControl/PaginationControl.module.css`

The component is fully responsive and adapts to mobile screens automatically.

## Testing

The component has >90% test coverage. See test file for examples:
- `src/shared-components/PaginationControl/PaginationControl.spec.tsx`

## Common Patterns

### Pattern 1: Reset to First Page on Filter Change

```typescript
const handleFilterChange = (newFilter: string) => {
  setFilter(newFilter);
  setCurrentPage(1); // Always reset to first page
};
```

### Pattern 2: Persist Pagination State

```typescript
// Using localStorage
useEffect(() => {
  localStorage.setItem('pageSize', String(pageSize));
}, [pageSize]);

// Using URL params (recommended)
const [searchParams, setSearchParams] = useSearchParams();
```

### Pattern 3: Loading State

```typescript
<PaginationControl
  currentPage={currentPage}
  totalPages={totalPages}
  pageSize={pageSize}
  totalItems={totalItems}
  onPageChange={setCurrentPage}
  onPageSizeChange={setPageSize}
  disabled={isLoading} // Disable during loading
/>
```
## Related

- **Issue**: [#5293](https://github.com/PalisadoesFoundation/talawa-admin/issues/5293)
- **Type Definition**: `src/types/shared-components/PaginationControl/interface.ts`
- **Linter**: `scripts/githooks/check-pagination-patterns.ts`

## Support

For issues or questions:
1. Check this documentation
2. Review the test file for examples
3. Open an issue on GitHub