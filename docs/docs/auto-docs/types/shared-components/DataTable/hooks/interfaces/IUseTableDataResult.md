[Admin Docs](/)

***

# Interface: IUseTableDataResult\<TRow, TData\>

Defined in: [src/types/shared-components/DataTable/hooks.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L62)

Result object from a table data fetching hook.

Contains the processed rows, loading states, error information, and methods to
refetch data or fetch additional pages in a paginated result set.

## Type Parameters

### TRow

`TRow`

The type of data for each row

### TData

`TData` = `unknown`

The shape of the complete GraphQL query result

## Properties

### error

> **error**: `Error`

Defined in: [src/types/shared-components/DataTable/hooks.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L70)

Error from the most recent query or fetch operation

***

### fetchMore()

> **fetchMore**: \<`TFetchData`, `TFetchVars`\>(`fetchMoreOptions`) => `Promise`\<`QueryResult`\<`TFetchData`\>\>

Defined in: [src/types/shared-components/DataTable/hooks.ts:82](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L82)

Function to fetch additional pages or update pagination cursors.
Follows Apollo Client's fetchMore signature.

#### Type Parameters

##### TFetchData

`TFetchData` = `TData`

##### TFetchVars

`TFetchVars` *extends* `OperationVariables` = `OperationVariables`

#### Parameters

##### fetchMoreOptions

`FetchMoreOptions`\<`TData`, `OperationVariables`, `TFetchData`, `TFetchVars`\>

#### Returns

`Promise`\<`QueryResult`\<`TFetchData`\>\>

***

### loading

> **loading**: `boolean`

Defined in: [src/types/shared-components/DataTable/hooks.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L66)

Whether the initial data fetch is in progress

***

### loadingMore

> **loadingMore**: `boolean`

Defined in: [src/types/shared-components/DataTable/hooks.ts:68](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L68)

Whether additional pages are currently being fetched

***

### networkStatus

> **networkStatus**: `NetworkStatus`

Defined in: [src/types/shared-components/DataTable/hooks.ts:87](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L87)

Apollo Client network status code.
1 = loading, 4 = setVariables, 6 = refetch, 7 = poll, 8 = ready, etc.

***

### pageInfo

> **pageInfo**: [`InterfacePageInfo`](../../pagination/interfaces/InterfacePageInfo.md)

Defined in: [src/types/shared-components/DataTable/hooks.ts:72](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L72)

Pagination state including cursors and next/previous page availability

***

### refetch()

> **refetch**: (`variables?`) => `Promise`\<`QueryResult`\<`TData`\>\>

Defined in: [src/types/shared-components/DataTable/hooks.ts:77](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L77)

Function to refetch the query with fresh data.
Typically used to refresh after mutations.

#### Parameters

##### variables?

`Partial`\<`TVariables`\>

#### Returns

`Promise`\<`QueryResult`\<`TData`\>\>

***

### rows

> **rows**: `TRow`[]

Defined in: [src/types/shared-components/DataTable/hooks.ts:64](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L64)

Array of processed rows ready for display in the table
