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

Defined in: [src/types/DataGridWrapper/interface.ts:124](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L124)

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

### emptyStateMessage?

> `optional` **emptyStateMessage**: `string`

Defined in: [src/types/DataGridWrapper/interface.ts:154](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L154)

Custom message to display when there are no rows and `loading` is false.
Use `emptyStateProps` instead for full customization.
If `emptyStateProps` is provided, this prop is ignored.
This property is maintained for backward compatibility.

***

### emptyStateProps?

> `optional` **emptyStateProps**: [`InterfaceEmptyStateProps`](../../../shared-components/EmptyState/interface/interfaces/InterfaceEmptyStateProps.md)

Defined in: [src/types/DataGridWrapper/interface.ts:146](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L146)

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

Defined in: [src/types/DataGridWrapper/interface.ts:159](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L159)

Error message or component to display instead of the grid when data fetch fails.

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/types/DataGridWrapper/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L31)

If `true`, displays a loading indicator (e.g., Progress Bar) overlaying the grid.

***

### onRowClick()?

> `optional` **onRowClick**: (`row`) => `void`

Defined in: [src/types/DataGridWrapper/interface.ts:117](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L117)

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

Defined in: [src/types/DataGridWrapper/interface.ts:104](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L104)

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

Callback when search type changes in server-side mode.

##### Parameters

###### searchBy

`string`

##### Returns

`void`

#### onSearchChange()?

> `optional` **onSearchChange**: (`term`, `searchBy?`) => `void`

Callback when search changes in server-side mode.

##### Parameters

###### term

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

Search type options dropdown for server-side mode.

#### searchInputTestId?

> `optional` **searchInputTestId**: `string`

Test ID for search input.

#### searchTerm?

> `optional` **searchTerm**: `string`

Current search term value for server-side mode.

#### selectedSearchBy?

> `optional` **selectedSearchBy**: `string`

Current selected search type for server-side mode.

#### serverSide?

> `optional` **serverSide**: `boolean`

Enable server-side search mode.

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

> `optional` **onSortChange**: (`value`) => `void`

Callback when sort changes in server-side mode.

##### Parameters

###### value

`string` | `number`

##### Returns

`void`

#### selectedSort?

> `optional` **selectedSort**: `string` \| `number`

Current selected sort option for server-side mode.

#### sortingOptions?

> `optional` **sortingOptions**: `object`[]

Array of sorting options for the SortingButton component.
