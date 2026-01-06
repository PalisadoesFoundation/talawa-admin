[Admin Docs](/)

***

# Interface: InterfaceTagPg

Defined in: [src/utils/interfaces.ts:1199](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1199)

InterfaceTagPg
Defines the structure for a tag with PostgreSQL-specific fields.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1202](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1202)

The creation date of the tag record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1204](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1204)

The user who created this tag.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1200](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1200)

The unique identifier of the tag.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1201](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1201)

The name of the tag.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:1206](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1206)

The organization associated with this tag.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1203](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1203)

The last update date of the tag record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1205](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1205)

The user who last updated this tag.
