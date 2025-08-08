[Admin Docs](/)

***

# Interface: InterfacePledgeInfo

Defined in: [src/utils/interfaces.ts:1837](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1837)

InterfacePledgeInfo

## Description

Defines the structure for pledge information.

## Properties

### amount

> **amount**: `number`

Defined in: [src/utils/interfaces.ts:1840](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1840)

The amount of the pledge.

***

### campaign?

> `optional` **campaign**: `object`

Defined in: [src/utils/interfaces.ts:1839](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1839)

The campaign associated with the pledge (optional).

#### endDate

> **endDate**: `Date`

#### id

> **id**: `string`

#### name

> **name**: `string`

***

### currency

> **currency**: `string`

Defined in: [src/utils/interfaces.ts:1841](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1841)

The currency of the pledge.

***

### endDate

> **endDate**: `string`

Defined in: [src/utils/interfaces.ts:1842](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1842)

The end date of the pledge.

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:1838](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1838)

The unique identifier of the pledge.

***

### startDate

> **startDate**: `string`

Defined in: [src/utils/interfaces.ts:1843](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1843)

The start date of the pledge.

***

### users

> **users**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)[]

Defined in: [src/utils/interfaces.ts:1844](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1844)

An array of user information associated with the pledge.
