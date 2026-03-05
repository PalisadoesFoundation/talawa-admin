[Admin Docs](/)

***

# Function: useTableData()

> **useTableData**\<`TNode`, `TRow`, `TData`\>(`result`, `options`): [`IUseTableDataResult`](../../../../../types/shared-components/DataTable/hooks/interfaces/IUseTableDataResult.md)\<`TRow`, `TData`\>

Defined in: [src/shared-components/DataTable/hooks/useTableData.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/hooks/useTableData.ts#L12)

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

[`IUseTableDataOptions`](../../../../../types/shared-components/DataTable/hooks/interfaces/IUseTableDataOptions.md)\<`TNode`, `TRow`, `TData`\>

## Returns

[`IUseTableDataResult`](../../../../../types/shared-components/DataTable/hooks/interfaces/IUseTableDataResult.md)\<`TRow`, `TData`\>
