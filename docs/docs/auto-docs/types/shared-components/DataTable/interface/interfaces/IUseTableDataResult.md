[**talawa-admin**](../../../../../README.md)

***

# Interface: IUseTableDataResult\<TRow, TData\>

Defined in: [src/types/shared-components/DataTable/interface.ts:292](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L292)

Result of the useTableData hook

## Type Parameters

### TRow

`TRow`

### TData

`TData` = `unknown`

## Properties

### error

> **error**: `Error`

Defined in: [src/types/shared-components/DataTable/interface.ts:296](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L296)

***

### fetchMore()

> **fetchMore**: \<`TFetchData`, `TFetchVars`\>(`fetchMoreOptions`) => `Promise`\<`ApolloQueryResult`\<`TFetchData`\>\>

Defined in: [src/types/shared-components/DataTable/interface.ts:299](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L299)

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

Defined in: [src/types/shared-components/DataTable/interface.ts:294](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L294)

***

### loadingMore

> **loadingMore**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:295](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L295)

***

### networkStatus

> **networkStatus**: `NetworkStatus`

Defined in: [src/types/shared-components/DataTable/interface.ts:300](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L300)

***

### pageInfo

> **pageInfo**: [`IPageInfo`](IPageInfo.md)

Defined in: [src/types/shared-components/DataTable/interface.ts:297](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L297)

***

### refetch()

> **refetch**: (`variables?`) => `Promise`\<`ApolloQueryResult`\<`TData`\>\>

Defined in: [src/types/shared-components/DataTable/interface.ts:298](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L298)

#### Parameters

##### variables?

`Partial`\<`TVariables`\>

#### Returns

`Promise`\<`ApolloQueryResult`\<`TData`\>\>

***

### rows

> **rows**: `TRow`[]

Defined in: [src/types/shared-components/DataTable/interface.ts:293](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/types/shared-components/DataTable/interface.ts#L293)
