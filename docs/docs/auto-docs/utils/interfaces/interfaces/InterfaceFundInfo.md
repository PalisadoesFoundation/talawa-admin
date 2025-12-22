[Admin Docs](/)

***

# Interface: InterfaceFundInfo

Defined in: [src/utils/interfaces.ts:1847](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1847)

InterfaceFundInfo

## Description

Defines the structure for fund information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1854](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1854)

The creation date of the fund record.

***

### creator

> **creator**: `object`

Defined in: [src/utils/interfaces.ts:1856](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1856)

The creator of the fund.

#### name

> **name**: `string`

***

### edges

> **edges**: `object`

Defined in: [src/utils/interfaces.ts:1861](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1861)

The edges connection object.

#### node

> **node**: `object`

##### node.createdAt

> **createdAt**: `string`

##### node.currency

> **currency**: `string`

##### node.endDate

> **endDate**: `string`

##### node.fundingGoal

> **fundingGoal**: `number`

##### node.id

> **id**: `string`

##### node.name

> **name**: `string`

##### node.startDate

> **startDate**: `string`

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:1848](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1848)

The unique identifier of the fund.

***

### isArchived

> **isArchived**: `boolean`

Defined in: [src/utils/interfaces.ts:1852](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1852)

Indicates if the fund is archived.

***

### isDefault

> **isDefault**: `boolean`

Defined in: [src/utils/interfaces.ts:1853](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1853)

Indicates if the fund is the default fund.

***

### isTaxDeductible

> **isTaxDeductible**: `boolean`

Defined in: [src/utils/interfaces.ts:1851](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1851)

Indicates if the fund is tax deductible.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1849](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1849)

The name of the fund.

***

### organization

> **organization**: `object`

Defined in: [src/utils/interfaces.ts:1857](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1857)

The organization associated with the fund.

#### name

> **name**: `string`

***

### organizationId

> **organizationId**: `string`

Defined in: [src/utils/interfaces.ts:1855](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1855)

The unique identifier of the associated organization.

***

### refrenceNumber

> **refrenceNumber**: `string`

Defined in: [src/utils/interfaces.ts:1850](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1850)

The reference number of the fund.

***

### updater

> **updater**: `object`

Defined in: [src/utils/interfaces.ts:1858](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1858)

The updater of the fund.

#### name

> **name**: `string`
