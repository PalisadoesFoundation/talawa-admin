[Admin Docs](/)

***

# Interface: InterfaceAdvertisementPg

Defined in: [src/utils/interfaces.ts:717](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L717)

InterfaceAdvertisementPg

## Description

Defines the structure for an advertisement with PostgreSQL-specific fields.

## Properties

### attachments

> **attachments**: [`InterfaceAdvertisementAttachmentPg`](utils\interfaces\README\interfaces\InterfaceAdvertisementAttachmentPg.md)[]

Defined in: [src/utils/interfaces.ts:729](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L729)

An array of attachments for the advertisement.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:724](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L724)

The creation date of the advertisement record.

***

### creator

> **creator**: [`InterfaceUserPg`](utils\interfaces\README\interfaces\InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:726](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L726)

The user who created this advertisement.

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:720](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L720)

The description of the advertisement.

***

### endAt

> **endAt**: `string`

Defined in: [src/utils/interfaces.ts:723](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L723)

The end date and time of the advertisement.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:718](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L718)

The unique identifier of the advertisement.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:719](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L719)

The name of the advertisement.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](utils\interfaces\README\interfaces\InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:728](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L728)

The organization associated with this advertisement.

***

### startAt

> **startAt**: `string`

Defined in: [src/utils/interfaces.ts:722](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L722)

The start date and time of the advertisement.

***

### type

> **type**: `AdvertisementTypePg`

Defined in: [src/utils/interfaces.ts:721](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L721)

The type of the advertisement.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:725](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L725)

The last update date of the advertisement record.

***

### updater

> **updater**: [`InterfaceUserPg`](utils\interfaces\README\interfaces\InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:727](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L727)

The user who last updated this advertisement.
