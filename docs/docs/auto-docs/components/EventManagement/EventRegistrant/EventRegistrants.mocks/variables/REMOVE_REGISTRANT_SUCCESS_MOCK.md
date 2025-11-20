[Admin Docs](/)

***

# Variable: REMOVE\_REGISTRANT\_SUCCESS\_MOCK

> `const` **REMOVE\_REGISTRANT\_SUCCESS\_MOCK**: `object`

Defined in: [src/components/EventManagement/EventRegistrant/EventRegistrants.mocks.ts:136](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/EventManagement/EventRegistrant/EventRegistrants.mocks.ts#L136)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `REMOVE_EVENT_ATTENDEE`

#### request.variables

> **variables**: `object`

#### request.variables.eventId

> **eventId**: `string` = `'event123'`

#### request.variables.userId

> **userId**: `string` = `'user1'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.removeEventAttendee

> **removeEventAttendee**: `object`

#### result.data.removeEventAttendee.\_\_typename

> **\_\_typename**: `string` = `'User'`

#### result.data.removeEventAttendee.emailAddress

> **emailAddress**: `string` = `'bruce@example.com'`

#### result.data.removeEventAttendee.id

> **id**: `string` = `'user1'`

#### result.data.removeEventAttendee.name

> **name**: `string` = `'Bruce Garza'`
