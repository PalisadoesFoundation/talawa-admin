[**talawa-admin**](../../../README.md)

***

# Interface: InterfaceFundPg

Defined in: [src/utils/interfaces.ts:1027](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1027)

InterfaceFundPg

## Description

Defines the structure for a fund with PostgreSQL-specific fields.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1031](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1031)

The creation date of the fund record.

***

### creator

> **creator**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1033](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1033)

The user who created this fund.

***

### id

> **id**: `ID`

Defined in: [src/utils/interfaces.ts:1028](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1028)

The unique identifier of the fund.

***

### isTaxDeductible

> **isTaxDeductible**: `boolean`

Defined in: [src/utils/interfaces.ts:1035](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1035)

Indicates if the fund is tax deductible.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1029](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1029)

The name of the fund.

***

### organization

> **organization**: [`InterfaceOrganizationPg`](InterfaceOrganizationPg.md)

Defined in: [src/utils/interfaces.ts:1030](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1030)

The organization associated with this fund.

***

### updatedAt

> **updatedAt**: `string`

Defined in: [src/utils/interfaces.ts:1032](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1032)

The last update date of the fund record.

***

### updater

> **updater**: [`InterfaceUserPg`](InterfaceUserPg.md)

Defined in: [src/utils/interfaces.ts:1034](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/utils/interfaces.ts#L1034)

The user who last updated this fund.
