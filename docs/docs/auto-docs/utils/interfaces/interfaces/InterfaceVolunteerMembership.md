[Admin Docs](/)

***

# Interface: InterfaceVolunteerMembership

Defined in: [src/utils/interfaces.ts:2492](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2492)

InterfaceVolunteerMembership

## Description

Defines the structure for volunteer membership information.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/utils/interfaces.ts:2493](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2493)

The unique identifier of the volunteer membership.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:2495](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2495)

The creation date of the volunteer membership record.

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:2496](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2496)

The event associated with the volunteer membership.

#### \_id

> **\_id**: `string`

#### startDate

> **startDate**: `string`

#### title

> **title**: `string`

***

### group

> **group**: `object`

Defined in: [src/utils/interfaces.ts:2505](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2505)

The group associated with the membership.

#### \_id

> **\_id**: `string`

#### name

> **name**: `string`

***

### status

> **status**: `string`

Defined in: [src/utils/interfaces.ts:2494](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2494)

The status of the volunteer membership.

***

### volunteer

> **volunteer**: `object`

Defined in: [src/utils/interfaces.ts:2501](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2501)

The volunteer associated with the membership.

#### \_id

> **\_id**: `string`

#### user

> **user**: [`InterfaceUserInfo`](InterfaceUserInfo.md)
