---
id: data-grid-wrapper
title: DataGridWrapper Component
slug: /developer-resources/data-grid-wrapper
sidebar_position: 37
---

## Overview

The `DataGridWrapper` is a standardized, reusable component that wraps Material-UI's `DataGrid` to provide consistent table functionality across the Talawa Admin application. It includes built-in support for search, sorting, pagination, loading states, and error handling.

**Key Features:**

- Integrated search with configurable fields
- Flexible sorting with custom options
- Built-in pagination controls
- Custom loading states and error handling
- Action column support
- Fully type-safe with TypeScript generics
- i18n ready

**Why Use DataGridWrapper:**

- **Consistency:** Ensures all data grids across the application have uniform behavior and appearance
- **Policy Enforcement:** The linter prevents direct `@mui/x-data-grid` imports in `src/screens/**`, enforcing use of this wrapper
- **Reduced Boilerplate:** Common features like search and pagination are pre-integrated
- **Maintainability:** Changes to grid behavior can be made in one place

## Component Location

```text
src/shared-components/DataGridWrapper/
  ├── DataGridWrapper.tsx
  ├── DataGridWrapper.spec.tsx
  ├── DataGridWrapper.module.css
  ├── DataGridLoadingOverlay.tsx
  └── DataGridErrorOverlay.tsx
```

**Type Definitions:**

```text
src/types/DataGridWrapper/interface.ts
```

## Quick Start

### Basic Usage

```tsx
import { DataGridWrapper } from 'src/shared-components/DataGridWrapper/DataGridWrapper';
import type { GridColDef } from '@mui/x-data-grid';

type User = { id: string; name: string; email: string };

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 250 },
];

const users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
];

<DataGridWrapper<User>
  rows={users}
  columns={columns}
/>
```

## Component API

### Props Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `rows` | `GridRowsProp<T>` | Yes | - | Array of data rows. Each row must have a unique `id` property |
| `columns` | `GridColDef[]` | Yes | - | Column configuration defining headers, widths, and rendering |
| `loading` | `boolean` | No | `false` | Shows loading overlay when `true` |
| `searchConfig` | `SearchConfig<T>` | No | - | Configuration for search functionality |
| `sortConfig` | `SortConfig` | No | - | Configuration for sorting options |
| `paginationConfig` | `PaginationConfig` | No | - | Configuration for pagination |
| `onRowClick` | `(row: T) => void` | No | - | Callback fired when a row is clicked |
| `actionColumn` | `(row: T) => ReactNode` | No | - | Render function for custom actions column |
| `emptyStateProps` | `InterfaceEmptyStateProps` | No | - | Full customization of empty state with icon, description, and actions. Takes precedence over `emptyStateMessage` |
| `emptyStateMessage` | `string` | No | "No results found" | Message shown when no rows are available |
| `error` | `string \| ReactNode` | No | - | Error message or component to display |


### SearchConfig

```typescript
interface SearchConfig<T> {
  /** Enable the search bar */
  enabled: boolean;
  /** Fields to search across */
  fields: Array<keyof T & string>;
  /** Custom placeholder text */
  placeholder?: string;
  /** Debounce delay in milliseconds */
  debounceMs?: number;
}
```

### SortConfig

```typescript
interface SortConfig {
  /** Default field to sort by */
  defaultSortField?: string;
  /** Default sort direction */
  defaultSortOrder?: 'asc' | 'desc';
  /** Array of sorting options */
  sortingOptions?: Array<{
    label: string;
    value: string | number;
  }>;
}
```

### PaginationConfig

```typescript
interface PaginationConfig {
  /** Enable pagination */
  enabled: boolean;
  /** Default number of rows per page */
  defaultPageSize?: number;
  /** Available page size options */
  pageSizeOptions?: number[];
}
```

## Usage Examples


### With Custom Empty State

