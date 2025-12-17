[Admin Docs](/)

***

# Interface: InterfaceAdvertisementPg

Defined in: src/utils/interfaces.ts:723

InterfaceAdvertisementPg

## Description

Defines the structure for an advertisement with PostgreSQL-specific fields.

## Properties

### attachments

> **attachments**: [`InterfaceAdvertisementAttachmentPg`](InterfaceAdvertisementAttachmentPg.md)[]

Defined in: src/utils/interfaces.ts:735

An array of attachments for the advertisement.

***

### createdAt

> **createdAt**: `string`

Defined in: src/utils/interfaces.ts:730

The creation date of the advertisement record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: src/utils/interfaces.ts:732

The user who created this advertisement.

***

### description

> **description**: `string`

Defined in: src/utils/interfaces.ts:726

The description of the advertisement.

***

### endAt

> **endAt**: `string`

Defined in: src/utils/interfaces.ts:729

The end date and time of the advertisement.

***

### id

> **id**: `ID`

Defined in: src/utils/interfaces.ts:724

The unique identifier of the advertisement.

***

### name

> **name**: `string`

Defined in: src/utils/interfaces.ts:725

The name of the advertisement.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: src/utils/interfaces.ts:734

The organization associated with this advertisement.

***

### startAt

> **startAt**: `string`

Defined in: src/utils/interfaces.ts:728

The start date and time of the advertisement.

***

### type

> **type**: `AdvertisementTypePg`

Defined in: src/utils/interfaces.ts:727

The type of the advertisement.

***

### updatedAt

> **updatedAt**: `string`

Defined in: src/utils/interfaces.ts:731

The last update date of the advertisement record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: src/utils/interfaces.ts:733

The user who last updated this advertisement.
