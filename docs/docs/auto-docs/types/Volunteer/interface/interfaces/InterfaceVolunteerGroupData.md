[Admin Docs](/)

***

# Interface: InterfaceVolunteerGroupData

Defined in: [src/types/Volunteer/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L32)

InterfaceVolunteerGroupData

## Description

Defines the structure for volunteer group data used in mutations.

## Properties

### description

> **description**: `string`

Defined in: [src/types/Volunteer/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L36)

The description of the volunteer group.

***

### eventId

> **eventId**: `string`

Defined in: [src/types/Volunteer/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L33)

The event ID, can be undefined for recurring events when baseEvent is used.

***

### leaderId?

> `optional` **leaderId**: `string`

Defined in: [src/types/Volunteer/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L34)

Optional leader ID for the volunteer group.

***

### name

> **name**: `string`

Defined in: [src/types/Volunteer/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L35)

The name of the volunteer group.

***

### recurringEventInstanceId?

> `optional` **recurringEventInstanceId**: `string`

Defined in: [src/types/Volunteer/interface.ts:40](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L40)

Optional instance ID for recurring events.

***

### scope?

> `optional` **scope**: `"ENTIRE_SERIES"` \| `"THIS_INSTANCE_ONLY"`

Defined in: [src/types/Volunteer/interface.ts:39](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L39)

Optional scope for recurring events.

***

### volunteersRequired

> **volunteersRequired**: `number`

Defined in: [src/types/Volunteer/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L37)

The number of volunteers required, or null if not specified.

***

### volunteerUserIds

> **volunteerUserIds**: `string`[]

Defined in: [src/types/Volunteer/interface.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L38)

Array of user IDs for volunteer group members.
