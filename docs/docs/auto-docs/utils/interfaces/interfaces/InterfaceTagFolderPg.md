[Admin Docs](/)

***

# Interface: InterfaceTagFolderPg

Defined in: [src/utils/interfaces.ts:1156](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1156)

InterfaceTagFolderPg
Defines the structure for a tag folder with PostgreSQL-specific fields.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1159](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1159)

The creation date of the tag folder record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1161](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1161)

The user who created this tag folder.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1157](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1157)

The unique identifier of the tag folder.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1158](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1158)

The name of the tag folder.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:1163](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1163)

The organization associated with this tag folder.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1160](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1160)

The last update date of the tag folder record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1162](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1162)

The user who last updated this tag folder.
