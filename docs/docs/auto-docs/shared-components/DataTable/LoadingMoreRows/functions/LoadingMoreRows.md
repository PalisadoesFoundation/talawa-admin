[Admin Docs](/)

***

# Function: LoadingMoreRows()

> **LoadingMoreRows**\<`T`\>(`columns`): `Element`

Defined in: [src/shared-components/DataTable/LoadingMoreRows.tsx:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/LoadingMoreRows.tsx#L15)

LoadingMoreRows renders skeleton rows appended to the table when loadingMore is true.
These rows match the table structure including selection and action columns.

## Type Parameters

### T

`T`

The type of data for each row (used for type-safe column definitions)

## Parameters

### columns

Column definitions to match skeleton structure

#### columns

[`IColumnDef`](../../../../types/shared-components/DataTable/interface/interfaces/IColumnDef.md)\<`T`, `unknown`\>[]

#### effectiveSelectable?

`boolean` = `false`

#### hasRowActions?

`boolean` = `false`

#### skeletonRows?

`number` = `5`

## Returns

`Element`
