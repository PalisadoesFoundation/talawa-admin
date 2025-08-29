[Admin Docs](/)

***

# Interface: InterfaceVolunteerMembership

Defined in: [src/utils/interfaces.ts:2500](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2500)

InterfaceVolunteerMembership

## Description

Defines the structure for volunteer membership information.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/utils/interfaces.ts:2501](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2501)

The unique identifier of the volunteer membership.

***

### createdAt

> **createdAt**: `string`

Defined in: [src/utils/interfaces.ts:2503](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2503)

The creation date of the volunteer membership record.

***

### event

> **event**: `object`

Defined in: [src/utils/interfaces.ts:2504](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2504)

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

Defined in: [src/utils/interfaces.ts:2513](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2513)

The group associated with the membership.

#### \_id

> **\_id**: `string`

#### name

> **name**: `string`

***

### status

> **status**: `string`

Defined in: [src/utils/interfaces.ts:2502](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2502)

The status of the volunteer membership.

***

### volunteer

> **volunteer**: `object`

Defined in: [src/utils/interfaces.ts:2509](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2509)

The volunteer associated with the membership.

#### \_id

> **\_id**: `string`

#### user

> **user**: [`InterfaceUserInfo`](InterfaceUserInfo.md)
