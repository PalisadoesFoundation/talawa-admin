[Admin Docs](/)

***

# Variable: MOCKS\_EMPTY

> `const` **MOCKS\_EMPTY**: `object`[]

Defined in: [src/screens/AdminPortal/EventVolunteers/VolunteerGroups/modal/VolunteerGroups.mocks.ts:318](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/EventVolunteers/VolunteerGroups/modal/VolunteerGroups.mocks.ts#L318)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `GET_EVENT_VOLUNTEER_GROUPS`

#### request.variables

> **variables**: `object`

#### request.variables.input

> **input**: `object`

#### request.variables.input.id

> **id**: `string` = `'eventId'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.event

> **event**: `object`

#### result.data.event.baseEvent

> **baseEvent**: `any` = `null`

#### result.data.event.id

> **id**: `string` = `'eventId'`

#### result.data.event.recurrenceRule

> **recurrenceRule**: `any` = `null`

#### result.data.event.volunteerGroups

> **volunteerGroups**: `any`[] = `[]`
