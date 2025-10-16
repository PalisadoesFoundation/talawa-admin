[Admin Docs](/)

***

# Variable: ERROR\_MOCKS

> `const` **ERROR\_MOCKS**: `object`[]

Defined in: [src/screens/OrganizationDashboard/Leaderboard/Leaderboard.mocks.ts:183](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationDashboard/Leaderboard/Leaderboard.mocks.ts#L183)

## Type Declaration

### error

> **error**: `Error`

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