```tsx
<DataGridWrapper<User>
  rows={users}
  columns={columns}
  emptyStateProps={{
    icon: 'users',
    message: 'noUsersFound',
    description: 'inviteFirstUser',
    action: {
      label: 'inviteUser',
      onClick: handleInvite,
      variant: 'primary'
    },
    dataTestId: 'users-empty-state'
  }}
/>
```

### WithSearch

```tsx
<DataGridWrapper<User>
  rows={users}
  columns={columns}
  searchConfig={{
    enabled: true,
    fields: ['name', 'email'],
    placeholder: 'Search users...',
  }}
/>
```

The search performs case-insensitive filtering across all specified fields.

### With Sorting

```tsx
<DataGridWrapper<User>
  rows={users}
  columns={columns}
  sortConfig={{
    defaultSortField: 'name',
    defaultSortOrder: 'asc',
    sortingOptions: [
      { label: 'Name (A-Z)', value: 'name_asc' },
      { label: 'Name (Z-A)', value: 'name_desc' },
      { label: 'Email (A-Z)', value: 'email_asc' },
      { label: 'Email (Z-A)', value: 'email_desc' },
    ],
  }}
/>
```

### With Pagination

```tsx
<DataGridWrapper<User>
  rows={users}
  columns={columns}
  paginationConfig={{
    enabled: true,
    defaultPageSize: 25,
    pageSizeOptions: [10, 25, 50, 100],
  }}
/>
```

### With Loading State

```tsx
const { data, loading } = useQuery(GET_USERS);

<DataGridWrapper<User>
  rows={data?.users || []}
  columns={columns}
  loading={loading}
/>
```

The component displays a custom loading overlay using the `LoadingState` component.

### With Error Handling

```tsx
const { data, loading, error } = useQuery(GET_USERS);

<DataGridWrapper<User>
  rows={data?.users || []}
  columns={columns}
  loading={loading}
  error={error ? 'Failed to load users. Please try again.' : undefined}
/>
```

The error state is displayed using a custom error overlay component (`DataGridErrorOverlay`) that appears in place of the data grid, providing a consistent UX with the loading and empty states. The overlay includes an error icon and message, with proper accessibility attributes (`role="alert"`, `aria-live="assertive"`).

> [!NOTE]
> The error overlay uses the DataGrid's `slots` API for consistency. When an error is present, it takes precedence over the empty state overlay.

### With Action Column

```tsx
import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

<DataGridWrapper<User>
  rows={users}
  columns={columns}
  actionColumn={(row) => (
    <>
      <IconButton onClick={() => handleEdit(row.id)} aria-label="Edit user">
        <Edit />
      </IconButton>
      <IconButton onClick={() => handleDelete(row.id)} aria-label="Delete user">
        <Delete />
      </IconButton>
    </>
  )}
/>
```

### With Row Click Handler

```tsx
<DataGridWrapper<User>
  rows={users}
  columns={columns}
  onRowClick={(row) => {
    navigate(`/admin/users/${row.id}`);
  }}
/>
```

### Complete Example

```tsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { DataGridWrapper } from 'src/shared-components/DataGridWrapper/DataGridWrapper';
import { GET_USERS } from 'src/GraphQl/Queries/Queries';
import type { GridColDef } from '@mui/x-data-grid';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export const UsersScreen = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_USERS);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'role', headerName: 'Role', width: 150 },
  ];

  return (
    <DataGridWrapper<User>
      rows={data?.users || []}
      columns={columns}
      loading={loading}
      error={error ? 'Failed to load users' : undefined}
      searchConfig={{
        enabled: true,
        fields: ['name', 'email', 'role'],
        placeholder: 'Search users by name, email, or role...',
      }}
      sortConfig={{
        defaultSortField: 'name',
        defaultSortOrder: 'asc',
        sortingOptions: [
          { label: 'Name (A-Z)', value: 'name_asc' },
          { label: 'Name (Z-A)', value: 'name_desc' },
          { label: 'Email (A-Z)', value: 'email_asc' },
          { label: 'Email (Z-A)', value: 'email_desc' },
        ],
      }}
      paginationConfig={{
        enabled: true,
        defaultPageSize: 25,
        pageSizeOptions: [10, 25, 50, 100],
      }}
      onRowClick={(row) => navigate(`/admin/users/${row.id}`)}
      emptyStateMessage="No users found"
    />
  );
};
```

