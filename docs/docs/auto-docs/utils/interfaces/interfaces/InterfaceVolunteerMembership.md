[Admin Docs](/)

***

# Interface: InterfaceVolunteerMembership

Defined in: [src/utils/interfaces.ts:2490](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2490)

InterfaceVolunteerMembership

## Description

Defines the structure for volunteer membership information.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/utils/interfaces.ts:2491](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2491)

The unique identifier of the volunteer membership.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:2493](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2493)

The creation date of the volunteer membership record.

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:2494](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2494)

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

Defined in: [src/utils/interfaces.ts:2503](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2503)

The group associated with the membership.

#### \_id

> **\_id**: `string`

#### name

> **name**: `string`

***

### status

> **status**: `string`

Defined in: [src/utils/interfaces.ts:2492](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2492)

The status of the volunteer membership.

***

### volunteer

> **volunteer**: `object`

Defined in: [src/utils/interfaces.ts:2499](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2499)

The volunteer associated with the membership.

#### \_id

> **\_id**: `string`

#### user

> **user**: [`InterfaceUserInfo`](InterfaceUserInfo.md)
