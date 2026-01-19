[Admin Docs](/)

---

# Interface: InterfacePageInfoPg

Defined in: [src/utils/interfaces.ts:642](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L642)

InterfacePageInfoPg

## Description

Defines the structure for pagination information in PostgreSQL-backed connections.

## Properties

### endCursor

> **endCursor**: `string`

Defined in: [src/utils/interfaces.ts:643](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L643)

The cursor for the last item in the current page.

---

### hasNextPage

> **hasNextPage**: `boolean`

Defined in: [src/utils/interfaces.ts:644](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L644)

Indicates if there is a next page.

---

### hasPreviousPage

> **hasPreviousPage**: `boolean`

Defined in: [src/utils/interfaces.ts:645](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L645)

Indicates if there is a previous page.

---

### startCursor

> **startCursor**: `string`

Defined in: [src/utils/interfaces.ts:646](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L646)

The cursor for the first item in the current page.
