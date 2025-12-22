[Admin Docs](/)

***

# Interface: InterfacePageInfoPg

Defined in: [src/utils/interfaces.ts:668](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L668)

InterfacePageInfoPg

## Description

Defines the structure for pagination information in PostgreSQL-backed connections.

## Properties

### endCursor

> **endCursor**: `string`

Defined in: [src/utils/interfaces.ts:669](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L669)

The cursor for the last item in the current page.

***

### hasNextPage

> **hasNextPage**: `boolean`

Defined in: [src/utils/interfaces.ts:670](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L670)

Indicates if there is a next page.

***

### hasPreviousPage

> **hasPreviousPage**: `boolean`

Defined in: [src/utils/interfaces.ts:671](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L671)

Indicates if there is a previous page.

***

### startCursor

> **startCursor**: `string`

Defined in: [src/utils/interfaces.ts:672](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L672)

The cursor for the first item in the current page.
