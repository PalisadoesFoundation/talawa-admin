[Admin Docs](/)

***

# Interface: InterfacePageInfoPg

Defined in: [src/utils/interfaces.ts:636](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L636)

InterfacePageInfoPg

## Description

Defines the structure for pagination information in PostgreSQL-backed connections.

## Properties

### endCursor

> **endCursor**: `string`

Defined in: [src/utils/interfaces.ts:637](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L637)

The cursor for the last item in the current page.

***

### hasNextPage

> **hasNextPage**: `boolean`

Defined in: [src/utils/interfaces.ts:638](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L638)

Indicates if there is a next page.

***

### hasPreviousPage

> **hasPreviousPage**: `boolean`

Defined in: [src/utils/interfaces.ts:639](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L639)

Indicates if there is a previous page.

***

### startCursor

> **startCursor**: `string`

Defined in: [src/utils/interfaces.ts:640](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L640)

The cursor for the first item in the current page.
