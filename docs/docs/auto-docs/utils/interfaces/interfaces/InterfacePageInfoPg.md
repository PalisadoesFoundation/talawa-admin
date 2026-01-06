[Admin Docs](/)

***

# Interface: InterfacePageInfoPg

Defined in: [src/utils/interfaces.ts:622](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L622)

Defines the structure for pagination information in PostgreSQL-backed connections.

## Properties

### endCursor

> **endCursor**: `string`

Defined in: [src/utils/interfaces.ts:623](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L623)

The cursor for the last item in the current page.

***

### hasNextPage

> **hasNextPage**: `boolean`

Defined in: [src/utils/interfaces.ts:624](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L624)

Indicates if there is a next page.

***

### hasPreviousPage

> **hasPreviousPage**: `boolean`

Defined in: [src/utils/interfaces.ts:625](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L625)

Indicates if there is a previous page.

***

### startCursor

> **startCursor**: `string`

Defined in: [src/utils/interfaces.ts:626](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L626)

The cursor for the first item in the current page.
