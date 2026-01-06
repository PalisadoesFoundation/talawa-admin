[Admin Docs](/)

***

# Interface: InterfaceFundPg

Defined in: [src/utils/interfaces.ts:991](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L991)

Defines the structure for a fund with PostgreSQL-specific fields.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:995](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L995)

The creation date of the fund record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:997](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L997)

The user who created this fund.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:992](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L992)

The unique identifier of the fund.

***

### isTaxDeductible

> **isTaxDeductible**: `boolean`

Defined in: [src/utils/interfaces.ts:999](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L999)

Indicates if the fund is tax deductible.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:993](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L993)

The name of the fund.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:994](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L994)

The organization associated with this fund.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:996](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L996)

The last update date of the fund record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:998](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L998)

The user who last updated this fund.
