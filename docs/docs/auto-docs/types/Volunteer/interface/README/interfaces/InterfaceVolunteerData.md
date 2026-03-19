[Admin Docs](/)

***

# Interface: InterfaceVolunteerData

Defined in: [src/types/Volunteer/interface.ts:4](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L4)

Defines the structure for volunteer data used in mutations.

## Properties

### event

> **event**: `string`

Defined in: [src/types/Volunteer/interface.ts:6](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L6)

The event ID.

***

### group

> **group**: `string`

Defined in: [src/types/Volunteer/interface.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L8)

The group ID, or null for individual volunteering.

***

### recurringEventInstanceId?

> `optional` **recurringEventInstanceId**: `string`

Defined in: [src/types/Volunteer/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L16)

(Optional) Instance ID for recurring events.

***

### scope?

> `optional` **scope**: `"ENTIRE_SERIES"` \| `"THIS_INSTANCE_ONLY"`

Defined in: [src/types/Volunteer/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L14)

(Optional) Scope for recurring events.

***

### status

> **status**: `string`

Defined in: [src/types/Volunteer/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L10)

The status of the volunteer request.

***

### userId

> **userId**: `string`

Defined in: [src/types/Volunteer/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L12)

The user ID of the volunteer.
