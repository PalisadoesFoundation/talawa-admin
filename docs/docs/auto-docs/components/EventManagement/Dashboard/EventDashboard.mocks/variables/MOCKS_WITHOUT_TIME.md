[**talawa-admin**](../../../../../README.md)

***

# Variable: MOCKS\_WITHOUT\_TIME

> `const` **MOCKS\_WITHOUT\_TIME**: `object`[]

Defined in: [src/components/EventManagement/Dashboard/EventDashboard.mocks.ts:52](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/components/EventManagement/Dashboard/EventDashboard.mocks.ts#L52)

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

> **allDay**: `boolean` = `true`

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

> **endAt**: `string`

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

> **startAt**: `string`

#### result.data.event.startTime

> **startTime**: `any` = `null`
