[Admin Docs](/)

***

# Interface: InterfaceCreateVolunteerGroup

Defined in: [src/utils/interfaces.ts:2534](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2534)

InterfaceCreateVolunteerGroup

## Description

Defines the structure for creating a volunteer group.

## Properties

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:2536](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2536)

The description of the volunteer group, or null.

***

### leader

> **leader**: [`InterfaceUserInfo`](InterfaceUserInfo.md)

Defined in: [src/utils/interfaces.ts:2537](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2537)

The leader of the volunteer group, or null.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:2535](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2535)

The name of the volunteer group.

***

### volunteersRequired

> **volunteersRequired**: `number`

Defined in: [src/utils/interfaces.ts:2538](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2538)

The number of volunteers required for the group, or null.

***

### volunteerUsers

> **volunteerUsers**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)[]

Defined in: [src/utils/interfaces.ts:2539](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2539)

An array of user information for the volunteers in the group.
