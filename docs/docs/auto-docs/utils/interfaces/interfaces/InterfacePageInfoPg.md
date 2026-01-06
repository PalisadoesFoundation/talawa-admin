[Admin Docs](/)

***

# Interface: InterfacePageInfoPg

Defined in: [src/utils/interfaces.ts:632](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L632)

InterfacePageInfoPg
Defines the structure for pagination information in PostgreSQL-backed connections.

## Properties

### endCursor

> **endCursor**: `string`

Defined in: [src/utils/interfaces.ts:633](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L633)

The cursor for the last item in the current page.

***

### hasNextPage

> **hasNextPage**: `boolean`

Defined in: [src/utils/interfaces.ts:634](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L634)

Indicates if there is a next page.

***

### hasPreviousPage

> **hasPreviousPage**: `boolean`

Defined in: [src/utils/interfaces.ts:635](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L635)

Indicates if there is a previous page.

***

### startCursor

> **startCursor**: `string`

Defined in: [src/utils/interfaces.ts:636](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L636)

The cursor for the first item in the current page.
