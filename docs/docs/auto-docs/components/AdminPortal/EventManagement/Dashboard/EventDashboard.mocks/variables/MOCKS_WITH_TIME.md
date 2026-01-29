[Admin Docs](/)

***

# Variable: MOCKS\_WITH\_TIME

> `const` **MOCKS\_WITH\_TIME**: `object`[]

Defined in: [src/components/AdminPortal/EventManagement/Dashboard/EventDashboard.mocks.ts:34](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AdminPortal/EventManagement/Dashboard/EventDashboard.mocks.ts#L34)

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

> **event**: `object`

#### result.data.event.allDay

> **allDay**: `boolean` = `false`

#### result.data.event.baseEvent

> **baseEvent**: `any` = `null`

#### result.data.event.createdAt

> **createdAt**: `string` = `'2023-01-01T00:00:00.000Z'`

#### result.data.event.creator

> **creator**: `object`

#### result.data.event.creator.emailAddress

> **emailAddress**: `string` = `'john.doe@example.com'`

#### result.data.event.creator.id

> **id**: `string` = `'creator1'`

#### result.data.event.creator.name

> **name**: `string` = `'John Doe'`

#### result.data.event.description

> **description**: `string` = `'Test Description'`

#### result.data.event.endAt

> **endAt**: `string`

#### result.data.event.id

> **id**: `string` = `'event123'`

#### result.data.event.isInviteOnly

> **isInviteOnly**: `boolean` = `false`

#### result.data.event.isPublic

> **isPublic**: `boolean` = `true`

#### result.data.event.isRecurringEventTemplate

> **isRecurringEventTemplate**: `boolean` = `false`

#### result.data.event.isRegisterable

> **isRegisterable**: `boolean` = `true`

#### result.data.event.location

> **location**: `string` = `'India'`

#### result.data.event.name

> **name**: `string` = `'Test Event'`

#### result.data.event.organization

> **organization**: `object`

#### result.data.event.organization.id

> **id**: `string` = `'org1'`

#### result.data.event.organization.name

> **name**: `string` = `'Test Org'`

#### result.data.event.recurrenceRule

> **recurrenceRule**: `any` = `null`

#### result.data.event.startAt

> **startAt**: `string`

#### result.data.event.updatedAt

> **updatedAt**: `string` = `'2023-01-02T00:00:00.000Z'`

#### result.data.event.updater

> **updater**: `object`

#### result.data.event.updater.emailAddress

> **emailAddress**: `string` = `'updater@example.com'`

#### result.data.event.updater.id

> **id**: `string` = `'updater1'`

#### result.data.event.updater.name

> **name**: `string` = `'Updater Person'`
