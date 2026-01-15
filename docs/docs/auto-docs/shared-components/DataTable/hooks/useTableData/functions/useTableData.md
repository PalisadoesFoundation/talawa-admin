[**talawa-admin**](../../../../../README.md)

***

# Function: useTableData()

> **useTableData**\<`TNode`, `TRow`, `TData`\>(`result`, `options`): [`IUseTableDataResult`](../../../../../types/shared-components/DataTable/interface/interfaces/IUseTableDataResult.md)\<`TRow`, `TData`\>

Defined in: [src/shared-components/DataTable/hooks/useTableData.ts:12](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/shared-components/DataTable/hooks/useTableData.ts#L12)

Extract GraphQL connection data into table rows with optional node transform; filters null nodes.

## Type Parameters

### TNode

`TNode` = `unknown`

### TRow

`TRow` = `TNode`

### TData

`TData` = `unknown`

## Parameters

### result

`QueryResult`\<`TData`\>

### options

[`IUseTableDataOptions`](../../../../../types/shared-components/DataTable/interface/interfaces/IUseTableDataOptions.md)\<`TNode`, `TRow`, `TData`\>

## Returns

[`IUseTableDataResult`](../../../../../types/shared-components/DataTable/interface/interfaces/IUseTableDataResult.md)\<`TRow`, `TData`\>
