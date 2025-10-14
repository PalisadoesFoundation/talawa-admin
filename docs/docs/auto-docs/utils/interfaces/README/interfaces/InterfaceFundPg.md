[Admin Docs](/)

***

# Interface: InterfaceFundPg

Defined in: [src/utils/interfaces.ts:1024](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1024)

InterfaceFundPg

## Description

Defines the structure for a fund with PostgreSQL-specific fields.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1028](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1028)

The creation date of the fund record.

***

### creator

> **creator**: [`InterfaceUserPg`](utils\interfaces\README\interfaces\InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1030](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1030)

The user who created this fund.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1025](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1025)

The unique identifier of the fund.

***

### isTaxDeductible

> **isTaxDeductible**: `boolean`

Defined in: [src/utils/interfaces.ts:1032](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1032)

Indicates if the fund is tax deductible.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1026](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1026)

The name of the fund.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](utils\interfaces\README\interfaces\InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:1027](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1027)

The organization associated with this fund.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1029](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1029)

The last update date of the fund record.

***

### updater

> **updater**: [`InterfaceUserPg`](utils\interfaces\README\interfaces\InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1031](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1031)

The user who last updated this fund.
