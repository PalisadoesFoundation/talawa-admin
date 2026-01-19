[Admin Docs](/)

***

# Interface: InterfaceVenuePg

Defined in: [src/utils/interfaces.ts:1258](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1258)

InterfaceVenuePg

## Description

Defines the structure for a venue with PostgreSQL-specific fields.

## Properties

### attachments?

> `optional` **attachments**: `object`[]

Defined in: [src/utils/interfaces.ts:1263](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1263)

The attachments associated with the venue.

#### mimeType

> **mimeType**: `string`

#### url

> **url**: `string`

***

### capacity?

> `optional` **capacity**: `number`

Defined in: [src/utils/interfaces.ts:1262](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1262)

The capacity of the venue.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1267](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1267)

The creation date of the venue record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1269](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1269)

The user who created this venue.

***

### description?

> `optional` **description**: `string`

Defined in: [src/utils/interfaces.ts:1261](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1261)

The description of the venue.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1259](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1259)

The unique identifier of the venue.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1260](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1260)

The name of the venue.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:1271](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1271)

The organization associated with this venue.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1268](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1268)

The last update date of the venue record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1270](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1270)

The user who last updated this venue.
