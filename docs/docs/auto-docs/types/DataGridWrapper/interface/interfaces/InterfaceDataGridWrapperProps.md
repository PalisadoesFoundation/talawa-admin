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

Defined in: [src/types/DataGridWrapper/interface.ts:93](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L93)

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

Defined in: [src/types/DataGridWrapper/interface.ts:125](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L125)

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

Defined in: [src/types/DataGridWrapper/interface.ts:115](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L115)

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

Defined in: [src/types/DataGridWrapper/interface.ts:130](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L130)

Error message or component to display instead of the grid when data fetch fails.

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

Defined in: [src/types/DataGridWrapper/interface.ts:86](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L86)

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

Defined in: [src/types/DataGridWrapper/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/DataGridWrapper/interface.ts#L73)

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

#### sortingOptions?

> `optional` **sortingOptions**: `object`[]

Array of sorting options for the SortingButton component.
