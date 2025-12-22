[Admin Docs](/)

***

# Interface: InterfaceTagFolderPg

Defined in: [src/utils/interfaces.ts:1192](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1192)

InterfaceTagFolderPg

## Description

Defines the structure for a tag folder with PostgreSQL-specific fields.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1195](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1195)

The creation date of the tag folder record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1197](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1197)

The user who created this tag folder.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1193](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1193)

The unique identifier of the tag folder.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1194](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1194)

The name of the tag folder.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:1199](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1199)

The organization associated with this tag folder.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1196](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1196)

The last update date of the tag folder record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1198](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1198)

The user who last updated this tag folder.
