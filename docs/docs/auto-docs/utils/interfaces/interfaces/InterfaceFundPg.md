[Admin Docs](/)

***

# Interface: InterfaceFundPg

Defined in: [src/utils/interfaces.ts:1017](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1017)

InterfaceFundPg
Defines the structure for a fund with PostgreSQL-specific fields.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1021](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1021)

The creation date of the fund record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1023](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1023)

The user who created this fund.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1018](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1018)

The unique identifier of the fund.

***

### isTaxDeductible

> **isTaxDeductible**: `boolean`

Defined in: [src/utils/interfaces.ts:1025](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1025)

Indicates if the fund is tax deductible.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1019](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1019)

The name of the fund.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:1020](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1020)

The organization associated with this fund.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1022](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1022)

The last update date of the fund record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1024](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1024)

The user who last updated this fund.
