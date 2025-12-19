[Admin Docs](/)

***

# Interface: InterfaceCreateVolunteerGroup

Defined in: [src/utils/interfaces.ts:2517](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2517)

InterfaceCreateVolunteerGroup

## Description

Defines the structure for creating a volunteer group.

## Properties

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:2519](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2519)

The description of the volunteer group, or null.

***

### leader

> **leader**: [`InterfaceUserInfo`](InterfaceUserInfo.md)

Defined in: [src/utils/interfaces.ts:2520](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2520)

The leader of the volunteer group, or null.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:2518](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2518)

The name of the volunteer group.

***

### volunteersRequired

> **volunteersRequired**: `number`

Defined in: [src/utils/interfaces.ts:2521](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2521)

The number of volunteers required for the group, or null.

***

### volunteerUsers

> **volunteerUsers**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)[]

Defined in: [src/utils/interfaces.ts:2522](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2522)

An array of user information for the volunteers in the group.
