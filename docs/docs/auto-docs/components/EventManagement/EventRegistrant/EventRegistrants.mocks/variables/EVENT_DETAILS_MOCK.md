[Admin Docs](/)

***

# Variable: EVENT\_DETAILS\_MOCK

> `const` **EVENT\_DETAILS\_MOCK**: `object`

Defined in: [src/components/EventManagement/EventRegistrant/EventRegistrants.mocks.ts:8](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventManagement/EventRegistrant/EventRegistrants.mocks.ts#L8)

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

#### result.data.event.\_\_typename

> **\_\_typename**: `string` = `'Event'`

#### result.data.event.allDay

> **allDay**: `boolean` = `false`

#### result.data.event.baseEvent

> **baseEvent**: `any` = `null`

#### result.data.event.createdAt

> **createdAt**: `string` = `'2024-07-22T09:00:00.000Z'`

#### result.data.event.creator

> **creator**: `object`

#### result.data.event.creator.\_\_typename

> **\_\_typename**: `string` = `'User'`

#### result.data.event.creator.emailAddress

> **emailAddress**: `string` = `'test@example.com'`

#### result.data.event.creator.id

> **id**: `string` = `'user1'`

#### result.data.event.creator.name

> **name**: `string` = `'Test User'`

#### result.data.event.description

> **description**: `string` = `'A test event.'`

#### result.data.event.endAt

> **endAt**: `string` = `'2024-07-22T12:00:00.000Z'`

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

#### result.data.event.organization.\_\_typename

> **\_\_typename**: `string` = `'Organization'`

#### result.data.event.organization.id

> **id**: `string` = `'org123'`

#### result.data.event.organization.name

> **name**: `string` = `'Test Organization'`

#### result.data.event.recurrenceRule

> **recurrenceRule**: `any` = `null`

#### result.data.event.startAt

> **startAt**: `string` = `'2024-07-22T10:00:00.000Z'`

#### result.data.event.updatedAt

> **updatedAt**: `string` = `'2024-07-22T09:00:00.000Z'`

#### result.data.event.updater

> **updater**: `object`

#### result.data.event.updater.\_\_typename

> **\_\_typename**: `string` = `'User'`

#### result.data.event.updater.emailAddress

> **emailAddress**: `string` = `'test@example.com'`

#### result.data.event.updater.id

> **id**: `string` = `'user1'`

#### result.data.event.updater.name

> **name**: `string` = `'Test User'`
