[Admin Docs](/)

***

# Interface: InterfaceEventPg

Defined in: [src/utils/interfaces.ts:1057](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1057)

InterfaceEventPg

## Description

Defines the structure for an event with PostgreSQL-specific fields.

## Properties

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:1058](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1058)

The event object.

#### attachments

> **attachments**: [`InterfaceEventAttachmentPg`](InterfaceEventAttachmentPg.md)[]

#### createdAt

> **createdAt**: `string`

#### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

#### description

> **description**: `string`

#### endAt

> **endAt**: `string`

#### id

> **id**: `ID`

#### name

> **name**: `string`

#### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

#### startAt

> **startAt**: `string`

#### updatedAt

> **updatedAt**: `string`

#### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)
