[Admin Docs](/)

***

# Interface: InterfaceDataGridWrapperProps\<T\>

Defined in: [src/types/DataGridWrapper/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L14)

Props for the DataGridWrapper component.

This interface defines the configuration for the `DataGridWrapper`, a standardized wrapper around
MUI's DataGrid that provides consistent search, sorting, pagination, and styling across the application.

## Type Parameters

### T

`T` *extends* `GridValidRowModel` = `GridValidRowModel`

The type of the row data. Must extend `GridValidRowModel` (typically requires an `id` property).

## Properties

### actionColumn()?

> `optional` **actionColumn**: (`row`) => `ReactNode`

Defined in: [src/types/DataGridWrapper/interface.ts:123](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L123)

A function to render custom content in the "Actions" column (appended to the right).

#### Parameters

##### row

`T`

The data object for the row being rendered.

#### Returns

`ReactNode`

A ReactNode (e.g., buttons, menu) to display in the actions cell.

***

### columns?

> `optional` **columns**: `GridColDef`[]

Defined in: [src/types/DataGridWrapper/interface.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L27)

Configuration for the grid columns.
Defines headers, widths, and cell rendering logic.

***

### emptyStateMessage?

> `optional` **emptyStateMessage**: `string`

Defined in: [src/types/DataGridWrapper/interface.ts:129](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L129)

Custom message to display when there are no rows and `loading` is false.

#### Default

```ts
"No results found" (localized)
```

***

### error?

> `optional` **error**: `ReactNode`

Defined in: [src/types/DataGridWrapper/interface.ts:134](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L134)

Error message or component to display instead of the grid when data fetch fails.

***

### filterConfig?

> `optional` **filterConfig**: `object`

Defined in: [src/types/DataGridWrapper/interface.ts:88](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L88)

Configuration for filtering options displayed in a dropdown.
Enables client-side filtering with custom filter functions.

#### defaultFilter?

> `optional` **defaultFilter**: `string` \| `number`

Default filter value to apply on component mount.

#### filterFunction()?

> `optional` **filterFunction**: (`rows`, `filterValue`) => readonly `T`[]

Custom filter function to apply to rows based on selected filter value.

##### Parameters

###### rows

readonly `T`[]

###### filterValue

`string` | `number`

##### Returns

readonly `T`[]

#### filterOptions?

> `optional` **filterOptions**: `object`[]

Array of filter options for the filter dropdown.

#### Example

```ts
filterConfig: {
  filterOptions: [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ],
  filterFunction: (rows, filterValue) => {
    if (filterValue === 'all') return rows;
    return rows.filter(row => row.status === filterValue);
  }
}
```

***

### headerButton?

> `optional` **headerButton**: `ReactNode`

Defined in: [src/types/DataGridWrapper/interface.ts:147](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L147)

Optional custom button or element to display in the toolbar (typically for actions like "Create New").

#### Example

```tsx
headerButton={
  <Button onClick={handleCreate}>
    Create New
  </Button>
}
```

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/types/DataGridWrapper/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L33)

If `true`, displays a loading indicator (e.g., Progress Bar) overlaying the grid.

#### Default

```ts
false
```

***

### onRowClick()?

> `optional` **onRowClick**: (`row`) => `void`

Defined in: [src/types/DataGridWrapper/interface.ts:116](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L116)

Callback fired when a row is clicked.

#### Parameters

##### row

`T`

The data object of the clicked row.

#### Returns

`void`

***

### paginationConfig?

> `optional` **paginationConfig**: `object`

Defined in: [src/types/DataGridWrapper/interface.ts:103](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L103)

Configuration for pagination.

#### defaultPageSize?

> `optional` **defaultPageSize**: `number`

The default number of rows per page.

#### enabled

> **enabled**: `boolean`

Enables pagination controls.

#### pageSizeOptions?

> `optional` **pageSizeOptions**: `number`[]

Available options for rows per page. default: [10, 25, 50, 100]

***

### rows?

> `optional` **rows**: readonly `T`[]

Defined in: [src/types/DataGridWrapper/interface.ts:21](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L21)

The array of data rows to display in the grid.
Each row must include a unique `id` property (string or number).

***

### searchConfig?

> `optional` **searchConfig**: `object`

Defined in: [src/types/DataGridWrapper/interface.ts:47](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L47)

Configuration for client-side search functionality.

#### debounceMs?

> `optional` **debounceMs**: `number`

Delay in milliseconds for search debounce (if implemented).

#### enabled

> **enabled**: `boolean`

Enables the search bar in the toolbar.

#### fields

> **fields**: keyof `T` & `string`[]

The fields (keys of T) to include in the search filter.

#### placeholder?

> `optional` **placeholder**: `string`

Custom placeholder text for the search input.

#### Example

```ts
searchConfig: {
  enabled: true,
  fields: ['name', 'email'],
  placeholder: 'Search users...',
}
```

***

### sortConfig?

> `optional` **sortConfig**: `object`

Defined in: [src/types/DataGridWrapper/interface.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L62)

Configuration for sorting options displayed in a dropdown.
Note: This is separate from MUI DataGrid's native column header sorting.

#### defaultSortField?

> `optional` **defaultSortField**: `string`

#### defaultSortOrder?

> `optional` **defaultSortOrder**: `"desc"` \| `"asc"`

#### sortingOptions?

> `optional` **sortingOptions**: `object`[]

Array of sorting options for the SortingButton component.
