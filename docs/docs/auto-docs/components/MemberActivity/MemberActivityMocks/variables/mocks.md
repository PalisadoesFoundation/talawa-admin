[Admin Docs](/)

***

# Variable: mocks

> `const` **mocks**: `object`[]

Defined in: [src/components/MemberActivity/MemberActivityMocks.ts:30](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/MemberActivity/MemberActivityMocks.ts#L30)

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

#### result.data.event.description

> **description**: `string` = `'Test Description'`

#### result.data.event.endDate

> **endDate**: `string` = `'2030-01-02'`

#### result.data.event.endTime

> **endTime**: `string` = `'17:00'`

#### result.data.event.location

> **location**: `string` = `'Test Location'`

#### result.data.event.organization

> **organization**: `object`

#### result.data.event.organization.\_id

> **\_id**: `string` = `'org123'`

#### result.data.event.organization.members

> **members**: `object`[]

#### result.data.event.recurring

> **recurring**: `boolean` = `true`

#### result.data.event.startDate

> **startDate**: `string` = `'2030-01-01'`

#### result.data.event.startTime

> **startTime**: `string` = `'09:00'`

#### result.data.event.title

> **title**: `string` = `'Test Event'`