## Migration Guide

### From Direct DataGrid Usage

If you're currently using `@mui/x-data-grid` directly in `src/screens/**`, follow these steps to migrate:

#### Step 1: Replace Import

**Before:**
```tsx
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
```

**After:**
```tsx
import { DataGridWrapper } from 'src/shared-components/DataGridWrapper/DataGridWrapper';
import type { GridColDef } from '@mui/x-data-grid';
```

#### Step 2: Update Component Usage

**Before:**
```tsx
<DataGrid
  rows={users}
  columns={columns}
  loading={loading}
  pageSize={25}
  rowsPerPageOptions={[10, 25, 50]}
  onRowClick={(params) => handleRowClick(params.row)}
/>
```

**After:**
```tsx
<DataGridWrapper<User>
  rows={users}
  columns={columns}
  loading={loading}
  paginationConfig={{
    enabled: true,
    defaultPageSize: 25,
    pageSizeOptions: [10, 25, 50],
  }}
  onRowClick={(row) => handleRowClick(row)}
/>
```

#### Step 3: Move Search Logic

If you have custom search logic:

**Before:**
```tsx
const [searchTerm, setSearchTerm] = useState('');
const filteredUsers = users.filter(u => 
  u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  u.email.toLowerCase().includes(searchTerm.toLowerCase())
);

<>
  <input
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search..."
  />
  <DataGrid rows={filteredUsers} columns={columns} />
</>
```

**After:**
```tsx
<DataGridWrapper<User>
  rows={users}
  columns={columns}
  searchConfig={{
    enabled: true,
    fields: ['name', 'email'],
    placeholder: 'Search...',
  }}
/>
```

#### Step 4: Move Sorting Logic

If you have custom sorting:

**Before:**
```tsx
const [sortModel, setSortModel] = useState([
  { field: 'name', sort: 'asc' }
]);

<DataGrid
  rows={users}
  columns={columns}
  sortModel={sortModel}
  onSortModelChange={setSortModel}
/>
```

**After:**
```tsx
<DataGridWrapper<User>
  rows={users}
  columns={columns}
  sortConfig={{
    defaultSortField: 'name',
    defaultSortOrder: 'asc',
    sortingOptions: [
      { label: 'Name (A-Z)', value: 'name_asc' },
      { label: 'Name (Z-A)', value: 'name_desc' },
    ],
  }}
/>
```

### Common Migration Patterns

#### Pattern 1: Empty State Handling

**Before:**
```tsx
{users.length === 0 && !loading ? (
  <div>No users found</div>
) : (
  <DataGrid rows={users} columns={columns} />
)}
```

**After:**
```tsx
<DataGridWrapper<User>
  rows={users}
  columns={columns}
  emptyStateMessage="No users found"
/>
```

#### Pattern 2: Error Handling

**Before:**
```tsx
{error ? (
  <div>Error: {error.message}</div>
) : (
  <DataGrid rows={users} columns={columns} />
)}
```

**After:**
```tsx
<DataGridWrapper<User>
  rows={users}
  columns={columns}
  error={error ? error.message : undefined}
/>
```

The error now displays as an overlay within the DataGrid using the `slots` API, providing a consistent experience with the loading and empty states.

#### Pattern 3: Action Buttons

**Before:**
```tsx
const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name' },
  {
    field: 'actions',
    headerName: 'Actions',
    renderCell: (params) => (
      <button onClick={() => handleEdit(params.row)}>Edit</button>
    ),
  },
];
```

