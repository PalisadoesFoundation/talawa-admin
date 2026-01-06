[Admin Docs](/)

***

# Interface: InterfaceVenuePg

Defined in: [src/utils/interfaces.ts:1203](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1203)

Defines the structure for a venue with PostgreSQL-specific fields.

## Properties

### attachments?

> `optional` **attachments**: `object`[]

Defined in: [src/utils/interfaces.ts:1208](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1208)

The attachments associated with the venue.

#### mimeType

> **mimeType**: `string`

#### url

> **url**: `string`

***

### capacity?

> `optional` **capacity**: `number`

Defined in: [src/utils/interfaces.ts:1207](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1207)

The capacity of the venue.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1212](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1212)

The creation date of the venue record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1214](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1214)

The user who created this venue.

***

### description?

> `optional` **description**: `string`

Defined in: [src/utils/interfaces.ts:1206](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1206)

The description of the venue.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1204](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1204)

The unique identifier of the venue.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1205](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1205)

The name of the venue.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:1216](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1216)

The organization associated with this venue.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1213](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1213)

The last update date of the venue record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1215](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1215)

The user who last updated this venue.
