[Admin Docs](/)

***

# Interface: InterfaceVenuePg

Defined in: [src/utils/interfaces.ts:1249](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1249)

InterfaceVenuePg

## Description

Defines the structure for a venue with PostgreSQL-specific fields.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1252](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1252)

The creation date of the venue record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1254](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1254)

The user who created this venue.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1250](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1250)

The unique identifier of the venue.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1251](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1251)

The name of the venue.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:1256](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1256)

The organization associated with this venue.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1253](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1253)

The last update date of the venue record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1255](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1255)

The user who last updated this venue.
