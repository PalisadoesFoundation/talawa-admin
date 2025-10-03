[Admin Docs](/)

***

# Variable: mocks

> `const` **mocks**: `object`[]

Defined in: [src/components/MemberActivity/MemberActivityMocks.ts:63](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/MemberActivity/MemberActivityMocks.ts#L63)

## Type declaration

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

> **data**: `object` = `mockEventData`

#### result.data.event

> **event**: `object`

#### result.data.event.\_id

> **\_id**: `string` = `'event123'`

#### result.data.event.allDay

> **allDay**: `boolean` = `false`

#### result.data.event.attendees

> **attendees**: `object`[]

#### result.data.event.baseRecurringEvent

> **baseRecurringEvent**: `object`

#### result.data.event.baseRecurringEvent.\_id

> **\_id**: `string` = `'base123'`

#### result.data.event.baseRecurringEvent.id

> **id**: `string` = `'base123'`

#### result.data.event.createdAt

> **createdAt**: `string` = `'2029-12-01T10:00:00.000Z'`

#### result.data.event.creator

> **creator**: `object`

#### result.data.event.creator.emailAddress

> **emailAddress**: `string` = `'alice@example.com'`

#### result.data.event.creator.id

> **id**: `string` = `'creator1'`

#### result.data.event.creator.name

> **name**: `string` = `'Alice Creator'`

#### result.data.event.description

> **description**: `string` = `'Test Description'`

#### result.data.event.endAt

> **endAt**: `string` = `'2030-01-02T17:00:00.000Z'`

#### result.data.event.endDate

> **endDate**: `string` = `'2030-01-02'`

#### result.data.event.endTime

> **endTime**: `string` = `'17:00'`

#### result.data.event.id

> **id**: `string` = `'event123'`

#### result.data.event.isPublic

> **isPublic**: `boolean` = `true`

#### result.data.event.isRecurringEventTemplate

> **isRecurringEventTemplate**: `boolean` = `false`

#### result.data.event.isRegisterable

> **isRegisterable**: `boolean` = `true`

#### result.data.event.location

> **location**: `string` = `'Test Location'`

#### result.data.event.name

> **name**: `string` = `'Test Event'`

#### result.data.event.organization

> **organization**: `object`

#### result.data.event.organization.\_id

> **\_id**: `string` = `'org123'`

#### result.data.event.organization.id

> **id**: `string` = `'org123'`

#### result.data.event.organization.members

> **members**: `object`[]

#### result.data.event.organization.name

> **name**: `string` = `'Test Organization'`

#### result.data.event.recurring

> **recurring**: `boolean` = `true`

#### result.data.event.startAt

> **startAt**: `string` = `'2030-01-01T09:00:00.000Z'`

#### result.data.event.startDate

> **startDate**: `string` = `'2030-01-01'`

#### result.data.event.startTime

> **startTime**: `string` = `'09:00'`

#### result.data.event.title

> **title**: `string` = `'Test Event'`

#### result.data.event.updatedAt

> **updatedAt**: `string` = `'2030-01-10T15:30:00.000Z'`

#### result.data.event.updater

> **updater**: `object`

#### result.data.event.updater.emailAddress

> **emailAddress**: `string` = `'bob@example.com'`

#### result.data.event.updater.id

> **id**: `string` = `'updater1'`

#### result.data.event.updater.name

> **name**: `string` = `'Bob Updater'`
