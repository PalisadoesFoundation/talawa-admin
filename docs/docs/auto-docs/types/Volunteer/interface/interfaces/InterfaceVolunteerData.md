[Admin Docs](/)

***

# Interface: InterfaceVolunteerData

Defined in: [src/types/Volunteer/interface.ts:10](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L10)

Defines the structure for volunteer data used in mutations.

## Param

The event ID.

## Param

The group ID, or null for individual volunteering.

## Param

The status of the volunteer request.

## Param

The user ID of the volunteer.

## Param

(Optional) Scope for recurring events.

## Param

(Optional) Instance ID for recurring events.

## Properties

### event

> **event**: `string`

Defined in: [src/types/Volunteer/interface.ts:11](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L11)

***

### group

> **group**: `string`

Defined in: [src/types/Volunteer/interface.ts:12](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L12)

***

### recurringEventInstanceId?

> `optional` **recurringEventInstanceId**: `string`

Defined in: [src/types/Volunteer/interface.ts:16](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L16)

***

### scope?

> `optional` **scope**: `"ENTIRE_SERIES"` \| `"THIS_INSTANCE_ONLY"`

Defined in: [src/types/Volunteer/interface.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L15)

***

### status

> **status**: `string`

Defined in: [src/types/Volunteer/interface.ts:13](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L13)

***

### userId

> **userId**: `string`

Defined in: [src/types/Volunteer/interface.ts:14](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/types/Volunteer/interface.ts#L14)
