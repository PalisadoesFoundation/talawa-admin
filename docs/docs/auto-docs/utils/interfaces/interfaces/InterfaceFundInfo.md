[Admin Docs](/)

***

# Interface: InterfaceFundInfo

Defined in: [src/utils/interfaces.ts:1825](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1825)

InterfaceFundInfo

## Description

Defines the structure for fund information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1832](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1832)

The creation date of the fund record.

***

### creator

> **creator**: `object`

Defined in: [src/utils/interfaces.ts:1834](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1834)

The creator of the fund.

#### name

> **name**: `string`

***

### edges

> **edges**: `object`

Defined in: [src/utils/interfaces.ts:1839](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1839)

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

Defined in: [src/utils/interfaces.ts:1826](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1826)

The unique identifier of the fund.

***

### isArchived

> **isArchived**: `boolean`

Defined in: [src/utils/interfaces.ts:1830](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1830)

Indicates if the fund is archived.

***

### isDefault

> **isDefault**: `boolean`

Defined in: [src/utils/interfaces.ts:1831](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1831)

Indicates if the fund is the default fund.

***

### isTaxDeductible

> **isTaxDeductible**: `boolean`

Defined in: [src/utils/interfaces.ts:1829](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1829)

Indicates if the fund is tax deductible.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1827](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1827)

The name of the fund.

***

### organization

> **organization**: `object`

Defined in: [src/utils/interfaces.ts:1835](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1835)

The organization associated with the fund.

#### name

> **name**: `string`

***

### organizationId

> **organizationId**: `string`

Defined in: [src/utils/interfaces.ts:1833](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1833)

The unique identifier of the associated organization.

***

### refrenceNumber

> **refrenceNumber**: `string`

Defined in: [src/utils/interfaces.ts:1828](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1828)

The reference number of the fund.

***

### updater

> **updater**: `object`

Defined in: [src/utils/interfaces.ts:1836](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1836)

The updater of the fund.

#### name

> **name**: `string`
