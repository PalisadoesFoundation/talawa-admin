[Admin Docs](/)

***

# Variable: ERROR\_MOCKS

> `const` **ERROR\_MOCKS**: `object`[]

Defined in: [src/screens/Leaderboard/Leaderboard.mocks.ts:183](https://github.com/abhassen44/talawa-admin/blob/bb7b6d5252385a81ad100b897eb0cba4f7ba10d2/src/screens/Leaderboard/Leaderboard.mocks.ts#L183)

## Type declaration

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
