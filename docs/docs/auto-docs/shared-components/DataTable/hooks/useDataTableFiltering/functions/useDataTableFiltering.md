[Admin Docs](/)

***

# Function: useDataTableFiltering()

> **useDataTableFiltering**\<`T`\>(`options`): `object`

Defined in: src/shared-components/DataTable/hooks/useDataTableFiltering.ts:22

Hook to manage DataTable filtering and search logic.

## Type Parameters

### T

`T`

## Parameters

### options

`UseDataTableFilteringOptions`\<`T`\>

## Returns

`object`

### filteredRows

> **filteredRows**: `T`[]

### filters

> **filters**: `Record`\<`string`, `unknown`\>

### query

> **query**: `string`

### updateGlobalSearch()

> **updateGlobalSearch**: (`next`) => `void`

#### Parameters

##### next

`string`

#### Returns

`void`
