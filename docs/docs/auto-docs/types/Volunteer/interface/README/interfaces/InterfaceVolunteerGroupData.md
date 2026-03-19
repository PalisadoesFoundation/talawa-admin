[Admin Docs](/)

***

# Interface: InterfaceVolunteerGroupData

Defined in: [src/types/Volunteer/interface.ts:22](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L22)

Defines the structure for volunteer group data used in mutations.

## Properties

### description

> **description**: `string`

Defined in: [src/types/Volunteer/interface.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L30)

The description of the volunteer group.

***

### eventId

> **eventId**: `string`

Defined in: [src/types/Volunteer/interface.ts:24](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L24)

The event ID, can be undefined for recurring events when baseEvent is used.

***

### leaderId?

> `optional` **leaderId**: `string`

Defined in: [src/types/Volunteer/interface.ts:26](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L26)

(Optional) leader ID for the volunteer group.

***

### name

> **name**: `string`

Defined in: [src/types/Volunteer/interface.ts:28](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L28)

The name of the volunteer group.

***

### recurringEventInstanceId?

> `optional` **recurringEventInstanceId**: `string`

Defined in: [src/types/Volunteer/interface.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L38)

(Optional) instance ID for recurring events.

***

### scope?

> `optional` **scope**: `"ENTIRE_SERIES"` \| `"THIS_INSTANCE_ONLY"`

Defined in: [src/types/Volunteer/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L36)

(Optional) scope for recurring events.

***

### volunteersRequired

> **volunteersRequired**: `number`

Defined in: [src/types/Volunteer/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L32)

The number of volunteers required, or null if not specified.

***

### volunteerUserIds

> **volunteerUserIds**: `string`[]

Defined in: [src/types/Volunteer/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L34)

Array of user IDs for volunteer group members.
