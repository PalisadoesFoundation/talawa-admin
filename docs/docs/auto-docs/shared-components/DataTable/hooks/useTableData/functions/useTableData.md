[**talawa-admin**](../../../../../README.md)

***

# Function: useTableData()

> **useTableData**\<`TNode`, `TRow`, `TData`\>(`result`, `options`): [`IUseTableDataResult`](../../../../../types/shared-components/DataTable/interface/interfaces/IUseTableDataResult.md)\<`TRow`, `TData`\>

Defined in: [src/shared-components/DataTable/hooks/useTableData.ts:12](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/shared-components/DataTable/hooks/useTableData.ts#L12)

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
