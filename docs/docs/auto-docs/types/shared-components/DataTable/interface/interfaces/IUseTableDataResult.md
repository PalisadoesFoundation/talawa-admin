[Admin Docs](/)

***

# Interface: IUseTableDataResult\<TRow, TData\>

Defined in: [src/types/shared-components/DataTable/interface.ts:269](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L269)

Result of the useTableData hook

## Type Parameters

### TRow

`TRow`

### TData

`TData` = `unknown`

## Properties

### error

> **error**: `Error`

Defined in: [src/types/shared-components/DataTable/interface.ts:273](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L273)

***

### fetchMore()

> **fetchMore**: \<`TFetchData`, `TFetchVars`\>(`fetchMoreOptions`) => `Promise`\<`ApolloQueryResult`\<`TFetchData`\>\>

Defined in: [src/types/shared-components/DataTable/interface.ts:276](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L276)

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

Defined in: [src/types/shared-components/DataTable/interface.ts:271](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L271)

***

### loadingMore

> **loadingMore**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:272](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L272)

***

### networkStatus

> **networkStatus**: `NetworkStatus`

Defined in: [src/types/shared-components/DataTable/interface.ts:277](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L277)

***

### pageInfo

> **pageInfo**: [`IPageInfo`](IPageInfo.md)

Defined in: [src/types/shared-components/DataTable/interface.ts:274](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L274)

***

### refetch()

> **refetch**: (`variables?`) => `Promise`\<`ApolloQueryResult`\<`TData`\>\>

Defined in: [src/types/shared-components/DataTable/interface.ts:275](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L275)

#### Parameters

##### variables?

`Partial`\<`TVariables`\>

#### Returns

`Promise`\<`ApolloQueryResult`\<`TData`\>\>

***

### rows

> **rows**: `TRow`[]

Defined in: [src/types/shared-components/DataTable/interface.ts:270](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L270)
