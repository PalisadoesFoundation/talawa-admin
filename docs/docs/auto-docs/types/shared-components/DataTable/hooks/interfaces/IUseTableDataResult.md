[Admin Docs](/)

***

# Interface: IUseTableDataResult\<TRow, TData\>

Defined in: [src/types/shared-components/DataTable/hooks.ts:59](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L59)

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

Defined in: [src/types/shared-components/DataTable/hooks.ts:67](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L67)

Error from the most recent query or fetch operation

***

### fetchMore()

> **fetchMore**: \<`TFetchData`, `TFetchVars`\>(`fetchMoreOptions`) => `Promise`\<`ApolloQueryResult`\<`TFetchData`\>\>

Defined in: [src/types/shared-components/DataTable/hooks.ts:79](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L79)

Function to fetch additional pages or update pagination cursors.
Follows Apollo Client's fetchMore signature.

#### Type Parameters

##### TFetchData

`TFetchData` = `TData`

##### TFetchVars

`TFetchVars` *extends* `OperationVariables` = `OperationVariables`

#### Parameters

##### fetchMoreOptions

`FetchMoreQueryOptions`\<`TFetchVars`, `TFetchData`\> & `object`

#### Returns

`Promise`\<`ApolloQueryResult`\<`TFetchData`\>\>

***

### loading

> **loading**: `boolean`

Defined in: [src/types/shared-components/DataTable/hooks.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L63)

Whether the initial data fetch is in progress

***

### loadingMore

> **loadingMore**: `boolean`

Defined in: [src/types/shared-components/DataTable/hooks.ts:65](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L65)

Whether additional pages are currently being fetched

***

### networkStatus

> **networkStatus**: `NetworkStatus`

Defined in: [src/types/shared-components/DataTable/hooks.ts:84](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L84)

Apollo Client network status code.
1 = loading, 4 = setVariables, 6 = refetch, 7 = poll, 8 = ready, etc.

***

### pageInfo

> **pageInfo**: [`InterfacePageInfo`](../../pagination/interfaces/InterfacePageInfo.md)

Defined in: [src/types/shared-components/DataTable/hooks.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L69)

Pagination state including cursors and next/previous page availability

***

### refetch()

> **refetch**: (`variables?`) => `Promise`\<`ApolloQueryResult`\<`TData`\>\>

Defined in: [src/types/shared-components/DataTable/hooks.ts:74](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L74)

Function to refetch the query with fresh data.
Typically used to refresh after mutations.

#### Parameters

##### variables?

`Partial`\<`TVariables`\>

#### Returns

`Promise`\<`ApolloQueryResult`\<`TData`\>\>

***

### rows

> **rows**: `TRow`[]

Defined in: [src/types/shared-components/DataTable/hooks.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/hooks.ts#L61)

Array of processed rows ready for display in the table
