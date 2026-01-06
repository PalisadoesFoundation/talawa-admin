[Admin Docs](/)

***

# Interface: InterfaceCreateVolunteerGroup

Defined in: [src/utils/interfaces.ts:2626](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2626)

InterfaceCreateVolunteerGroup
Defines the structure for creating a volunteer group.

## Properties

### description

> **description**: `string`

Defined in: [src/utils/interfaces.ts:2628](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2628)

The description of the volunteer group, or null.

***

### leader

> **leader**: [`InterfaceUserInfo`](InterfaceUserInfo.md)

Defined in: [src/utils/interfaces.ts:2629](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2629)

The leader of the volunteer group, or null.

***

### name

> **name**: `string`

Defined in: [src/utils/interfaces.ts:2627](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2627)

The name of the volunteer group.

***

### volunteersRequired

> **volunteersRequired**: `number`

Defined in: [src/utils/interfaces.ts:2630](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2630)

The number of volunteers required for the group, or null.

***

### volunteerUsers

> **volunteerUsers**: [`InterfaceUserInfoPG`](InterfaceUserInfoPG.md)[]

Defined in: [src/utils/interfaces.ts:2631](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/utils/interfaces.ts#L2631)

An array of user information for the volunteers in the group.
