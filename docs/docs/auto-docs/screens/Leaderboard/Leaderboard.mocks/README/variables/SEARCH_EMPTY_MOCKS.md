[**talawa-admin**](README.md)

***

# Variable: SEARCH\_EMPTY\_MOCKS

> `const` **SEARCH\_EMPTY\_MOCKS**: `object`[]

Defined in: [src/screens/Leaderboard/Leaderboard.mocks.ts:208](https://github.com/SujalTripathi/talawa-admin/blob/ed913970521689f5a1e8aec0179ffa2d67f07028/src/screens/Leaderboard/Leaderboard.mocks.ts#L208)

## Type declaration

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
