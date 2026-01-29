[Admin Docs](/)

***

# Function: useDataTableFiltering()

> **useDataTableFiltering**\<`T`\>(`options`): `object`

Defined in: [src/shared-components/DataTable/hooks/useDataTableFiltering.ts:42](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/hooks/useDataTableFiltering.ts#L42)

Hook to manage DataTable filtering and search logic.

Provides controlled and uncontrolled modes for both global search and
per-column filtering. Handles client-side filtering when server flags
are not set.

## Type Parameters

### T

`T`

The row data type used in the DataTable

## Parameters

### options

[`IUseDataTableFilteringOptions`](../../../../../types/shared-components/DataTable/hooks/interfaces/IUseDataTableFilteringOptions.md)\<`T`\>

Configuration options for filtering behavior including:
  - `data` - Array of row data to filter
  - `columns` - Column definitions with filter/search metadata
  - `initialGlobalSearch` - Initial search value for uncontrolled mode
  - `globalSearch` - Controlled global search value
  - `onGlobalSearchChange` - Callback for controlled search updates
  - `columnFilters` - Column filter values by column ID
  - `onColumnFiltersChange` - Callback when column filters change
  - `serverSearch` - If true, skip client-side global search filtering
  - `serverFilter` - If true, skip client-side column filtering
  - `paginationMode` - Pagination mode affecting page reset behavior
  - `onPageReset` - Callback to reset page when filters change

## Returns

`object`

Object containing:
  - `query` - Current global search string
  - `updateGlobalSearch` - Function to update the search query
  - `filteredRows` - Array of rows after applying filters
  - `filters` - Current column filter values

### filteredRows

> **filteredRows**: `T`[]

### filters

> **filters**: `Record`\<`string`, `unknown`\>

### query

> **query**: `string`

### updateGlobalSearch()

> **updateGlobalSearch**: (`next`) => `void`

#### Parameters

##### next

`string`

#### Returns

`void`

## Example

```tsx
const { query, updateGlobalSearch, filteredRows } = useDataTableFiltering({
  data: users,
  columns: userColumns,
  initialGlobalSearch: '',
});
```
