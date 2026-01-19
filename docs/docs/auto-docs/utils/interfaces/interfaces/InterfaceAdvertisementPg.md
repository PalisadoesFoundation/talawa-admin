[Admin Docs](/)

***

# Interface: InterfaceAdvertisementPg

Defined in: [src/utils/interfaces.ts:726](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L726)

InterfaceAdvertisementPg

## Description

Defines the structure for an advertisement with PostgreSQL-specific fields.

## Properties

### attachments

> **attachments**: [`InterfaceAdvertisementAttachmentPg`](InterfaceAdvertisementAttachmentPg.md)[]

Defined in: [src/utils/interfaces.ts:738](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L738)

An array of attachments for the advertisement.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:733](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L733)

The creation date of the advertisement record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:735](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L735)

The user who created this advertisement.

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:729](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L729)

The description of the advertisement.

***

### endAt

> **endAt**: `string`

Defined in: [src/utils/interfaces.ts:732](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L732)

The end date and time of the advertisement.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:727](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L727)

The unique identifier of the advertisement.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:728](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L728)

The name of the advertisement.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:737](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L737)

The organization associated with this advertisement.

***

### startAt

> **startAt**: `string`

Defined in: [src/utils/interfaces.ts:731](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L731)

The start date and time of the advertisement.

***

### type

> **type**: `AdvertisementTypePg`

Defined in: [src/utils/interfaces.ts:730](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L730)

The type of the advertisement.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:734](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L734)

The last update date of the advertisement record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:736](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L736)

The user who last updated this advertisement.
