[Admin Docs](/)

***

# Function: DataGridWrapper()

> **DataGridWrapper**\<`T`\>(`props`): `Element`

Defined in: [src/shared-components/DataGridWrapper/DataGridWrapper.tsx:71](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataGridWrapper/DataGridWrapper.tsx#L71)

A generic wrapper around MUI DataGrid with built-in search, sorting, and pagination.

## Type Parameters

### T

`T` *extends* `object`

## Parameters

### props

[`InterfaceDataGridWrapperProps`](../../../../types/DataGridWrapper/interface/interfaces/InterfaceDataGridWrapperProps.md)\<`T`\>

Component props defined by InterfaceDataGridWrapperProps

## Returns

`Element`

A data grid with optional toolbar controls (search, sort) and enhanced features

## Example

```tsx
// Basic usage with search and pagination
<DataGridWrapper
  rows={users}
  columns={[{ field: 'name', headerName: 'Name', width: 150 }]}
  searchConfig={{ enabled: true, fields: ['name', 'email'] }}
  paginationConfig={{ enabled: true, defaultPageSize: 10 }}
  loading={isLoading}
/>

// With custom empty state
<DataGridWrapper
  rows={users}
  columns={columns}
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
/>

// Backward compatible with legacy emptyStateMessage
<DataGridWrapper
  rows={users}
  columns={columns}
  emptyStateMessage="No users found"
/>
```

## Remarks

- The `emptyStateProps` prop provides full customization of the empty state (icon, description, action button).
- If both `emptyStateProps` and `emptyStateMessage` are provided, `emptyStateProps` takes precedence.
- Error states always take precedence over empty states.
- Accessibility: The component preserves a11y attributes (role="status", aria-live, aria-label) when using either `emptyStateProps` or `emptyStateMessage`.
