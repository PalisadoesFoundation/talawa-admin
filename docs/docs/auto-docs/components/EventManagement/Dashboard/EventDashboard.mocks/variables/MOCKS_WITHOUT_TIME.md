[Admin Docs](/)

***

# Variable: MOCKS\_WITHOUT\_TIME

> `const` **MOCKS\_WITHOUT\_TIME**: `object`[]

Defined in: [src/components/EventManagement/Dashboard/EventDashboard.mocks.ts:34](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/components/EventManagement/Dashboard/EventDashboard.mocks.ts#L34)

## Type declaration

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

#### result.data.event.endDate

> **endDate**: `string` = `'2024-01-02'`

#### result.data.event.endTime

> **endTime**: `any` = `null`

#### result.data.event.location

> **location**: `string` = `'India'`

#### result.data.event.recurring

> **recurring**: `boolean` = `false`

#### result.data.event.startDate

> **startDate**: `string` = `'2024-01-01'`

#### result.data.event.startTime

> **startTime**: `any` = `null`

#### result.data.event.title

> **title**: `string` = `'Test Event'`
