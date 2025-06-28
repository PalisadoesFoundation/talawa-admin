[Admin Docs](/)

***

# Interface: InterfaceEventVolunteerInfo

Defined in: [src/utils/interfaces.ts:2463](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2463)

InterfaceEventVolunteerInfo

## Description

Defines the structure for event volunteer information.

## Properties

### /_id

> **/_id**: `string`

Defined in: [src/utils/interfaces.ts:2464](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2464)

The unique identifier of the event volunteer.

***

### assignments

> **assignments**: `object`[]

Defined in: [src/utils/interfaces.ts:2468](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2468)

An array of assignments for the volunteer.

#### /_id

> **/_id**: `string`

***

### groups

> **groups**: `object`[]

Defined in: [src/utils/interfaces.ts:2471](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2471)

An array of groups the volunteer belongs to.

#### /_id

> **/_id**: `string`

#### name

> **name**: `string`

#### volunteers

> **volunteers**: `object`[]

***

### hasAccepted

> **hasAccepted**: `boolean`

Defined in: [src/utils/interfaces.ts:2465](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2465)

Indicates if the volunteer has accepted.

***

### hoursVolunteered

> **hoursVolunteered**: `number`

Defined in: [src/utils/interfaces.ts:2466](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2466)

The number of hours volunteered, or null.

***

### user

> **user**: [`InterfaceUserInfo`]/auto-docs/utils/interfaces/README/interfaces/InterfaceUserInfo

Defined in: [src/utils/interfaces.ts:2467](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2467)

The user information of the volunteer.
