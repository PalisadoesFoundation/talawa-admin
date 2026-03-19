[Admin Docs](/)

***

# Interface: IUseSimpleTableDataOptions\<TRow, TData\>

Defined in: [src/shared-components/DataTable/hooks/useSimpleTableData.ts:7](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/hooks/useSimpleTableData.ts#L7)

Options for useSimpleTableData hook

## Type Parameters

### TRow

`TRow`

### TData

`TData`

## Properties

### path()

> **path**: (`data`) => `TRow`[]

Defined in: [src/shared-components/DataTable/hooks/useSimpleTableData.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/hooks/useSimpleTableData.ts#L12)

Path function to extract array data from GraphQL response.
IMPORTANT: Must be memoized with useCallback for stable reference.

#### Parameters

##### data

`TData`

#### Returns

`TRow`[]
