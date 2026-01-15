[**talawa-admin**](../../../../../../README.md)

***

# Variable: EMPTY\_MOCKS

> `const` **EMPTY\_MOCKS**: `object`[]

Defined in: [src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.mocks.ts:104](https://github.com/Anshikaaa06/talawa-admin/blob/9e54ad8a0be6c052a435c30f5a6bbbad9b905bb5/src/screens/UserPortal/Volunteer/UpcomingEvents/UpcomingEvents.mocks.ts#L104)

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
