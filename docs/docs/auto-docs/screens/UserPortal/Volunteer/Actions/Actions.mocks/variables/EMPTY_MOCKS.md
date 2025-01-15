[Admin Docs](/)

***

# Variable: EMPTY\_MOCKS

> `const` **EMPTY\_MOCKS**: `object`[]

Defined in: [src/screens/UserPortal/Volunteer/Actions/Actions.mocks.ts:232](https://github.com/gautam-divyanshu/talawa-admin/blob/d5fea688542032271211cd43ee86c7db0866bcc0/src/screens/UserPortal/Volunteer/Actions/Actions.mocks.ts#L232)

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
