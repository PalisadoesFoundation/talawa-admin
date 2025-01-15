[Admin Docs](/)

***

# Variable: MOCKS\_ERROR\_SUB\_TAGS

> `const` **MOCKS\_ERROR\_SUB\_TAGS**: `object`[]

Defined in: [src/screens/SubTags/SubTagsMocks.ts:489](https://github.com/gautam-divyanshu/talawa-admin/blob/d5fea688542032271211cd43ee86c7db0866bcc0/src/screens/SubTags/SubTagsMocks.ts#L489)

## Type declaration

### error

> **error**: `Error`

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `USER_TAG_SUB_TAGS`

#### request.variables

> **variables**: `object`

#### request.variables.first

> **first**: `number` = `TAGS_QUERY_DATA_CHUNK_SIZE`

#### request.variables.id

> **id**: `string` = `'1'`

#### request.variables.sortedBy

> **sortedBy**: `object`

#### request.variables.sortedBy.id

> **id**: `string` = `'DESCENDING'`

#### request.variables.where

> **where**: `object`

#### request.variables.where.name

> **name**: `object`

#### request.variables.where.name.starts\_with

> **starts\_with**: `string` = `''`
