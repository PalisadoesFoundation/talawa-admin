[Admin Docs](/)

***

# Interface: IPageInfo

Defined in: [src/types/shared-components/DataTable/interface.ts:54](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L54)

PageInfo for DataTable component with server-side pagination

## Properties

### endCursor?

> `optional` **endCursor**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L70)

Cursor for the end of the current page

***

### hasNextPage

> **hasNextPage**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:58](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L58)

Indicates if there is a next page available

***

### hasPreviousPage

> **hasPreviousPage**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:62](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L62)

Indicates if there is a previous page available

***

### startCursor?

> `optional` **startCursor**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:66](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L66)

Cursor for the start of the current page
