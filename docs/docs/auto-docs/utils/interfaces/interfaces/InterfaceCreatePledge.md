[Admin Docs](/)

***

# Interface: InterfaceCreatePledge

Defined in: [src/utils/interfaces.ts:2180](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2180)

InterfaceCreatePledge

## Description

Defines the structure for creating a pledge.

## Properties

### pledgeAmount

> **pledgeAmount**: `number`

Defined in: [src/utils/interfaces.ts:2182](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2182)

The amount of the pledge.

***

### pledgeCurrency

> **pledgeCurrency**: `string`

Defined in: [src/utils/interfaces.ts:2183](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2183)

The currency of the pledge.

***

### pledgeEndDate

> **pledgeEndDate**: `Date`

Defined in: [src/utils/interfaces.ts:2185](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2185)

The end date of the pledge.

***

### pledgeStartDate

> **pledgeStartDate**: `Date`

Defined in: [src/utils/interfaces.ts:2184](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2184)

The start date of the pledge.

***

### pledgeUsers

> **pledgeUsers**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)[]

Defined in: [src/utils/interfaces.ts:2181](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2181)

An array of user information for the pledgers.
