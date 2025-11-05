[Admin Docs](/)

***

# Interface: InterfacePledgeInfoPG

Defined in: [src/utils/interfaces.ts:1870](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1870)

InterfacePledgeInfoPG

## Description

Defines the structure for pledge information with PostgreSQL-specific fields.

## Properties

### amount

> **amount**: `number`

Defined in: [src/utils/interfaces.ts:1879](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1879)

The amount of the pledge.

***

### campaign?

> `optional` **campaign**: `object`

Defined in: [src/utils/interfaces.ts:1872](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1872)

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

Defined in: [src/utils/interfaces.ts:1880](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1880)

The currency code of the pledge.

***

### endAt

> **endAt**: `string`

Defined in: [src/utils/interfaces.ts:1881](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1881)

The end date of the pledge.

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:1871](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1871)

The unique identifier of the pledge.

***

### pledger

> **pledger**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)

Defined in: [src/utils/interfaces.ts:1883](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1883)

***

### startAt

> **startAt**: `string`

Defined in: [src/utils/interfaces.ts:1882](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1882)

The start date of the pledge.
