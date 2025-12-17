[Admin Docs](/)

***

# Interface: InterfaceCreateVolunteerGroupData

Defined in: src/types/Volunteer/interface.ts:326

InterfaceCreateVolunteerGroupData

## Description

Defines the structure for create volunteer group mutation data.

## Properties

### description?

> `optional` **description**: `string`

Defined in: src/types/Volunteer/interface.ts:330

The description of the volunteer group (optional).

***

### eventId

> **eventId**: `string`

Defined in: src/types/Volunteer/interface.ts:327

The event ID.

***

### leaderId?

> `optional` **leaderId**: `string`

Defined in: src/types/Volunteer/interface.ts:328

The ID of the group leader (optional).

***

### name

> **name**: `string`

Defined in: src/types/Volunteer/interface.ts:329

The name of the volunteer group.

***

### recurringEventInstanceId?

> `optional` **recurringEventInstanceId**: `string`

Defined in: src/types/Volunteer/interface.ts:334

Optional instance ID for recurring events.

***

### scope?

> `optional` **scope**: `"ENTIRE_SERIES"` \| `"THIS_INSTANCE_ONLY"`

Defined in: src/types/Volunteer/interface.ts:333

Optional scope for recurring events.

***

### volunteersRequired?

> `optional` **volunteersRequired**: `number`

Defined in: src/types/Volunteer/interface.ts:331

Number of volunteers required (optional).

***

### volunteerUserIds

> **volunteerUserIds**: `string`[]

Defined in: src/types/Volunteer/interface.ts:332

Array of volunteer user IDs.
