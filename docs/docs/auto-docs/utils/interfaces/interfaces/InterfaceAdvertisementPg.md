[Admin Docs](/)

***

# Interface: InterfaceAdvertisementPg

Defined in: [src/utils/interfaces.ts:749](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L749)

InterfaceAdvertisementPg

## Description

Defines the structure for an advertisement with PostgreSQL-specific fields.

## Properties

### attachments

> **attachments**: [`InterfaceAdvertisementAttachmentPg`](InterfaceAdvertisementAttachmentPg.md)[]

Defined in: [src/utils/interfaces.ts:761](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L761)

An array of attachments for the advertisement.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:756](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L756)

The creation date of the advertisement record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:758](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L758)

The user who created this advertisement.

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:752](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L752)

The description of the advertisement.

***

### endAt

> **endAt**: `string`

Defined in: [src/utils/interfaces.ts:755](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L755)

The end date and time of the advertisement.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:750](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L750)

The unique identifier of the advertisement.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:751](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L751)

The name of the advertisement.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:760](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L760)

The organization associated with this advertisement.

***

### startAt

> **startAt**: `string`

Defined in: [src/utils/interfaces.ts:754](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L754)

The start date and time of the advertisement.

***

### type

> **type**: `AdvertisementTypePg`

Defined in: [src/utils/interfaces.ts:753](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L753)

The type of the advertisement.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:757](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L757)

The last update date of the advertisement record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:759](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L759)

The user who last updated this advertisement.
