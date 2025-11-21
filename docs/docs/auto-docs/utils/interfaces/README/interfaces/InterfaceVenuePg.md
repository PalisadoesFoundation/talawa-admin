[Admin Docs](/)

***

# Interface: InterfaceVenuePg

Defined in: [src/utils/interfaces.ts:1253](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1253)

InterfaceVenuePg

## Description

Defines the structure for a venue with PostgreSQL-specific fields.

## Properties

### attachments?

> `optional` **attachments**: `object`[]

Defined in: [src/utils/interfaces.ts:1258](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1258)

The attachments associated with the venue.

#### mimeType

> **mimeType**: `string`

#### url

> **url**: `string`

***

### capacity?

> `optional` **capacity**: `number`

Defined in: [src/utils/interfaces.ts:1257](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1257)

The capacity of the venue.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1262](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1262)

The creation date of the venue record.

***

### creator

> **creator**: [`InterfaceUserPg`](utils\interfaces\README\interfaces\InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1264](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1264)

The user who created this venue.

***

### description?

> `optional` **description**: `string`

Defined in: [src/utils/interfaces.ts:1256](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1256)

The description of the venue.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1254](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1254)

The unique identifier of the venue.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1255](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1255)

The name of the venue.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](utils\interfaces\README\interfaces\InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:1266](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1266)

The organization associated with this venue.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1263](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1263)

The last update date of the venue record.

***

### updater

> **updater**: [`InterfaceUserPg`](utils\interfaces\README\interfaces\InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1265](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1265)

The user who last updated this venue.
