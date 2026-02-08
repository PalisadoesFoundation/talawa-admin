[Admin Docs](/)

***

# Interface: InterfaceVolunteerGroupData

Defined in: [src/types/Volunteer/interface.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L30)

Defines the structure for volunteer group data used in mutations.

## Param

The event ID, can be undefined for recurring events when baseEvent is used.

## Param

(Optional) leader ID for the volunteer group.

## Param

The name of the volunteer group.

## Param

The description of the volunteer group.

## Param

The number of volunteers required, or null if not specified.

## Param

Array of user IDs for volunteer group members.

## Param

(Optional) scope for recurring events.

## Param

(Optional) instance ID for recurring events.

## Properties

### description

> **description**: `string`

Defined in: [src/types/Volunteer/interface.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L34)

***

### eventId

> **eventId**: `string`

Defined in: [src/types/Volunteer/interface.ts:31](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L31)

***

### leaderId?

> `optional` **leaderId**: `string`

Defined in: [src/types/Volunteer/interface.ts:32](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L32)

***

### name

> **name**: `string`

Defined in: [src/types/Volunteer/interface.ts:33](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L33)

***

### recurringEventInstanceId?

> `optional` **recurringEventInstanceId**: `string`

Defined in: [src/types/Volunteer/interface.ts:38](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L38)

***

### scope?

> `optional` **scope**: `"ENTIRE_SERIES"` \| `"THIS_INSTANCE_ONLY"`

Defined in: [src/types/Volunteer/interface.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L37)

***

### volunteersRequired

> **volunteersRequired**: `number`

Defined in: [src/types/Volunteer/interface.ts:35](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L35)

***

### volunteerUserIds

> **volunteerUserIds**: `string`[]

Defined in: [src/types/Volunteer/interface.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L36)
