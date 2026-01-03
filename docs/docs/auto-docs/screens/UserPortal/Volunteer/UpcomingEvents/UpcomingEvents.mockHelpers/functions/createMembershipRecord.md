[Admin Docs](/)

***

# Function: createMembershipRecord()

> **createMembershipRecord**(`__namedParameters`): `object`

Defined in: [src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.mockHelpers.ts:44](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.mockHelpers.ts#L44)

## Parameters

### \_\_namedParameters

[`InterfaceMembershipOptions`](../interfaces/InterfaceMembershipOptions.md)

## Returns

`object`

### createdAt

> **createdAt**: `string`

### createdBy

> **createdBy**: `object`

#### createdBy.id

> **id**: `string` = `'creatorId'`

#### createdBy.name

> **name**: `string` = `'Creator Name'`

### event

> **event**: `object`

#### event.endAt

> **endAt**: `string`

#### event.id

> **id**: `string` = `eventId`

#### event.name

> **name**: `string`

#### event.recurrenceRule

> **recurrenceRule**: `object`

#### event.recurrenceRule.id

> **id**: `string` = `recurrenceRuleId`

#### event.startAt

> **startAt**: `string`

### group

> **group**: `object`

#### group.description

> **description**: `string`

#### group.id

> **id**: `string` = `groupId`

#### group.name

> **name**: `string`

### id

> **id**: `string`

### status

> **status**: `string`

### updatedAt

> **updatedAt**: `string`

### updatedBy

> **updatedBy**: `object`

#### updatedBy.id

> **id**: `string` = `'updaterId'`

#### updatedBy.name

> **name**: `string` = `'Updater Name'`

### volunteer

> **volunteer**: `object`

#### volunteer.hasAccepted

> **hasAccepted**: `boolean`

#### volunteer.hoursVolunteered

> **hoursVolunteered**: `number` = `0`

#### volunteer.id

> **id**: `string`

#### volunteer.user

> **user**: `object`

#### volunteer.user.avatarURL

> **avatarURL**: `any` = `null`

#### volunteer.user.emailAddress

> **emailAddress**: `string`

#### volunteer.user.id

> **id**: `string`

#### volunteer.user.name

> **name**: `string`
