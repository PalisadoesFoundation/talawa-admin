[Admin Docs](/)

***

# Interface: InterfaceTagPg

Defined in: [src/utils/interfaces.ts:1207](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1207)

InterfaceTagPg

## Description

Defines the structure for a tag with PostgreSQL-specific fields.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1210](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1210)

The creation date of the tag record.

***

### creator

> **creator**: [`InterfaceUserPg`](utils\interfaces\README\interfaces\InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1212](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1212)

The user who created this tag.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1208](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1208)

The unique identifier of the tag.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1209](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1209)

The name of the tag.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](utils\interfaces\README\interfaces\InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:1214](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1214)

The organization associated with this tag.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1211](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1211)

The last update date of the tag record.

***

### updater

> **updater**: [`InterfaceUserPg`](utils\interfaces\README\interfaces\InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1213](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1213)

The user who last updated this tag.
