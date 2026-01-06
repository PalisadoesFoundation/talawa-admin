[Admin Docs](/)

***

# Interface: InterfaceAdvertisementPg

Defined in: [src/utils/interfaces.ts:713](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L713)

InterfaceAdvertisementPg
Defines the structure for an advertisement with PostgreSQL-specific fields.

## Properties

### attachments

> **attachments**: [`InterfaceAdvertisementAttachmentPg`](InterfaceAdvertisementAttachmentPg.md)[]

Defined in: [src/utils/interfaces.ts:725](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L725)

An array of attachments for the advertisement.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:720](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L720)

The creation date of the advertisement record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:722](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L722)

The user who created this advertisement.

***

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:716](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L716)

The description of the advertisement.

***

### endAt

> **endAt**: `string`

Defined in: [src/utils/interfaces.ts:719](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L719)

The end date and time of the advertisement.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:714](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L714)

The unique identifier of the advertisement.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:715](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L715)

The name of the advertisement.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:724](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L724)

The organization associated with this advertisement.

***

### startAt

> **startAt**: `string`

Defined in: [src/utils/interfaces.ts:718](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L718)

The start date and time of the advertisement.

***

### type

> **type**: `AdvertisementTypePg`

Defined in: [src/utils/interfaces.ts:717](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L717)

The type of the advertisement.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:721](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L721)

The last update date of the advertisement record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:723](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L723)

The user who last updated this advertisement.
