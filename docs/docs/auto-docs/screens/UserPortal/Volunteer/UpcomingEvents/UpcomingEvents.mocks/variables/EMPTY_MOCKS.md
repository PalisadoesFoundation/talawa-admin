[**talawa-admin**](../../../../../../README.md)

***

# Variable: EMPTY\_MOCKS

> `const` **EMPTY\_MOCKS**: `object`[]

Defined in: [src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.mocks.ts:104](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.mocks.ts#L104)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `USER_EVENTS_VOLUNTEER`

#### request.variables

> **variables**: `object`

#### request.variables.first

> **first**: `number` = `30`

#### request.variables.organizationId

> **organizationId**: `string` = `'orgId'`

#### request.variables.upcomingOnly

> **upcomingOnly**: `boolean` = `true`

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
