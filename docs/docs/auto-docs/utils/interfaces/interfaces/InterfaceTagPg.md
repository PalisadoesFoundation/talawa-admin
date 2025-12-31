[Admin Docs](/)

***

# Interface: InterfaceTagPg

Defined in: [src/utils/interfaces.ts:1235](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1235)

InterfaceTagPg

## Description

Defines the structure for a tag with PostgreSQL-specific fields.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1238](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1238)

The creation date of the tag record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1240](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1240)

The user who created this tag.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1236](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1236)

The unique identifier of the tag.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1237](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1237)

The name of the tag.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:1242](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1242)

The organization associated with this tag.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1239](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1239)

The last update date of the tag record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1241](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1241)

The user who last updated this tag.
