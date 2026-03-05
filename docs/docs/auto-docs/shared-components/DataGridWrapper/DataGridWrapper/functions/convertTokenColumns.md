[Admin Docs](/)

***

# Function: convertTokenColumns()

> **convertTokenColumns**(`columns`): `GridColDef`[]

Defined in: [src/shared-components/DataGridWrapper/DataGridWrapper.tsx:46](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataGridWrapper/DataGridWrapper.tsx#L46)

Converts token-aware column definitions to MUI-compatible GridColDef.
Transforms spacing token names (e.g., 'space-15') to pixel values (e.g., 150).

Use this function when passing columns to raw DataGrid instead of DataGridWrapper.

## Parameters

### columns

[`TokenAwareGridColDef`](../../../../types/DataGridWrapper/interface/type-aliases/TokenAwareGridColDef.md)[]

Array of TokenAwareGridColDef with token names for width properties

## Returns

`GridColDef`[]

Array of GridColDef with numeric pixel values

## Example

```tsx
const columns: TokenAwareGridColDef[] = [
  { field: 'name', minWidth: 'space-15' },
];
<DataGrid columns={convertTokenColumns(columns)} />
```
