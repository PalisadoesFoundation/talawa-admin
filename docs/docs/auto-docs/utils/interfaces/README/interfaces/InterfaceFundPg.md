[Admin Docs](/)

***

# Interface: InterfaceFundPg

Defined in: [src/utils/interfaces.ts:1124](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1124)

InterfaceFundPg

## Description

Defines the structure for a fund with PostgreSQL-specific fields.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1128](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1128)

The creation date of the fund record.

***

### creator

> **creator**: [`InterfaceUserPg`]/auto-docs/utils/interfaces/README/interfaces/InterfaceUserPg

Defined in: [src/utils/interfaces.ts:1130](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1130)

The user who created this fund.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1125](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1125)

The unique identifier of the fund.

***

### isTaxDeductible

> **isTaxDeductible**: `boolean`

Defined in: [src/utils/interfaces.ts:1132](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1132)

Indicates if the fund is tax deductible.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1126](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1126)

The name of the fund.

***

### organization

> **organization**: [`InterfaceOrganizationPg`]/auto-docs/utils/interfaces/README/interfaces/InterfaceOrganizationPg

Defined in: [src/utils/interfaces.ts:1127](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1127)

The organization associated with this fund.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1129](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1129)

The last update date of the fund record.

***

### updater

> **updater**: [`InterfaceUserPg`]/auto-docs/utils/interfaces/README/interfaces/InterfaceUserPg

Defined in: [src/utils/interfaces.ts:1131](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1131)

The user who last updated this fund.
