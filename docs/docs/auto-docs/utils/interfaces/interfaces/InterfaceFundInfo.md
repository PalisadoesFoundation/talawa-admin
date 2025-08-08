[Admin Docs](/)

***

# Interface: InterfaceFundInfo

Defined in: [src/utils/interfaces.ts:1777](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1777)

InterfaceFundInfo

## Description

Defines the structure for fund information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:1784](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1784)

The creation date of the fund record.

***

### creator

> **creator**: `object`

Defined in: [src/utils/interfaces.ts:1786](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1786)

The creator of the fund.

#### name

> **name**: `string`

***

### edges

> **edges**: `object`

Defined in: [src/utils/interfaces.ts:1791](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1791)

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

Defined in: [src/utils/interfaces.ts:1778](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1778)

The unique identifier of the fund.

***

### isArchived

> **isArchived**: `boolean`

Defined in: [src/utils/interfaces.ts:1782](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1782)

Indicates if the fund is archived.

***

### isDefault

> **isDefault**: `boolean`

Defined in: [src/utils/interfaces.ts:1783](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1783)

Indicates if the fund is the default fund.

***

### isTaxDeductible

> **isTaxDeductible**: `boolean`

Defined in: [src/utils/interfaces.ts:1781](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1781)

Indicates if the fund is tax deductible.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:1779](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1779)

The name of the fund.

***

### organization

> **organization**: `object`

Defined in: [src/utils/interfaces.ts:1787](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1787)

The organization associated with the fund.

#### name

> **name**: `string`

***

### organizationId

> **organizationId**: `string`

Defined in: [src/utils/interfaces.ts:1785](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1785)

The unique identifier of the associated organization.

***

### refrenceNumber

> **refrenceNumber**: `string`

Defined in: [src/utils/interfaces.ts:1780](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1780)

The reference number of the fund.

***

### updater

> **updater**: `object`

Defined in: [src/utils/interfaces.ts:1788](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1788)

The updater of the fund.

#### name

> **name**: `string`
