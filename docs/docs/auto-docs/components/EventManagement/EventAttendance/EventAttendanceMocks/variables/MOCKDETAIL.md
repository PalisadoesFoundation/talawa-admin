[Admin Docs](/)

***

# Variable: MOCKDETAIL

> `const` **MOCKDETAIL**: `object`[]

Defined in: [src/components/EventManagement/EventAttendance/EventAttendanceMocks.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventManagement/EventAttendance/EventAttendanceMocks.ts#L27)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `EVENT_DETAILS`

#### request.variables

> **variables**: `object`

#### request.variables.id

> **id**: `string` = `'event123'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.event

> **event**: `object` = `MOCKEVENT`

#### result.data.event.\_id

> **\_id**: `string` = `'event123'`

#### result.data.event.allDay

> **allDay**: `boolean` = `false`

#### result.data.event.attendees

> **attendees**: `object`[]

#### result.data.event.baseRecurringEvent

> **baseRecurringEvent**: `object`

#### result.data.event.baseRecurringEvent.\_id

> **\_id**: `string` = `'recurringEvent123'`

#### result.data.event.description

> **description**: `string` = `'This is a test event description'`

#### result.data.event.endDate

> **endDate**: `string` = `'2030-05-02'`

#### result.data.event.endTime

> **endTime**: `string` = `'17:00:00'`

#### result.data.event.location

> **location**: `string` = `'Test Location'`

#### result.data.event.organization

> **organization**: `object`

#### result.data.event.organization.\_id

> **\_id**: `string` = `'org456'`

#### result.data.event.organization.members

> **members**: `object`[]

#### result.data.event.recurring

> **recurring**: `boolean` = `true`

#### result.data.event.startDate

> **startDate**: `string` = `'2030-05-01'`

#### result.data.event.startTime

> **startTime**: `string` = `'09:00:00'`

#### result.data.event.title

> **title**: `string` = `'Test Event'`
