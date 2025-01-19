[Admin Docs](/)

***

# Variable: MOCKS\_ERROR

> `const` **MOCKS\_ERROR**: `object`[]

Defined in: [src/screens/OrganizationTags/OrganizationTagsMocks.ts:413](https://github.com/abhassen44/talawa-admin/blob/bb7b6d5252385a81ad100b897eb0cba4f7ba10d2/src/screens/OrganizationTags/OrganizationTagsMocks.ts#L413)

## Type declaration

### error

> **error**: `Error`

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `ORGANIZATION_USER_TAGS_LIST`

#### request.variables

> **variables**: `object`

#### request.variables.first

> **first**: `number` = `TAGS_QUERY_DATA_CHUNK_SIZE`

#### request.variables.id

> **id**: `string` = `'orgId'`

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
