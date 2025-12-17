[Admin Docs](/)

***

# Interface: InterfaceVenuePg

Defined in: src/utils/interfaces.ts:1255

InterfaceVenuePg

## Description

Defines the structure for a venue with PostgreSQL-specific fields.

## Properties

### attachments?

> `optional` **attachments**: `object`[]

Defined in: src/utils/interfaces.ts:1260

The attachments associated with the venue.

#### mimeType

> **mimeType**: `string`

#### url

> **url**: `string`

***

### capacity?

> `optional` **capacity**: `number`

Defined in: src/utils/interfaces.ts:1259

The capacity of the venue.

***

### createdAt

> **createdAt**: `string`

Defined in: src/utils/interfaces.ts:1264

The creation date of the venue record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: src/utils/interfaces.ts:1266

The user who created this venue.

***

### description?

> `optional` **description**: `string`

Defined in: src/utils/interfaces.ts:1258

The description of the venue.

***

### id

> **id**: `ID`

Defined in: src/utils/interfaces.ts:1256

The unique identifier of the venue.

***

### name

> **name**: `string`

Defined in: src/utils/interfaces.ts:1257

The name of the venue.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: src/utils/interfaces.ts:1268

The organization associated with this venue.

***

### updatedAt

> **updatedAt**: `string`

Defined in: src/utils/interfaces.ts:1265

The last update date of the venue record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: src/utils/interfaces.ts:1267

The user who last updated this venue.
