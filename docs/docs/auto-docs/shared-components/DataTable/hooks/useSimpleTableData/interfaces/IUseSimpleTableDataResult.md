[Admin Docs](/)

***

# Interface: IUseSimpleTableDataResult\<TRow, TData\>

Defined in: [src/shared-components/DataTable/hooks/useSimpleTableData.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/hooks/useSimpleTableData.ts#L18)

Result returned by useSimpleTableData hook

## Type Parameters

### TRow

`TRow`

### TData

`TData`

## Properties

### error

> **error**: `ApolloError`

Defined in: [src/shared-components/DataTable/hooks/useSimpleTableData.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/hooks/useSimpleTableData.ts#L31)

Error from the query, if any.
Preserves ApolloError properties (graphQLErrors, networkError, etc.)

***

### loading

> **loading**: `boolean`

Defined in: [src/shared-components/DataTable/hooks/useSimpleTableData.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/hooks/useSimpleTableData.ts#L26)

Loading state from the query

***

### refetch()

> **refetch**: (`variables?`) => `Promise`\<`ApolloQueryResult`\<`TData`\>\>

Defined in: [src/shared-components/DataTable/hooks/useSimpleTableData.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/hooks/useSimpleTableData.ts#L37)

Function to refetch the query.
Returns a Promise that resolves with Apollo query result.
Matches Apollo's refetch signature: can accept variables and returns Promise.

#### Parameters

##### variables?

`Partial`\<`TVariables`\>

#### Returns

`Promise`\<`ApolloQueryResult`\<`TData`\>\>

***

### rows

> **rows**: `TRow`[]

Defined in: [src/shared-components/DataTable/hooks/useSimpleTableData.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataTable/hooks/useSimpleTableData.ts#L22)

Extracted rows from the query data
