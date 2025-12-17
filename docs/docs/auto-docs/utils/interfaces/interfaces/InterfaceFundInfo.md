[Admin Docs](/)

***

# Interface: InterfaceFundInfo

Defined in: src/utils/interfaces.ts:1783

InterfaceFundInfo

## Description

Defines the structure for fund information.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: src/utils/interfaces.ts:1790

The creation date of the fund record.

***

### creator

> **creator**: `object`

Defined in: src/utils/interfaces.ts:1792

The creator of the fund.

#### name

> **name**: `string`

***

### edges

> **edges**: `object`

Defined in: src/utils/interfaces.ts:1797

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

Defined in: src/utils/interfaces.ts:1784

The unique identifier of the fund.

***

### isArchived

> **isArchived**: `boolean`

Defined in: src/utils/interfaces.ts:1788

Indicates if the fund is archived.

***

### isDefault

> **isDefault**: `boolean`

Defined in: src/utils/interfaces.ts:1789

Indicates if the fund is the default fund.

***

### isTaxDeductible

> **isTaxDeductible**: `boolean`

Defined in: src/utils/interfaces.ts:1787

Indicates if the fund is tax deductible.

***

### name

> **name**: `string`

Defined in: src/utils/interfaces.ts:1785

The name of the fund.

***

### organization

> **organization**: `object`

Defined in: src/utils/interfaces.ts:1793

The organization associated with the fund.

#### name

> **name**: `string`

***

### organizationId

> **organizationId**: `string`

Defined in: src/utils/interfaces.ts:1791

The unique identifier of the associated organization.

***

### refrenceNumber

> **refrenceNumber**: `string`

Defined in: src/utils/interfaces.ts:1786

The reference number of the fund.

***

### updater

> **updater**: `object`

Defined in: src/utils/interfaces.ts:1794

The updater of the fund.

#### name

> **name**: `string`
