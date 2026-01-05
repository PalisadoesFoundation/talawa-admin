[Admin Docs](/)

***

# Interface: InterfaceDataGridWrapperProps\<T\>

Defined in: [src/types/DataGridWrapper/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L15)

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

Defined in: [src/types/DataGridWrapper/interface.ts:133](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L133)

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

Defined in: [src/types/DataGridWrapper/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L28)

Configuration for the grid columns.
Defines headers, widths, and cell rendering logic.

***

### ~~emptyStateMessage?~~

> `optional` **emptyStateMessage**: `string`

Defined in: [src/types/DataGridWrapper/interface.ts:165](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L165)

Custom message to display when there are no rows and `loading` is false.

#### Deprecated

Use `emptyStateProps` instead for full customization.

#### Default

```ts
"No results found" (localized)
```

#### Remarks

If `emptyStateProps` is provided, this prop is ignored.
This property is maintained for backward compatibility.

***

### emptyStateProps?

> `optional` **emptyStateProps**: [`InterfaceEmptyStateProps`](../../../shared-components/EmptyState/interface/interfaces/InterfaceEmptyStateProps.md)

Defined in: [src/types/DataGridWrapper/interface.ts:155](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L155)

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

Defined in: [src/types/DataGridWrapper/interface.ts:170](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L170)

Error message or component to display instead of the grid when data fetch fails.

***

### filterConfig?

> `optional` **filterConfig**: `object`

Defined in: [src/types/DataGridWrapper/interface.ts:98](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L98)

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

Defined in: [src/types/DataGridWrapper/interface.ts:183](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L183)

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

Defined in: [src/types/DataGridWrapper/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L34)

If `true`, displays a loading indicator (e.g., Progress Bar) overlaying the grid.

#### Default

```ts
false
```

***

### onRowClick()?

> `optional` **onRowClick**: (`row`) => `void`

Defined in: [src/types/DataGridWrapper/interface.ts:126](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L126)

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

Defined in: [src/types/DataGridWrapper/interface.ts:113](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L113)

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

Defined in: [src/types/DataGridWrapper/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L22)

The array of data rows to display in the grid.
Each row must include a unique `id` property (string or number).

***

### searchConfig?

> `optional` **searchConfig**: `object`

Defined in: [src/types/DataGridWrapper/interface.ts:48](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L48)

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

Defined in: [src/types/DataGridWrapper/interface.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L63)

Configuration for sorting options displayed in a dropdown.
Note: This is separate from MUI DataGrid's native column header sorting.

#### defaultSortField?

> `optional` **defaultSortField**: `string`

#### defaultSortOrder?

> `optional` **defaultSortOrder**: `"desc"` \| `"asc"`

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
