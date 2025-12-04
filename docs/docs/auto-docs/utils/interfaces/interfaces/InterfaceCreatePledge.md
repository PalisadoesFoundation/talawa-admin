[Admin Docs](/)

***

# Interface: InterfaceCreatePledge

Defined in: [src/utils/interfaces.ts:2238](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2238)

InterfaceCreatePledge

## Description

Defines the structure for creating a pledge.

## Properties

### pledgeAmount

> **pledgeAmount**: `number`

Defined in: [src/utils/interfaces.ts:2240](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2240)

The amount of the pledge.

***

### pledgeCurrency

> **pledgeCurrency**: `string`

Defined in: [src/utils/interfaces.ts:2241](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2241)

The currency of the pledge.

***

### pledgeEndDate

> **pledgeEndDate**: `Date`

Defined in: [src/utils/interfaces.ts:2243](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2243)

The end date of the pledge.

***

### pledgeStartDate

> **pledgeStartDate**: `Date`

Defined in: [src/utils/interfaces.ts:2242](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2242)

The start date of the pledge.

***

### pledgeUsers

> **pledgeUsers**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)[]

Defined in: [src/utils/interfaces.ts:2239](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2239)

An array of user information for the pledgers.