**After:**
```tsx
const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name' },
];

<DataGridWrapper<User>
  rows={users}
  columns={columns}
  actionColumn={(row) => (
    <button onClick={() => handleEdit(row)}>Edit</button>
  )}
/>
```

## Common Patterns and Best Practices

### Type Safety

Always provide the generic type parameter for full type safety:

```tsx
// ✅ Good: Type-safe
<DataGridWrapper<User>
  rows={users}
  columns={columns}
  onRowClick={(row) => {
    // `row` is correctly typed as User
    console.log(row.name);
  }}
/>

// ❌ Bad: No type safety
<DataGridWrapper
  rows={users}
  columns={columns}
/>
```

### Column Configuration

Define columns outside the component to prevent re-renders:

```tsx
// ✅ Good: Defined outside component
const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 250 },
];

export const UsersScreen = () => {
  return <DataGridWrapper<User> rows={users} columns={columns} />;
};

// ❌ Bad: Defined inside component (re-creates on every render)
export const UsersScreen = () => {
  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
  ];
  return <DataGridWrapper<User> rows={users} columns={columns} />;
};
```

### Search Fields

Only include searchable text fields in `searchConfig.fields`:

```tsx
// ✅ Good: Only text fields
searchConfig={{
  enabled: true,
  fields: ['name', 'email', 'organization'],
}}

// ❌ Bad: Including non-text fields
searchConfig={{
  enabled: true,
  fields: ['name', 'createdAt', 'isActive'], // createdAt and isActive won't search well
}}
```

### Pagination

Enable pagination for large datasets:

```tsx
// ✅ Good: Pagination enabled for large lists
<DataGridWrapper<User>
  rows={users} // 1000+ users
  columns={columns}
  paginationConfig={{
    enabled: true,
    defaultPageSize: 25,
  }}
/>

// ❌ Bad: No pagination for large dataset
<DataGridWrapper<User>
  rows={users} // 1000+ users - will cause performance issues
  columns={columns}
/>
```

### Loading and Error States

Always handle loading and error states:

```tsx
// ✅ Good: Handles all states
const { data, loading, error } = useQuery(GET_USERS);

<DataGridWrapper<User>
  rows={data?.users || []}
  columns={columns}
  loading={loading}
  error={error ? 'Failed to load users' : undefined}
  emptyStateMessage="No users found"
/>
```

### i18n Support

Use translation keys for user-facing text:

```tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation('users');

<DataGridWrapper<User>
  rows={users}
  columns={columns}
  searchConfig={{
    enabled: true,
    fields: ['name', 'email'],
    placeholder: t('searchPlaceholder'),
  }}
  emptyStateMessage={t('noUsersFound')}
  error={error ? t('loadError') : undefined}
/>
```

### Accessibility

Ensure action buttons have proper aria labels:

```tsx
<DataGridWrapper<User>
  rows={users}
  columns={columns}
  actionColumn={(row) => (
    <>
      <IconButton 
        onClick={() => handleEdit(row.id)}
        aria-label={`Edit user ${row.name}`}
      >
        <Edit />
      </IconButton>
      <IconButton 
        onClick={() => handleDelete(row.id)}
        aria-label={`Delete user ${row.name}`}
      >
        <Delete />
      </IconButton>
    </>
  )}
/>
```

### Sort Format Validation

The DataGridWrapper validates sort formats and provides helpful console warnings for debugging:

```tsx
// ✅ Good: Correct sort format
sortConfig={{
  sortingOptions: [
    { label: 'Name (A-Z)', value: 'name_asc' },     // Correct
    { label: 'Name (Z-A)', value: 'name_desc' },    // Correct
  ],
}}

// ❌ Bad: Invalid sort format - will log warning
sortConfig={{
  sortingOptions: [
    { label: 'Name', value: 'name' },              // Missing sort direction
    { label: 'Email', value: 'email-ascending' },  // Wrong separator
  ],
}}
```

