[**talawa-admin**](../../../README.md)

***

# Interface: InterfaceVenuePg

Defined in: [src/utils/interfaces.ts:1255](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1255)

InterfaceVenuePg

## Description

Defines the structure for a venue with PostgreSQL-specific fields.

## Properties

### attachments?

> `optional` **attachments**: `object`[]

Defined in: [src/utils/interfaces.ts:1260](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1260)

The attachments associated with the venue.

#### mimeType

> **mimeType**: `string`

#### url

> **url**: `string`

***

### capacity?

> `optional` **capacity**: `number`

Defined in: [src/utils/interfaces.ts:1259](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1259)

The capacity of the venue.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1264](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1264)

The creation date of the venue record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1266](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1266)

The user who created this venue.

***

### description?

> `optional` **description**: `string`

Defined in: [src/utils/interfaces.ts:1258](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1258)

The description of the venue.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1256](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1256)

The unique identifier of the venue.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1257](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1257)

The name of the venue.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:1268](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1268)

The organization associated with this venue.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1265](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1265)

The last update date of the venue record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1267](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1267)

The user who last updated this venue.
