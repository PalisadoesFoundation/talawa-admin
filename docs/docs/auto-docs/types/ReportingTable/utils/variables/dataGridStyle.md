[Admin Docs](/)

***

# Variable: dataGridStyle

> `const` **dataGridStyle**: `object`

Defined in: [src/types/ReportingTable/utils.ts:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/ReportingTable/utils.ts#L9)

Shared sx/style object for DataGrid across the app.
Keep shape generic to avoid strict MUI theme coupling in the types package.

## Type Declaration

#### & .MuiDataGrid-cell:focus

> **& .MuiDataGrid-cell:focus**: `object`

#### & .MuiDataGrid-cell:focus.outline

> **outline**: `string` = `'none'`

#### & .MuiDataGrid-cell:focus-within

> **& .MuiDataGrid-cell:focus-within**: `object`

#### & .MuiDataGrid-cell:focus-within.outline

> **outline**: `string` = `'none'`

#### & .MuiDataGrid-row

> **& .MuiDataGrid-row**: `object`

#### & .MuiDataGrid-row.&:focus-within

> **&:focus-within**: `object`

#### & .MuiDataGrid-row.&:focus-within.outline

> **outline**: `string` = `'none'`

#### & .MuiDataGrid-row.backgroundColor

> **backgroundColor**: `string` = `'var(--row-background)'`

#### & .MuiDataGrid-row:hover

> **& .MuiDataGrid-row:hover**: `object`

#### & .MuiDataGrid-row:hover.backgroundColor

> **backgroundColor**: `string` = `'var(--row-background)'`

#### & .MuiDataGrid-row.Mui-hovered

> **& .MuiDataGrid-row.Mui-hovered**: `object`

#### & .MuiDataGrid-row.Mui-hovered.backgroundColor

> **backgroundColor**: `string` = `'var(--row-background)'`

### backgroundColor

> **backgroundColor**: `string` = `'var(--row-background)'`

### borderRadius

> **borderRadius**: `string` = `'var(--table-head-radius)'`
