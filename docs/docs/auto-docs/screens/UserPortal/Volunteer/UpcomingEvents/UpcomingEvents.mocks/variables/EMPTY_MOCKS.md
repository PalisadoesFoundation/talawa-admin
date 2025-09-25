[Admin Docs](/)

***

# Variable: EMPTY\_MOCKS

> `const` **EMPTY\_MOCKS**: `object`[]

Defined in: [src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.mocks.ts:210](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.mocks.ts#L210)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `USER_EVENTS_VOLUNTEER`

#### request.variables

> **variables**: `object`

#### request.variables.first

> **first**: `any` = `null`

#### request.variables.location\_contains

> **location\_contains**: `string` = `''`

#### request.variables.organization\_id

> **organization\_id**: `string` = `'orgId'`

#### request.variables.skip

> **skip**: `any` = `null`

#### request.variables.title\_contains

> **title\_contains**: `string` = `''`

#### request.variables.upcomingOnly

> **upcomingOnly**: `boolean` = `true`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.eventsByOrganizationConnection

> **eventsByOrganizationConnection**: `any`[] = `[]`
