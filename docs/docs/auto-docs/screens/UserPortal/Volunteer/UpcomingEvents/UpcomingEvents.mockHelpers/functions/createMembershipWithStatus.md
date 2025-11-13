[Admin Docs](/)

***

# Function: createMembershipWithStatus()

> **createMembershipWithStatus**(`id`, `eventId`, `status`, `groupId?`): `object`

Defined in: [src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.mockHelpers.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.mockHelpers.ts#L29)

## Parameters

### id

`string`

### eventId

`string`

### status

`string`

### groupId?

`string`

## Returns

`object`

### \_\_typename

> **\_\_typename**: `string` = `'VolunteerMembership'`

### createdAt

> **createdAt**: `string` = `'2024-10-30T10:00:00.000Z'`

### event

> **event**: `object`

#### event.\_\_typename

> **\_\_typename**: `string` = `'Event'`

#### event.endAt

> **endAt**: `string` = `'2044-10-30T12:00:00.000Z'`

#### event.id

> **id**: `string` = `eventId`

#### event.name

> **name**: `string`

#### event.recurrenceRule

> **recurrenceRule**: `any` = `null`

#### event.startAt

> **startAt**: `string` = `'2044-10-30T10:00:00.000Z'`

### group

> **group**: `object`

#### group.\_\_typename

> **\_\_typename**: `string` = `'EventVolunteerGroup'`

#### group.description

> **description**: `string` = `'Test Description'`

#### group.id

> **id**: `string` = `groupId`

#### group.name

> **name**: `string` = `'Test Group'`

### id

> **id**: `string`

### status

> **status**: `string`

### updatedAt

> **updatedAt**: `string` = `'2024-10-30T10:00:00.000Z'`

### volunteer

> **volunteer**: `object`

#### volunteer.\_\_typename

> **\_\_typename**: `string` = `'EventVolunteer'`

#### volunteer.createdBy

> **createdBy**: `object`

#### volunteer.createdBy.\_\_typename

> **\_\_typename**: `string` = `'User'`

#### volunteer.createdBy.id

> **id**: `string` = `'userId'`

#### volunteer.id

> **id**: `string`

#### volunteer.updatedBy

> **updatedBy**: `object`

#### volunteer.updatedBy.\_\_typename

> **\_\_typename**: `string` = `'User'`

#### volunteer.updatedBy.id

> **id**: `string` = `'userId'`
