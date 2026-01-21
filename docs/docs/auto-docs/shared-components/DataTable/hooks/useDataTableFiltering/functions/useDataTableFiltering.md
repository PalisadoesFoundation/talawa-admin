[Admin Docs](/)

***

# Function: useDataTableFiltering()

> **useDataTableFiltering**\<`T`\>(`options`): `object`

Defined in: [src/shared-components/DataTable/hooks/useDataTableFiltering.ts:45](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/hooks/useDataTableFiltering.ts#L45)

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

[`IUseDataTableFilteringOptions`](../../../../../types/shared-components/DataTable/interface/interfaces/IUseDataTableFilteringOptions.md)\<`T`\>

Configuration options for filtering behavior

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
