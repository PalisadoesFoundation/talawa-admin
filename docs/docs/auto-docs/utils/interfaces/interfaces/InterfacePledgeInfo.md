[Admin Docs](/)

***

# Interface: InterfacePledgeInfo

Defined in: src/utils/interfaces.ts:1843

InterfacePledgeInfo

## Description

Defines the structure for pledge information.

## Properties

### amount

> **amount**: `number`

Defined in: src/utils/interfaces.ts:1852

The amount of the pledge.

***

### campaign?

> `optional` **campaign**: `object`

Defined in: src/utils/interfaces.ts:1845

The campaign associated with the pledge (optional).

#### currencyCode

> **currencyCode**: `string`

#### endAt

> **endAt**: `Date`

#### goalAmount

> **goalAmount**: `number`

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### currency

> **currency**: `string`

Defined in: src/utils/interfaces.ts:1854

The currency of the pledge.

***

### endDate

> **endDate**: `string`

Defined in: src/utils/interfaces.ts:1855

The end date of the pledge.

***

### id

> **id**: `string`

Defined in: src/utils/interfaces.ts:1844

The unique identifier of the pledge.

***

### note?

> `optional` **note**: `string`

Defined in: src/utils/interfaces.ts:1853

***

### pledger

> **pledger**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: src/utils/interfaces.ts:1860

The primary pledger who made this pledge

***

### startDate

> **startDate**: `string`

Defined in: src/utils/interfaces.ts:1856

The start date of the pledge.

***

### users?

> `optional` **users**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)[]

Defined in: src/utils/interfaces.ts:1865

An array of user information associated with the pledge.
