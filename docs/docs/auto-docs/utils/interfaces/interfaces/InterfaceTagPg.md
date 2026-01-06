[Admin Docs](/)

***

# Interface: InterfaceTagPg

Defined in: [src/utils/interfaces.ts:1160](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1160)

Defines the structure for a tag with PostgreSQL-specific fields.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1163](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1163)

The creation date of the tag record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1165](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1165)

The user who created this tag.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1161](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1161)

The unique identifier of the tag.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1162](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1162)

The name of the tag.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:1167](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1167)

The organization associated with this tag.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1164](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1164)

The last update date of the tag record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1166](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1166)

The user who last updated this tag.
