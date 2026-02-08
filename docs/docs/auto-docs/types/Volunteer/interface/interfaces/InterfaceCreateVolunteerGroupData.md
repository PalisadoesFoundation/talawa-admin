[Admin Docs](/)

***

# Interface: InterfaceCreateVolunteerGroupData

Defined in: [src/types/Volunteer/interface.ts:318](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L318)

Defines the structure for create volunteer group mutation data.

## Param

The event ID.

## Param

(Optional) The ID of the group leader.

## Param

The name of the volunteer group.

## Param

(Optional) The description of the volunteer group.

## Param

(Optional) Number of volunteers required.

## Param

Array of volunteer user IDs.

## Param

(Optional) Scope for recurring events.

## Param

(Optional) Instance ID for recurring events.

## Properties

### description?

> `optional` **description**: `string`

Defined in: [src/types/Volunteer/interface.ts:322](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L322)

***

### eventId

> **eventId**: `string`

Defined in: [src/types/Volunteer/interface.ts:319](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L319)

***

### leaderId?

> `optional` **leaderId**: `string`

Defined in: [src/types/Volunteer/interface.ts:320](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L320)

***

### name

> **name**: `string`

Defined in: [src/types/Volunteer/interface.ts:321](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L321)

***

### recurringEventInstanceId?

> `optional` **recurringEventInstanceId**: `string`

Defined in: [src/types/Volunteer/interface.ts:326](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L326)

***

### scope?

> `optional` **scope**: `"ENTIRE_SERIES"` \| `"THIS_INSTANCE_ONLY"`

Defined in: [src/types/Volunteer/interface.ts:325](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L325)

***

### volunteersRequired?

> `optional` **volunteersRequired**: `number`

Defined in: [src/types/Volunteer/interface.ts:323](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L323)

***

### volunteerUserIds

> **volunteerUserIds**: `string`[]

Defined in: [src/types/Volunteer/interface.ts:324](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L324)
