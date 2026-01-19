[Admin Docs](/)

---

# Variable: EMPTY_MOCKS

> `const` **EMPTY_MOCKS**: `object`[]

Defined in: [src/screens/EventVolunteers/Requests/Requests.mocks.ts:305](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/EventVolunteers/Requests/Requests.mocks.ts#L305)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `USER_VOLUNTEER_MEMBERSHIP`

#### request.variables

> **variables**: `object`

#### request.variables.where

> **where**: `object`

#### request.variables.where.eventId

> **eventId**: `string` = `'eventId'`

#### request.variables.where.status

> **status**: `string` = `'requested'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.getVolunteerMembership

> **getVolunteerMembership**: `any`[] = `[]`
