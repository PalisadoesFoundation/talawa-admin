[Admin Docs](/)

***

# Variable: EMPTY\_MOCKS

> `const` **EMPTY\_MOCKS**: `object`[]

Defined in: [src/screens/EventVolunteers/Requests/Requests.mocks.ts:148](https://github.com/gautam-divyanshu/talawa-admin/blob/d5fea688542032271211cd43ee86c7db0866bcc0/src/screens/EventVolunteers/Requests/Requests.mocks.ts#L148)

## Type declaration

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
