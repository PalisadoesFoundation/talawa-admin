[Admin Docs](/)

***

# Interface: InterfaceCreatePledge

Defined in: [src/utils/interfaces.ts:2227](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2227)

InterfaceCreatePledge

## Description

Defines the structure for creating a pledge.

## Properties

### pledgeAmount

> **pledgeAmount**: `number`

Defined in: [src/utils/interfaces.ts:2229](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2229)

The amount of the pledge.

***

### pledgeCurrency

> **pledgeCurrency**: `string`

Defined in: [src/utils/interfaces.ts:2230](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2230)

The currency of the pledge.

***

### pledgeEndDate

> **pledgeEndDate**: `Date`

Defined in: [src/utils/interfaces.ts:2232](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2232)

The end date of the pledge.

***

### pledgeStartDate

> **pledgeStartDate**: `Date`

Defined in: [src/utils/interfaces.ts:2231](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2231)

The start date of the pledge.

***

### pledgeUsers

> **pledgeUsers**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)[]

Defined in: [src/utils/interfaces.ts:2228](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2228)

An array of user information for the pledgers.
