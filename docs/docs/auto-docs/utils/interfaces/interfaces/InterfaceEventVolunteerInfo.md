[Admin Docs](/)

***

# Interface: InterfaceEventVolunteerInfo

Defined in: [src/utils/interfaces.ts:2341](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2341)

InterfaceEventVolunteerInfo

## Description

Defines the structure for event volunteer information.

## Properties

### \_id

> **\_id**: `string`

Defined in: [src/utils/interfaces.ts:2342](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2342)

The unique identifier of the event volunteer.

***

### assignments

> **assignments**: `object`[]

Defined in: [src/utils/interfaces.ts:2346](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2346)

An array of assignments for the volunteer.

#### \_id

> **\_id**: `string`

***

### groups

> **groups**: `object`[]

Defined in: [src/utils/interfaces.ts:2349](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2349)

An array of groups the volunteer belongs to.

#### \_id

> **\_id**: `string`

#### name

> **name**: `string`

#### volunteers

> **volunteers**: `object`[]

***

### hasAccepted

> **hasAccepted**: `boolean`

Defined in: [src/utils/interfaces.ts:2343](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2343)

Indicates if the volunteer has accepted.

***

### hoursVolunteered

> **hoursVolunteered**: `number`

Defined in: [src/utils/interfaces.ts:2344](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2344)

The number of hours volunteered, or null.

***

### user

> **user**: [`InterfaceUserInfo`](InterfaceUserInfo.md)

Defined in: [src/utils/interfaces.ts:2345](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2345)

The user information of the volunteer.
