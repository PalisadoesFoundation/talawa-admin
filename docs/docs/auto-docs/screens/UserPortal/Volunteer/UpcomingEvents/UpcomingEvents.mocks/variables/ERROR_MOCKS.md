[Admin Docs](/)

***

# Variable: ERROR\_MOCKS

> `const` **ERROR\_MOCKS**: `object`[]

Defined in: [src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.mocks.ts:388](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.mocks.ts#L388)

## Type Declaration

### error

> **error**: `Error`

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
