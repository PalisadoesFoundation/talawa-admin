[Admin Docs](/)

***

# Variable: EVENT\_CHECKINS\_WITH\_UNDEFINED\_ATTENDEES

> `const` **EVENT\_CHECKINS\_WITH\_UNDEFINED\_ATTENDEES**: `object`

Defined in: [src/components/EventManagement/EventRegistrant/EventRegistrants.mocks.ts:240](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventManagement/EventRegistrant/EventRegistrants.mocks.ts#L240)

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

#### result.data.event.\_\_typename

> **\_\_typename**: `string` = `'Event'`