If an invalid format is detected, you'll see a console warning:
```
[DataGridWrapper] Invalid sort format: "name". Expected format: "field_asc" or "field_desc"
```

This helps developers quickly identify and fix configuration errors during development.

## Linter Enforcement

Direct usage of `@mui/x-data-grid` and `@mui/x-data-grid-pro` is enforced via ESLint
(`no-restricted-imports`) in `eslint.config.js`, with wrapper exemptions managed in
`scripts/eslint/config/exemptions.ts`.

Only the `DataGridWrapper` and its associated type definitions are allowed to import
these packages directly. All other usage must go through the standardized wrapper.


**Linter runs:**
- Pre-commit (via lint-staged)
- Pull request CI (via GitHub Actions)

**If you need to use DataGrid features not supported by DataGridWrapper:**

1. First, consider if the feature can be added to `DataGridWrapper`
2. If not, discuss with the team
3. The component may need to be refactored or enhanced

## Testing

When testing components that use `DataGridWrapper`:

```tsx
import { render, screen } from '@testing-library/react';
import { DataGridWrapper } from 'src/shared-components/DataGridWrapper/DataGridWrapper';

test('renders user data correctly', () => {
  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
  ];

  const columns = [
    { field: 'name', headerName: 'Name' },
    { field: 'email', headerName: 'Email' },
  ];

  render(<DataGridWrapper<User> rows={users} columns={columns} />);

  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('john@example.com')).toBeInTheDocument();
});

test('renders empty state message', () => {
  render(
    <DataGridWrapper<User>
      rows={[]}
      columns={[]}
      emptyStateMessage="No data available"
    />
  );

  expect(screen.getByText('No data available')).toBeInTheDocument();
});
```

## FAQ

**Q: Can I use MUI DataGrid props not exposed by DataGridWrapper?**

A: DataGridWrapper exposes the most commonly used props. If you need additional DataGrid functionality, consider:
1. Opening an issue to discuss adding it to DataGridWrapper
2. Proposing changes to enhance the wrapper component

**Q: How do I customize column rendering?**

A: Use the standard MUI `GridColDef` `renderCell` property:

```tsx
const columns: GridColDef[] = [
  {
    field: 'status',
    headerName: 'Status',
    renderCell: (params) => (
      <Chip 
        label={params.value}
        color={params.value === 'active' ? 'success' : 'default'}
      />
    ),
  },
];
```

**Q: How do I handle server-side pagination/sorting?**

A: Currently, DataGridWrapper supports client-side pagination and sorting. For server-side features, you'll need to implement the logic before passing data to the component:

```tsx
const { data, loading } = useQuery(GET_USERS, {
  variables: {
    page: currentPage,
    pageSize: 25,
    sortBy: sortField,
    sortOrder: sortOrder,
  },
});

<DataGridWrapper<User>
  rows={data?.users || []}
  columns={columns}
  loading={loading}
/>
```

**Q: Can I disable pagination?**

A: Yes, simply don't provide a `paginationConfig` or set `paginationConfig.enabled` to `false`.

**Q: How do I style the DataGrid?**

A: The DataGrid uses MUI's styling system. You can use the `sx` prop on columns or wrap DataGridWrapper in a styled container. For global styling changes, modify `DataGridWrapper.module.css`.

## Related Components

- **SearchBar**: Used internally by DataGridWrapper for search functionality
- **SortingButton**: Used internally for sorting dropdown
- **DataGridLoadingOverlay**: Custom loading overlay component displayed via DataGrid slots
- **DataGridErrorOverlay**: Custom error overlay component displayed via DataGrid slots when errors occur
- **EmptyState**: Displayed via DataGrid slots when no data is available

## See Also

- [MUI DataGrid Documentation](https://mui.com/x/react-data-grid/)
- [Reusable Components Guide](./reusable-components.md)
- [Design Token System](./design-token-system.md)
- [Testing Guide](./testing.md)
