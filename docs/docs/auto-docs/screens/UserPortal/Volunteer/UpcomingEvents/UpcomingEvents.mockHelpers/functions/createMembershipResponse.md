[Admin Docs](/)

***

# Function: createMembershipResponse()

> **createMembershipResponse**(`id`, `eventId`, `groupId?`): `object`

Defined in: [src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.mockHelpers.ts:29](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.mockHelpers.ts#L29)

## Parameters

### id

`string`

### eventId

`string`

### groupId?

`string`

## Returns

`object`

### createdAt

> **createdAt**: `string` = `'2025-09-20T15:20:00.000Z'`

### createdBy

> **createdBy**: `object`

#### createdBy.id

> **id**: `string` = `'createrId'`

#### createdBy.name

> **name**: `string` = `'Creator Name'`

### event

> **event**: `object`

#### event.id

> **id**: `string` = `eventId`

#### event.name

> **name**: `string`

### group

> **group**: `object`

#### group.description

> **description**: `string` = `'desc'`

#### group.id

> **id**: `string` = `groupId`

#### group.name

> **name**: `string`

### id

> **id**: `string`

### status

> **status**: `string` = `'requested'`

### volunteer

> **volunteer**: `object`

#### volunteer.hasAccepted

> **hasAccepted**: `boolean` = `false`

#### volunteer.id

> **id**: `string`

#### volunteer.user

> **user**: `object`

#### volunteer.user.id

> **id**: `string` = `'userId'`

#### volunteer.user.name

> **name**: `string` = `'User Name'`
