[Admin Docs](/)

***

# Variable: EVENT\_CHECKINS\_MOCK

> `const` **EVENT\_CHECKINS\_MOCK**: `object`

Defined in: [src/components/EventManagement/EventRegistrant/EventRegistrants.mocks.ts:101](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventManagement/EventRegistrant/EventRegistrants.mocks.ts#L101)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `EVENT_CHECKINS`

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

#### result.data.event.attendeesCheckInStatus

> **attendeesCheckInStatus**: `any`[] = `[]`

#### result.data.event.id

> **id**: `string` = `'event123'`
