[Admin Docs](/)

---

# Interface: IPageInfo

Defined in: [src/types/shared-components/DataTable/interface.ts:80](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L80)

PageInfo for DataTable component with server-side pagination

## Properties

### endCursor?

> `optional` **endCursor**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:96](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L96)

Cursor for the end of the current page

---

### hasNextPage

> **hasNextPage**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:84](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L84)

Indicates if there is a next page available

---

### hasPreviousPage

> **hasPreviousPage**: `boolean`

Defined in: [src/types/shared-components/DataTable/interface.ts:88](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L88)

Indicates if there is a previous page available

---

### startCursor?

> `optional` **startCursor**: `string`

Defined in: [src/types/shared-components/DataTable/interface.ts:92](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/shared-components/DataTable/interface.ts#L92)

Cursor for the start of the current page
