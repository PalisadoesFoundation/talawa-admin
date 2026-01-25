[Admin Docs](/)

***

# Interface: IUseTableDataResult\<TRow, TData\>

Defined in: [src/types/shared-components/DataTable/interface.ts:298](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L298)

Result of the useTableData hook

## Type Parameters

### TRow

`TRow`

### TData

`TData` = `unknown`

## Properties

### error

> **error**: `Error`

Defined in: [src/types/shared-components/DataTable/interface.ts:302](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L302)

***

### fetchMore()

> **fetchMore**: \<`TFetchData`, `TFetchVars`\>(`fetchMoreOptions`) => `Promise`\<`ApolloQueryResult`\<`TFetchData`\>\>

Defined in: [src/types/shared-components/DataTable/interface.ts:305](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L305)

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

Defined in: [src/types/shared-components/DataTable/interface.ts:300](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L300)

***

### loadingMore

> **loadingMore**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:301](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L301)

***

### networkStatus

> **networkStatus**: `NetworkStatus`

Defined in: [src/types/shared-components/DataTable/interface.ts:306](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L306)

***

### pageInfo

> **pageInfo**: [`IPageInfo`](IPageInfo.md)

Defined in: [src/types/shared-components/DataTable/interface.ts:303](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L303)

***

### refetch()

> **refetch**: (`variables?`) => `Promise`\<`ApolloQueryResult`\<`TData`\>\>

Defined in: [src/types/shared-components/DataTable/interface.ts:304](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L304)

#### Parameters

##### variables?

`Partial`\<`TVariables`\>

#### Returns

`Promise`\<`ApolloQueryResult`\<`TData`\>\>

***

### rows

> **rows**: `TRow`[]

Defined in: [src/types/shared-components/DataTable/interface.ts:299](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L299)
