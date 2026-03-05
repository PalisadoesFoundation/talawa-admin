[**talawa-admin**](../../../../../README.md)

***

# Interface: IUseSimpleTableDataOptions\<TRow, TData\>

Defined in: [src/shared-components/DataTable/hooks/useSimpleTableData.ts:7](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/shared-components/DataTable/hooks/useSimpleTableData.ts#L7)

Options for useSimpleTableData hook

## Type Parameters

### TRow

`TRow`

### TData

`TData`

## Properties

### path()

> **path**: (`data`) => `TRow`[]

Defined in: [src/shared-components/DataTable/hooks/useSimpleTableData.ts:12](https://github.com/yb175/talawa-admin/blob/fce1167047be7ffe368e3ca73cbf38141b19703e/src/shared-components/DataTable/hooks/useSimpleTableData.ts#L12)

Path function to extract array data from GraphQL response.
IMPORTANT: Must be memoized with useCallback for stable reference.

#### Parameters

##### data

`TData`

#### Returns

`TRow`[]
