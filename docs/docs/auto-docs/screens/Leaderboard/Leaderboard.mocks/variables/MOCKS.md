[**talawa-admin**](../../../../README.md)

***

[talawa-admin](../../../../modules.md) / [screens/Leaderboard/Leaderboard.mocks](../README.md) / MOCKS

# Variable: MOCKS

> `const` **MOCKS**: `object`[]

Defined in: [src/screens/Leaderboard/Leaderboard.mocks.ts:51](https://github.com/bint-Eve/talawa-admin/blob/16ddeb98e6868a55bca282e700a8f4212d222c01/src/screens/Leaderboard/Leaderboard.mocks.ts#L51)

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

> **getVolunteerRanks**: (\{ `hoursVolunteered`: `number`; `rank`: `number`; `user`: \{ `_id`: `string`; `email`: `string`; `firstName`: `string`; `image`: `string`; `lastName`: `string`; \}; \} \| \{ `hoursVolunteered`: `number`; `rank`: `number`; `user`: \{ `_id`: `string`; `email`: `string`; `firstName`: `string`; `image`: `null`; `lastName`: `string`; \}; \})[]
