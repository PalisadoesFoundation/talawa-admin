[Admin Docs](/)

***

# Variable: MOCKDETAIL

> `const` **MOCKDETAIL**: `object`[]

Defined in: [src/components/AdminPortal/EventManagement/EventAttendance/EventAttendanceMocks.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AdminPortal/EventManagement/EventAttendance/EventAttendanceMocks.ts#L34)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `EVENT_DETAILS`

#### request.variables

> **variables**: `object`

#### request.variables.eventId

> **eventId**: `string` = `'event123'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.event

> **event**: `object` = `MOCKEVENT`

#### result.data.event.allDay

> **allDay**: `boolean` = `false`

#### result.data.event.createdAt

> **createdAt**: `string` = `'2030-04-01T00:00:00.000Z'`

#### result.data.event.creator

> **creator**: `object`

#### result.data.event.creator.emailAddress

> **emailAddress**: `string` = `'creator@example.com'`

#### result.data.event.creator.id

> **id**: `string` = `'creator123'`

#### result.data.event.creator.name

> **name**: `string` = `'Creator Name'`

#### result.data.event.description

> **description**: `string` = `'This is a test event description'`

#### result.data.event.endAt

> **endAt**: `string` = `'2030-05-02T17:00:00.000Z'`

#### result.data.event.id

> **id**: `string` = `'event123'`

#### result.data.event.isPublic

> **isPublic**: `boolean` = `true`

#### result.data.event.isRegisterable

> **isRegisterable**: `boolean` = `true`

#### result.data.event.location

> **location**: `string` = `'Test Location'`

#### result.data.event.name

> **name**: `string` = `'Test Event'`

#### result.data.event.organization

> **organization**: `object`

#### result.data.event.organization.id

> **id**: `string` = `'org456'`

#### result.data.event.organization.name

> **name**: `string` = `'Test Organization'`

#### result.data.event.recurrenceRule

> **recurrenceRule**: `object`

#### result.data.event.recurrenceRule.id

> **id**: `string` = `'recurringEvent123'`

#### result.data.event.startAt

> **startAt**: `string` = `'2030-05-01T09:00:00.000Z'`

#### result.data.event.updatedAt

> **updatedAt**: `string` = `'2030-04-01T00:00:00.000Z'`

#### result.data.event.updater

> **updater**: `object`

#### result.data.event.updater.emailAddress

> **emailAddress**: `string` = `'updater@example.com'`

#### result.data.event.updater.id

> **id**: `string` = `'updater123'`

#### result.data.event.updater.name

> **name**: `string` = `'Updater Name'`
