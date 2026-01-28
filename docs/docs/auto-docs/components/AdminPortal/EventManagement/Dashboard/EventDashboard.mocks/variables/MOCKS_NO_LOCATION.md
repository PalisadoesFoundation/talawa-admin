[**talawa-admin**](../../../../../../README.md)

***

# Variable: MOCKS\_NO\_LOCATION

> `const` **MOCKS\_NO\_LOCATION**: `object`[]

Defined in: [src/components/AdminPortal/EventManagement/Dashboard/EventDashboard.mocks.ts:113](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/components/AdminPortal/EventManagement/Dashboard/EventDashboard.mocks.ts#L113)

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

> **description**: `string` = `''`

#### result.data.event.endAt

> **endAt**: `string`

#### result.data.event.endTime

> **endTime**: `string` = `'17:00:00'`

#### result.data.event.id

> **id**: `string` = `'event123'`

#### result.data.event.isInviteOnly

> **isInviteOnly**: `boolean` = `false`

#### result.data.event.isPublic

> **isPublic**: `boolean` = `true`

#### result.data.event.isRegisterable

> **isRegisterable**: `boolean` = `true`

#### result.data.event.location

> **location**: `any` = `null`

#### result.data.event.name

> **name**: `string` = `'Test Event'`

#### result.data.event.startAt

> **startAt**: `string`

#### result.data.event.startTime

> **startTime**: `string` = `'09:00:00'`
