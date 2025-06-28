[Admin Docs](/)

***

# Interface: InterfacePledgeInfo

Defined in: [src/utils/interfaces.ts:1940](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1940)

InterfacePledgeInfo

## Description

Defines the structure for pledge information.

## Properties

### amount

> **amount**: `number`

Defined in: [src/utils/interfaces.ts:1943](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1943)

The amount of the pledge.

***

### campaign?

> `optional` **campaign**: `object`

Defined in: [src/utils/interfaces.ts:1942](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1942)

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

Defined in: [src/utils/interfaces.ts:1944](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1944)

The currency of the pledge.

***

### endDate

> **endDate**: `string`

Defined in: [src/utils/interfaces.ts:1945](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1945)

The end date of the pledge.

***

### id

> **id**: `string`

Defined in: [src/utils/interfaces.ts:1941](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1941)

The unique identifier of the pledge.

***

### startDate

> **startDate**: `string`

Defined in: [src/utils/interfaces.ts:1946](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1946)

The start date of the pledge.

***

### users

> **users**: [`InterfaceUserInfoPG`]/auto-docs/utils/interfaces/README/interfaces/InterfaceUserInfoPG[]

Defined in: [src/utils/interfaces.ts:1947](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L1947)

An array of user information associated with the pledge.
