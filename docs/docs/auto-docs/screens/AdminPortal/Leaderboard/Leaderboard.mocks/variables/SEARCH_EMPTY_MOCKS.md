[**talawa-admin**](../../../../../README.md)

***

# Variable: SEARCH\_EMPTY\_MOCKS

> `const` **SEARCH\_EMPTY\_MOCKS**: `object`[]

Defined in: [src/screens/AdminPortal/Leaderboard/Leaderboard.mocks.ts:208](https://github.com/MonishPuttu/talawa-admin/blob/4630ca9b3a05c039a7c82f0e137454f2802795b4/src/screens/AdminPortal/Leaderboard/Leaderboard.mocks.ts#L208)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `VOLUNTEER_RANKING`

#### request.variables

> **variables**: `object`

#### request.variables.orgId

> **orgId**: `string` = `'orgId'`

#### request.variables.where

> **where**: `object`

#### request.variables.where.nameContains

> **nameContains**: `string` = `''`

#### request.variables.where.orderBy

> **orderBy**: `string` = `'hours_DESC'`

#### request.variables.where.timeFrame

> **timeFrame**: `string` = `'allTime'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.getVolunteerRanks

> **getVolunteerRanks**: `object`[]
