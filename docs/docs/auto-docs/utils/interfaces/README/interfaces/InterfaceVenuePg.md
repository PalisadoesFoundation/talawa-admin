[Admin Docs](/)

***

# Interface: InterfaceVenuePg

Defined in: [src/utils/interfaces.ts:1246](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1246)

InterfaceVenuePg

## Description

Defines the structure for a venue with PostgreSQL-specific fields.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1249](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1249)

The creation date of the venue record.

***

### creator

> **creator**: [`InterfaceUserPg`](utils\interfaces\README\interfaces\InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1251](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1251)

The user who created this venue.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1247](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1247)

The unique identifier of the venue.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1248](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1248)

The name of the venue.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](utils\interfaces\README\interfaces\InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:1253](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1253)

The organization associated with this venue.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1250](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1250)

The last update date of the venue record.

***

### updater

> **updater**: [`InterfaceUserPg`](utils\interfaces\README\interfaces\InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1252](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1252)

The user who last updated this venue.
