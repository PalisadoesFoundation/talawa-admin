[Admin Docs](/)

***

# Interface: InterfaceVolunteerData

Defined in: src/types/Volunteer/interface.ts:11

InterfaceVolunteerData

## Description

Defines the structure for volunteer data used in mutations.

## Properties

### event

> **event**: `string`

Defined in: src/types/Volunteer/interface.ts:12

The event ID.

***

### group

> **group**: `string`

Defined in: src/types/Volunteer/interface.ts:13

The group ID, or null for individual volunteering.

***

### recurringEventInstanceId?

> `optional` **recurringEventInstanceId**: `string`

Defined in: src/types/Volunteer/interface.ts:17

Optional instance ID for recurring events.

***

### scope?

> `optional` **scope**: `"ENTIRE_SERIES"` \| `"THIS_INSTANCE_ONLY"`

Defined in: src/types/Volunteer/interface.ts:16

Optional scope for recurring events.

***

### status

> **status**: `string`

Defined in: src/types/Volunteer/interface.ts:14

The status of the volunteer request.

***

### userId

> **userId**: `string`

Defined in: src/types/Volunteer/interface.ts:15

The user ID of the volunteer.
