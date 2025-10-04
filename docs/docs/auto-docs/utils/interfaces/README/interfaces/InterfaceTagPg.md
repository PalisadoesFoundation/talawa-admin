[Admin Docs](/)

***

# Interface: InterfaceTagPg

Defined in: [src/utils/interfaces.ts:1203](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1203)

InterfaceTagPg

## Description

Defines the structure for a tag with PostgreSQL-specific fields.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1206](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1206)

The creation date of the tag record.

***

### creator

> **creator**: [`InterfaceUserPg`](utils\interfaces\README\interfaces\InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1208](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1208)

The user who created this tag.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1204](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1204)

The unique identifier of the tag.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1205](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1205)

The name of the tag.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](utils\interfaces\README\interfaces\InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:1210](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1210)

The organization associated with this tag.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1207](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1207)

The last update date of the tag record.

***

### updater

> **updater**: [`InterfaceUserPg`](utils\interfaces\README\interfaces\InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1209](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1209)

The user who last updated this tag.
