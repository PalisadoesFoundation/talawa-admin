[Admin Docs](/)

***

# Interface: IPageInfo

Defined in: [src/types/shared-components/DataTable/interface.ts:86](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L86)

PageInfo for DataTable component with server-side pagination

## Properties

### endCursor?

> `optional` **endCursor**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:102](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L102)

Cursor for the end of the current page

***

### hasNextPage

> **hasNextPage**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:90](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L90)

Indicates if there is a next page available

***

### hasPreviousPage

> **hasPreviousPage**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:94](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L94)

Indicates if there is a previous page available

***

### startCursor?

> `optional` **startCursor**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:98](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L98)

Cursor for the start of the current page
