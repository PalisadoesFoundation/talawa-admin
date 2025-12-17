[Admin Docs](/)

***

# Interface: InterfaceTagFolderPg

Defined in: src/utils/interfaces.ts:1166

InterfaceTagFolderPg

## Description

Defines the structure for a tag folder with PostgreSQL-specific fields.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: src/utils/interfaces.ts:1169

The creation date of the tag folder record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: src/utils/interfaces.ts:1171

The user who created this tag folder.

***

### id

> **id**: `ID`

Defined in: src/utils/interfaces.ts:1167

The unique identifier of the tag folder.

***

### name

> **name**: `string`

Defined in: src/utils/interfaces.ts:1168

The name of the tag folder.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: src/utils/interfaces.ts:1173

The organization associated with this tag folder.

***

### updatedAt

> **updatedAt**: `string`

Defined in: src/utils/interfaces.ts:1170

The last update date of the tag folder record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: src/utils/interfaces.ts:1172

The user who last updated this tag folder.
