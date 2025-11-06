[Admin Docs](/)

***

# Interface: InterfacePledgeInfo

Defined in: [src/utils/interfaces.ts:1840](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1840)

InterfacePledgeInfo

## Description

Defines the structure for pledge information.

## Properties

### amount

> **amount**: `number`

Defined in: [src/utils/interfaces.ts:1849](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1849)

The amount of the pledge.

***

### campaign?

> `optional` **campaign**: `object`

Defined in: [src/utils/interfaces.ts:1842](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1842)

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

Defined in: [src/utils/interfaces.ts:1851](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1851)

The currency of the pledge.

***

### endDate

> **endDate**: `string`

Defined in: [src/utils/interfaces.ts:1852](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1852)

The end date of the pledge.

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:1841](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1841)

The unique identifier of the pledge.

***

### note?

> `optional` **note**: `string`

Defined in: [src/utils/interfaces.ts:1850](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1850)

***

### pledger

> **pledger**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: [src/utils/interfaces.ts:1854](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1854)

***

### startDate

> **startDate**: `string`

Defined in: [src/utils/interfaces.ts:1853](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1853)

The start date of the pledge.
