[Admin Docs](/)

***

# Interface: InterfacePledgeInfoPG

Defined in: src/utils/interfaces.ts:1882

InterfacePledgeInfoPG

## Description

Defines the structure for pledge information with PostgreSQL-specific fields.

## Properties

### amount

> **amount**: `number`

Defined in: src/utils/interfaces.ts:1891

The amount of the pledge.

***

### campaign?

> `optional` **campaign**: `object`

Defined in: src/utils/interfaces.ts:1884

The campaign associated with the pledge (optional).

#### currencyCode

> **currencyCode**: `string`

#### endDate

> **endDate**: `Date`

#### goalAmount

> **goalAmount**: `number`

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### currencyCode

> **currencyCode**: `string`

Defined in: src/utils/interfaces.ts:1892

The currency code of the pledge.

***

### endAt

> **endAt**: `string`

Defined in: src/utils/interfaces.ts:1893

The end date of the pledge.

***

### id

> **id**: `string`

Defined in: src/utils/interfaces.ts:1883

The unique identifier of the pledge.

***

### pledger

> **pledger**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: src/utils/interfaces.ts:1895

***

### startAt

> **startAt**: `string`

Defined in: src/utils/interfaces.ts:1894

The start date of the pledge.
