[Admin Docs](/)

***

# Interface: InterfaceAdvertisementPg

Defined in: [src/utils/interfaces.ts:701](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L701)

Defines the structure for an advertisement with PostgreSQL-specific fields.

## Properties

### attachments

> **attachments**: [`InterfaceAdvertisementAttachmentPg`](InterfaceAdvertisementAttachmentPg.md)[]

Defined in: [src/utils/interfaces.ts:713](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L713)

An array of attachments for the advertisement.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:708](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L708)

The creation date of the advertisement record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:710](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L710)

The user who created this advertisement.

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:704](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L704)

The description of the advertisement.

***

### endAt

> **endAt**: `string`

Defined in: [src/utils/interfaces.ts:707](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L707)

The end date and time of the advertisement.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:702](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L702)

The unique identifier of the advertisement.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:703](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L703)

The name of the advertisement.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:712](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L712)

The organization associated with this advertisement.

***

### startAt

> **startAt**: `string`

Defined in: [src/utils/interfaces.ts:706](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L706)

The start date and time of the advertisement.

***

### type

> **type**: `AdvertisementTypePg`

Defined in: [src/utils/interfaces.ts:705](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L705)

The type of the advertisement.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:709](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L709)

The last update date of the advertisement record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:711](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L711)

The user who last updated this advertisement.
