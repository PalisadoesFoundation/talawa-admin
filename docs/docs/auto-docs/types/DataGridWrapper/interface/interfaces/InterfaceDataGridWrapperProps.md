[Admin Docs](/)

***

# Interface: InterfaceDataGridWrapperProps\<T\>

Defined in: [src/types/DataGridWrapper/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L13)

Props for the DataGridWrapper component.

This interface defines the configuration for the `DataGridWrapper`, a standardized wrapper around
MUI's DataGrid that provides consistent search, sorting, pagination, and styling across the application.

## Type Parameters

### T

`T` *extends* `GridValidRowModel` = `GridValidRowModel`

## Properties

### actionColumn()?

> `optional` **actionColumn**: (`row`) => `ReactNode`

Defined in: [src/types/DataGridWrapper/interface.ts:164](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L164)

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

Defined in: [src/types/DataGridWrapper/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L26)

Configuration for the grid columns.
Defines headers, widths, and cell rendering logic.

***

### ~~emptyStateMessage?~~

> `optional` **emptyStateMessage**: `string`

Defined in: [src/types/DataGridWrapper/interface.ts:195](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L195)

Custom message to display when there are no rows and `loading` is false.

#### Deprecated

Use `emptyStateProps` instead for full customization.

#### Remarks

If `emptyStateProps` is provided, this prop is ignored.
This property is maintained for backward compatibility.

***

### emptyStateProps?

> `optional` **emptyStateProps**: [`InterfaceEmptyStateProps`](../../../shared-components/EmptyState/interface/interfaces/InterfaceEmptyStateProps.md)

Defined in: [src/types/DataGridWrapper/interface.ts:186](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L186)

Full EmptyState component props for flexible empty state rendering.
Takes precedence over `emptyStateMessage`.
Allows customization of icon, description, action buttons, and more.

#### Example

```tsx
emptyStateProps={{
  icon: "users",
  message: "noUsers",
  description: "inviteFirstUser",
  action: {
    label: "inviteUser",
    onClick: handleInvite,
    variant: "primary"
  },
  dataTestId: "users-empty-state"
}}
```

***

### error?

> `optional` **error**: `ReactNode`

Defined in: [src/types/DataGridWrapper/interface.ts:200](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L200)

Error message or component to display instead of the grid when data fetch fails.

***

### filterConfig?

> `optional` **filterConfig**: `object`

Defined in: [src/types/DataGridWrapper/interface.ts:129](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L129)

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

Defined in: [src/types/DataGridWrapper/interface.ts:213](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L213)

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

Defined in: [src/types/DataGridWrapper/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L31)

If `true`, displays a loading indicator (e.g., Progress Bar) overlaying the grid.

***

### onRowClick()?

> `optional` **onRowClick**: (`row`) => `void`

Defined in: [src/types/DataGridWrapper/interface.ts:157](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L157)

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

Defined in: [src/types/DataGridWrapper/interface.ts:144](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L144)

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

Defined in: [src/types/DataGridWrapper/interface.ts:20](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L20)

The array of data rows to display in the grid.
Each row must include a unique `id` property (string or number).

***

### searchConfig?

> `optional` **searchConfig**: `object`

Defined in: [src/types/DataGridWrapper/interface.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L61)

Configuration for search functionality (client-side or server-side).

#### debounceMs?

> `optional` **debounceMs**: `number`

Delay in milliseconds for search debounce.

#### enabled

> **enabled**: `boolean`

Enables the search bar in the toolbar.

#### fields?

> `optional` **fields**: keyof `T` & `string`[]

The fields (keys of T) to include in the search filter. Client-side only.

#### onSearchByChange()?

> `optional` **onSearchByChange**: (`searchBy`) => `void`

Callback fired when search-by option changes.

##### Parameters

###### searchBy

`string`

##### Returns

`void`

#### onSearchChange()?

> `optional` **onSearchChange**: (`searchTerm`, `searchBy?`) => `void`

Callback fired when search term changes (for server-side search).

##### Parameters

###### searchTerm

`string`

###### searchBy?

`string`

##### Returns

`void`

#### placeholder?

> `optional` **placeholder**: `string`

Custom placeholder text for the search input.

#### searchByOptions?

> `optional` **searchByOptions**: `object`[]

Array of search-by options for the SearchFilterBar dropdown.

#### searchInputTestId?

> `optional` **searchInputTestId**: `string`

Custom test ID for the search input element.

#### searchTerm?

> `optional` **searchTerm**: `string`

Current search term value (for server-side search).

#### selectedSearchBy?

> `optional` **selectedSearchBy**: `string`

Currently selected search-by option.

#### serverSide?

> `optional` **serverSide**: `boolean`

Enable server-side search mode. When true, search is not applied client-side.

#### Example

```ts
// Client-side search
searchConfig: {
  enabled: true,
  fields: ['name', 'email'],
  placeholder: 'Search users...',
}

// Server-side search with search-by dropdown
searchConfig: {
  enabled: true,
  serverSide: true,
  searchTerm: 'john',
  searchByOptions: [
    { label: 'Group', value: 'group' },
    { label: 'Leader', value: 'leader' }
  ],
  selectedSearchBy: 'group',
  onSearchChange: (term, searchBy) => refetchData(term, searchBy),
  onSearchByChange: (searchBy) => setSearchBy(searchBy),
  searchInputTestId: 'searchByInput'
}
```

***

### sortConfig?

> `optional` **sortConfig**: `object`

Defined in: [src/types/DataGridWrapper/interface.ts:90](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L90)

Configuration for sorting options displayed in a dropdown.
Note: This is separate from MUI DataGrid's native column header sorting.

#### defaultSortField?

> `optional` **defaultSortField**: `string`

#### defaultSortOrder?

> `optional` **defaultSortOrder**: `"desc"` \| `"asc"`

#### onSortChange()?

> `optional` **onSortChange**: (`sortValue`) => `void`

Callback fired when sort option changes.

##### Parameters

###### sortValue

`string` | `number`

##### Returns

`void`

#### selectedSort?

> `optional` **selectedSort**: `string` \| `number`

Currently selected sort value (for controlled mode).

#### sortFunction()?

> `optional` **sortFunction**: (`rows`, `sortValue`) => readonly `T`[]

Custom sorting function to apply when a sort option is selected.
If provided, this function will be used instead of MUI DataGrid's default sorting.
The sort value is passed as a string in the format "field_direction" (e.g., "volunteers_asc").

##### Parameters

###### rows

readonly `T`[]

###### sortValue

`string` | `number`

##### Returns

readonly `T`[]

#### sortingOptions?

> `optional` **sortingOptions**: `object`[]

Array of sorting options for the SortingButton component.
