[Admin Docs](/)

***

# Variable: EMPTY\_MOCKS

> `const` **EMPTY\_MOCKS**: `object`[]

Defined in: [src/screens/UserPortal/Volunteer/Actions/Actions.mocks.ts:232](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/UserPortal/Volunteer/Actions/Actions.mocks.ts#L232)

## Type declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `ACTION_ITEMS_BY_USER`

#### request.variables

> **variables**: `object`

#### request.variables.orderBy

> **orderBy**: `any` = `null`

#### request.variables.userId

> **userId**: `string` = `'userId'`

#### request.variables.where

> **where**: `object`

#### request.variables.where.assigneeName

> **assigneeName**: `string` = `''`

#### request.variables.where.orgId

> **orgId**: `string` = `'orgId'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.actionItemsByUser

> **actionItemsByUser**: `any`[] = `[]`
