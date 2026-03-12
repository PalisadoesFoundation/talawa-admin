[Admin Docs](/)

***

# Interface: InterfaceCreateVolunteerGroupData

Defined in: [src/types/Volunteer/interface.ts:312](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L312)

Defines the structure for create volunteer group mutation data.

## Properties

### description?

> `optional` **description**: `string`

Defined in: [src/types/Volunteer/interface.ts:320](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L320)

(Optional) The description of the volunteer group.

***

### eventId

> **eventId**: `string`

Defined in: [src/types/Volunteer/interface.ts:314](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L314)

The event ID.

***

### leaderId?

> `optional` **leaderId**: `string`

Defined in: [src/types/Volunteer/interface.ts:316](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L316)

(Optional) The ID of the group leader.

***

### name

> **name**: `string`

Defined in: [src/types/Volunteer/interface.ts:318](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L318)

The name of the volunteer group.

***

### recurringEventInstanceId?

> `optional` **recurringEventInstanceId**: `string`

Defined in: [src/types/Volunteer/interface.ts:328](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L328)

(Optional) Instance ID for recurring events.

***

### scope?

> `optional` **scope**: `"ENTIRE_SERIES"` \| `"THIS_INSTANCE_ONLY"`

Defined in: [src/types/Volunteer/interface.ts:326](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L326)

(Optional) Scope for recurring events.

***

### volunteersRequired?

> `optional` **volunteersRequired**: `number`

Defined in: [src/types/Volunteer/interface.ts:322](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L322)

(Optional) Number of volunteers required.

***

### volunteerUserIds

> **volunteerUserIds**: `string`[]

Defined in: [src/types/Volunteer/interface.ts:324](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L324)

Array of volunteer user IDs.
