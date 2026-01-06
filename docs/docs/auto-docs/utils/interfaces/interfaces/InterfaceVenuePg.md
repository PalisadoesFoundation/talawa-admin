[Admin Docs](/)

***

# Interface: InterfaceVenuePg

Defined in: [src/utils/interfaces.ts:1245](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1245)

InterfaceVenuePg
Defines the structure for a venue with PostgreSQL-specific fields.

## Properties

### attachments?

> `optional` **attachments**: `object`[]

Defined in: [src/utils/interfaces.ts:1250](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1250)

The attachments associated with the venue.

#### mimeType

> **mimeType**: `string`

#### url

> **url**: `string`

***

### capacity?

> `optional` **capacity**: `number`

Defined in: [src/utils/interfaces.ts:1249](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1249)

The capacity of the venue.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1254](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1254)

The creation date of the venue record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1256](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1256)

The user who created this venue.

***

### description?

> `optional` **description**: `string`

Defined in: [src/utils/interfaces.ts:1248](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1248)

The description of the venue.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1246](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1246)

The unique identifier of the venue.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1247](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1247)

The name of the venue.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:1258](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1258)

The organization associated with this venue.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1255](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1255)

The last update date of the venue record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1257](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1257)

The user who last updated this venue.
