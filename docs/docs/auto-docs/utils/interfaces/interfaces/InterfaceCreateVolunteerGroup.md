[Admin Docs](/)

***

# Interface: InterfaceCreateVolunteerGroup

Defined in: [src/utils/interfaces.ts:2506](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2506)

InterfaceCreateVolunteerGroup

## Description

Defines the structure for creating a volunteer group.

## Properties

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:2508](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2508)

The description of the volunteer group, or null.

***

### leader

> **leader**: [`InterfaceUserInfo`](InterfaceUserInfo.md)

Defined in: [src/utils/interfaces.ts:2509](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2509)

The leader of the volunteer group, or null.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:2507](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2507)

The name of the volunteer group.

***

### volunteersRequired

> **volunteersRequired**: `number`

Defined in: [src/utils/interfaces.ts:2510](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2510)

The number of volunteers required for the group, or null.

***

### volunteerUsers

> **volunteerUsers**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)[]

Defined in: [src/utils/interfaces.ts:2511](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2511)

An array of user information for the volunteers in the group.
