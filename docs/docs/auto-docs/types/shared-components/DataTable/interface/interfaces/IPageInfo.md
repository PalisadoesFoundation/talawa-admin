[Admin Docs](/)

***

# Interface: IPageInfo

Defined in: [src/types/shared-components/DataTable/interface.ts:57](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L57)

PageInfo for DataTable component with server-side pagination

## Properties

### endCursor?

> `optional` **endCursor**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:73](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L73)

Cursor for the end of the current page

***

### hasNextPage

> **hasNextPage**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:61](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L61)

Indicates if there is a next page available

***

### hasPreviousPage

> **hasPreviousPage**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:65](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L65)

Indicates if there is a previous page available

***

### startCursor?

> `optional` **startCursor**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:69](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L69)

Cursor for the start of the current page
