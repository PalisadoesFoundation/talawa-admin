[Admin Docs](/)

***

# Function: DataGridWrapper()

> **DataGridWrapper**\<`T`\>(`props`): `Element`

Defined in: [src/shared-components/DataGridWrapper/DataGridWrapper.tsx:43](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataGridWrapper/DataGridWrapper.tsx#L43)

A generic wrapper around MUI DataGrid with built-in search, sorting, and pagination.

## Type Parameters

### T

`T` *extends* `object`

The row data type (must include `id: string | number`)

## Parameters

### props

[`InterfaceDataGridWrapperProps`](../../../types/DataGridWrapper/interface/interfaces/InterfaceDataGridWrapperProps.md)\<`T`\>

Component props defined by InterfaceDataGridWrapperProps\<T\>

## Returns

`Element`

A data grid with optional toolbar controls (search, sort) and enhanced features

## Example

```tsx
<DataGridWrapper
  rows={users}
  columns={[{ field: 'name', headerName: 'Name', width: 150 }]}
  searchConfig={{ enabled: true, fields: ['name', 'email'] }}
  loading={isLoading}
/>
```
