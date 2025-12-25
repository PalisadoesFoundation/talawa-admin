[Admin Docs](/)

***

# Variable: EMPTY\_MOCKS

> `const` **EMPTY\_MOCKS**: `object`[]

Defined in: [src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.mocks.ts:379](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.mocks.ts#L379)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `USER_EVENTS_VOLUNTEER`

#### request.variables

> **variables**: `object` & `object`

##### Type Declaration

###### first

> **first**: `number` = `30`

###### organizationId

> **organizationId**: `string` = `'orgId'`

###### upcomingOnly

> **upcomingOnly**: `boolean` = `true`

##### Type Declaration

###### includeInviteOnly

> **includeInviteOnly**: `boolean`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.organization

> **organization**: `object`

#### result.data.organization.events

> **events**: `object`

#### result.data.organization.events.edges

> **edges**: `any`[] = `[]`

#### result.data.organization.id

> **id**: `string` = `'orgId'`
