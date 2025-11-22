[Admin Docs](/)

***

# Variable: MOCK\_BOUNDARY\_TIME

> `const` **MOCK\_BOUNDARY\_TIME**: `object`[]

Defined in: [src/components/EventManagement/Dashboard/EventDashboard.mocks.ts:215](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventManagement/Dashboard/EventDashboard.mocks.ts#L215)

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

> **attendees**: `any`[] = `[]`

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

> **endAt**: `string` = `'2024-01-02T23:55:00Z'`

#### result.data.event.endTime

> **endTime**: `string` = `'23:55:00'`

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

> **startAt**: `string` = `'2024-01-01T00:05:00Z'`

#### result.data.event.startTime

> **startTime**: `string` = `'00:05:00'`
