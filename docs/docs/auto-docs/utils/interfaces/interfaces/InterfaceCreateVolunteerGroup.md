[Admin Docs](/)

***

# Interface: InterfaceCreateVolunteerGroup

Defined in: [src/utils/interfaces.ts:2416](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2416)

InterfaceCreateVolunteerGroup

## Description

Defines the structure for creating a volunteer group.

## Properties

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:2418](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2418)

The description of the volunteer group, or null.

***

### leader

> **leader**: [`InterfaceUserInfo`](InterfaceUserInfo.md)

Defined in: [src/utils/interfaces.ts:2419](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2419)

The leader of the volunteer group, or null.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:2417](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2417)

The name of the volunteer group.

***

### volunteersRequired

> **volunteersRequired**: `number`

Defined in: [src/utils/interfaces.ts:2420](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2420)

The number of volunteers required for the group, or null.

***

### volunteerUsers

> **volunteerUsers**: [`InterfaceUserInfo`](InterfaceUserInfo.md)[]

Defined in: [src/utils/interfaces.ts:2421](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2421)

An array of user information for the volunteers in the group.
