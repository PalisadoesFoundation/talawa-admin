[Admin Docs](/)

***

# Interface: InterfacePageInfoPg

Defined in: [src/utils/interfaces.ts:723](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L723)

InterfacePageInfoPg

## Description

Defines the structure for pagination information in PostgreSQL-backed connections.

## Properties

### endCursor

> **endCursor**: `string`

Defined in: [src/utils/interfaces.ts:724](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L724)

The cursor for the last item in the current page.

***

### hasNextPage

> **hasNextPage**: `boolean`

Defined in: [src/utils/interfaces.ts:725](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L725)

Indicates if there is a next page.

***

### hasPreviousPage

> **hasPreviousPage**: `boolean`

Defined in: [src/utils/interfaces.ts:726](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L726)

Indicates if there is a previous page.

***

### startCursor

> **startCursor**: `string`

Defined in: [src/utils/interfaces.ts:727](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L727)

The cursor for the first item in the current page.
