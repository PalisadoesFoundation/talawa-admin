[Admin Docs](/)

***

# Interface: InterfaceCreatePledge

Defined in: [src/utils/interfaces.ts:2195](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2195)

InterfaceCreatePledge

## Description

Defines the structure for creating a pledge.

## Properties

### pledgeAmount

> **pledgeAmount**: `number`

Defined in: [src/utils/interfaces.ts:2197](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2197)

The amount of the pledge.

***

### pledgeCurrency

> **pledgeCurrency**: `string`

Defined in: [src/utils/interfaces.ts:2198](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2198)

The currency of the pledge.

***

### pledgeEndDate

> **pledgeEndDate**: `Date`

Defined in: [src/utils/interfaces.ts:2200](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2200)

The end date of the pledge.

***

### pledgeStartDate

> **pledgeStartDate**: `Date`

Defined in: [src/utils/interfaces.ts:2199](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2199)

The start date of the pledge.

***

### pledgeUsers

> **pledgeUsers**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)[]

Defined in: [src/utils/interfaces.ts:2196](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2196)

An array of user information for the pledgers.
