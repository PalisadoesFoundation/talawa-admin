[Admin Docs](/)

***

# Variable: MOCKS\_WITH\_TIME

> `const` **MOCKS\_WITH\_TIME**: `object`[]

Defined in: [src/components/EventManagement/Dashboard/EventDashboard.mocks.ts:3](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventManagement/Dashboard/EventDashboard.mocks.ts#L3)

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

#### result.data.event.\_id

> **\_id**: `string` = `'event123'`

#### result.data.event.allDay

> **allDay**: `boolean` = `false`

#### result.data.event.attendees

> **attendees**: `object`[]

#### result.data.event.creator

> **creator**: `object`

#### result.data.event.creator.\_id

> **\_id**: `string` = `'creator1'`

#### result.data.event.creator.firstName

> **firstName**: `string` = `'John'`

#### result.data.event.creator.lastName

> **lastName**: `string` = `'Doe'`

#### result.data.event.description

> **description**: `string` = `'Test Description'`

#### result.data.event.endAt

> **endAt**: `string` = `'2024-01-02T17:00:00Z'`

#### result.data.event.endTime

> **endTime**: `string` = `'17:00:00'`

#### result.data.event.id

> **id**: `string` = `'event123'`

#### result.data.event.isPublic

> **isPublic**: `boolean` = `true`

#### result.data.event.isRegisterable

> **isRegisterable**: `boolean` = `true`

#### result.data.event.location

> **location**: `string` = `'India'`

#### result.data.event.name

> **name**: `string` = `'Test Event'`

#### result.data.event.startAt

> **startAt**: `string` = `'2024-01-01T09:00:00Z'`

#### result.data.event.startTime

> **startTime**: `string` = `'09:00:00'`
