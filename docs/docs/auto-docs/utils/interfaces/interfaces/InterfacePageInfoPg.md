[**talawa-admin**](../../../README.md)

***

# Interface: InterfacePageInfoPg

Defined in: [src/utils/interfaces.ts:639](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L639)

InterfacePageInfoPg

## Description

Defines the structure for pagination information in PostgreSQL-backed connections.

## Properties

### endCursor

> **endCursor**: `string`

Defined in: [src/utils/interfaces.ts:640](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L640)

The cursor for the last item in the current page.

***

### hasNextPage

> **hasNextPage**: `boolean`

Defined in: [src/utils/interfaces.ts:641](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L641)

Indicates if there is a next page.

***

### hasPreviousPage

> **hasPreviousPage**: `boolean`

Defined in: [src/utils/interfaces.ts:642](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L642)

Indicates if there is a previous page.

***

### startCursor

> **startCursor**: `string`

Defined in: [src/utils/interfaces.ts:643](https://github.com/iamanishx/talawa-admin/blob/c51144eaab32178a2cfff21cbfeafafbf406559b/src/utils/interfaces.ts#L643)

The cursor for the first item in the current page.
