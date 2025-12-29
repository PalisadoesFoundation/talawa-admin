[Admin Docs](/)

***

# Interface: InterfaceDataGridWrapperProps\<T\>

Defined in: [src/shared-components/DataGridWrapper/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataGridWrapper/interface.ts#L6)

## Type Parameters

### T

`T` *extends* `GridValidRowModel` = `GridValidRowModel`

## Properties

### actionColumn()?

> `optional` **actionColumn**: (`row`) => `ReactNode`

Defined in: [src/shared-components/DataGridWrapper/interface.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataGridWrapper/interface.ts#L29)

#### Parameters

##### row

`T`

#### Returns

`ReactNode`

***

### columns

> **columns**: `GridColDef`[]

Defined in: [src/shared-components/DataGridWrapper/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataGridWrapper/interface.ts#L10)

***

### emptyStateMessage?

> `optional` **emptyStateMessage**: `string`

Defined in: [src/shared-components/DataGridWrapper/interface.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataGridWrapper/interface.ts#L30)

***

### error?

> `optional` **error**: `ReactNode`

Defined in: [src/shared-components/DataGridWrapper/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataGridWrapper/interface.ts#L31)

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [src/shared-components/DataGridWrapper/interface.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataGridWrapper/interface.ts#L11)

***

### onRowClick()?

> `optional` **onRowClick**: (`row`) => `void`

Defined in: [src/shared-components/DataGridWrapper/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataGridWrapper/interface.ts#L28)

#### Parameters

##### row

`T`

#### Returns

`void`

***

### paginationConfig?

> `optional` **paginationConfig**: `object`

Defined in: [src/shared-components/DataGridWrapper/interface.ts:23](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataGridWrapper/interface.ts#L23)

#### defaultPageSize?

> `optional` **defaultPageSize**: `number`

#### enabled

> **enabled**: `boolean`

#### pageSizeOptions?

> `optional` **pageSizeOptions**: `number`[]

***

### rows

> **rows**: readonly `T`[]

Defined in: [src/shared-components/DataGridWrapper/interface.ts:9](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataGridWrapper/interface.ts#L9)

***

### searchConfig?

> `optional` **searchConfig**: `object`

Defined in: [src/shared-components/DataGridWrapper/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataGridWrapper/interface.ts#L12)

#### debounceMs?

> `optional` **debounceMs**: `number`

#### enabled

> **enabled**: `boolean`

#### fields

> **fields**: `string`[]

#### placeholder?

> `optional` **placeholder**: `string`

***

### sortConfig?

> `optional` **sortConfig**: `object`

Defined in: [src/shared-components/DataGridWrapper/interface.ts:18](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/shared-components/DataGridWrapper/interface.ts#L18)

#### defaultSortField?

> `optional` **defaultSortField**: `string`

#### defaultSortOrder?

> `optional` **defaultSortOrder**: `"desc"` \| `"asc"`

#### sortingOptions?

> `optional` **sortingOptions**: `object`[]
