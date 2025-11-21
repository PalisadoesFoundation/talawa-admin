[Admin Docs](/)

***

# Variable: MOCKS\_NULL\_DATETIME

> `const` **MOCKS\_NULL\_DATETIME**: `object`[]

Defined in: [src/components/EventManagement/Dashboard/EventDashboard.mocks.ts:215](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventManagement/Dashboard/EventDashboard.mocks.ts#L215)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `string` = `'EVENT_DETAILS'`

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

> **allDay**: `boolean` = `true`

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

> **endAt**: `any` = `null`

#### result.data.event.endTime

> **endTime**: `any` = `null`

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

> **startAt**: `any` = `null`

#### result.data.event.startTime

> **startTime**: `any` = `null`
