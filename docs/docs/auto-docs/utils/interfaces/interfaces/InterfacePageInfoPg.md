[Admin Docs](/)

***

# Interface: InterfacePageInfoPg

Defined in: [src/utils/interfaces.ts:640](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L640)

InterfacePageInfoPg

## Description

Defines the structure for pagination information in PostgreSQL-backed connections.

## Properties

### endCursor

> **endCursor**: `string`

Defined in: [src/utils/interfaces.ts:641](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L641)

The cursor for the last item in the current page.

***

### hasNextPage

> **hasNextPage**: `boolean`

Defined in: [src/utils/interfaces.ts:642](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L642)

Indicates if there is a next page.

***

### hasPreviousPage

> **hasPreviousPage**: `boolean`

Defined in: [src/utils/interfaces.ts:643](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L643)

Indicates if there is a previous page.

***

### startCursor

> **startCursor**: `string`

Defined in: [src/utils/interfaces.ts:644](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L644)

The cursor for the first item in the current page.
