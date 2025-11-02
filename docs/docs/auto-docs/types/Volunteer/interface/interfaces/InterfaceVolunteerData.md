[Admin Docs](/)

***

# Interface: InterfaceVolunteerData

Defined in: [src/types/Volunteer/interface.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L11)

InterfaceVolunteerData

## Description

Defines the structure for volunteer data used in mutations.

## Properties

### event

> **event**: `string`

Defined in: [src/types/Volunteer/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L12)

The event ID.

***

### group

> **group**: `string`

Defined in: [src/types/Volunteer/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L13)

The group ID, or null for individual volunteering.

***

### recurringEventInstanceId?

> `optional` **recurringEventInstanceId**: `string`

Defined in: [src/types/Volunteer/interface.ts:17](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L17)

Optional instance ID for recurring events.

***

### scope?

> `optional` **scope**: `"ENTIRE_SERIES"` \| `"THIS_INSTANCE_ONLY"`

Defined in: [src/types/Volunteer/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L16)

Optional scope for recurring events.

***

### status

> **status**: `string`

Defined in: [src/types/Volunteer/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L14)

The status of the volunteer request.

***

### userId

> **userId**: `string`

Defined in: [src/types/Volunteer/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L15)

The user ID of the volunteer.
