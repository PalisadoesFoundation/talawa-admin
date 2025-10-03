[Admin Docs](/)

***

# Variable: mockEventData

> `const` **mockEventData**: `object`

Defined in: [src/components/MemberActivity/MemberActivityMocks.ts:15](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/MemberActivity/MemberActivityMocks.ts#L15)

Mock event data for member activity testing

LEGACY FIELDS RETAINED FOR BACKWARD COMPATIBILITY:
- _id (alias for id)
- title (alias for name)
- startDate, endDate (deprecated in favor of startAt, endAt)
- startTime, endTime (deprecated, use startAt/endAt timestamps)

These legacy fields will be removed in a future update.
Track migration progress: https://github.com/PalisadoesFoundation/talawa-admin/issues/3994

## Type declaration

### event

> **event**: `object`

#### event.\_id

> **\_id**: `string` = `'event123'`

#### event.allDay

> **allDay**: `boolean` = `false`

#### event.attendees

> **attendees**: `object`[]

#### event.baseRecurringEvent

> **baseRecurringEvent**: `object`

#### event.baseRecurringEvent.\_id

> **\_id**: `string` = `'base123'`

#### event.baseRecurringEvent.id

> **id**: `string` = `'base123'`

#### event.createdAt

> **createdAt**: `string` = `'2029-12-01T10:00:00.000Z'`

#### event.creator

> **creator**: `object`

#### event.creator.emailAddress

> **emailAddress**: `string` = `'alice@example.com'`

#### event.creator.id

> **id**: `string` = `'creator1'`

#### event.creator.name

> **name**: `string` = `'Alice Creator'`

#### event.description

> **description**: `string` = `'Test Description'`

#### event.endAt

> **endAt**: `string` = `'2030-01-02T17:00:00.000Z'`

#### event.endDate

> **endDate**: `string` = `'2030-01-02'`

#### event.endTime

> **endTime**: `string` = `'17:00'`

#### event.id

> **id**: `string` = `'event123'`

#### event.isPublic

> **isPublic**: `boolean` = `true`

#### event.isRecurringEventTemplate

> **isRecurringEventTemplate**: `boolean` = `false`

#### event.isRegisterable

> **isRegisterable**: `boolean` = `true`

#### event.location

> **location**: `string` = `'Test Location'`

#### event.name

> **name**: `string` = `'Test Event'`

#### event.organization

> **organization**: `object`

#### event.organization.\_id

> **\_id**: `string` = `'org123'`

#### event.organization.id

> **id**: `string` = `'org123'`

#### event.organization.members

> **members**: `object`[]

#### event.organization.name

> **name**: `string` = `'Test Organization'`

#### event.recurring

> **recurring**: `boolean` = `true`

#### event.startAt

> **startAt**: `string` = `'2030-01-01T09:00:00.000Z'`

#### event.startDate

> **startDate**: `string` = `'2030-01-01'`

#### event.startTime

> **startTime**: `string` = `'09:00'`

#### event.title

> **title**: `string` = `'Test Event'`

#### event.updatedAt

> **updatedAt**: `string` = `'2030-01-10T15:30:00.000Z'`

#### event.updater

> **updater**: `object`

#### event.updater.emailAddress

> **emailAddress**: `string` = `'bob@example.com'`

#### event.updater.id

> **id**: `string` = `'updater1'`

#### event.updater.name

> **name**: `string` = `'Bob Updater'`
