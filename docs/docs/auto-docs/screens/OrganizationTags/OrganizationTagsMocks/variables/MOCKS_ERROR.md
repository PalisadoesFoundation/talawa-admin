[Admin Docs](/)

***

# Variable: MOCKS\_ERROR

> `const` **MOCKS\_ERROR**: `object`[]

Defined in: [src/screens/OrganizationTags/OrganizationTagsMocks.ts:319](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationTags/OrganizationTagsMocks.ts#L319)

## Type Declaration

### error

> **error**: `Error`

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `ORGANIZATION_USER_TAGS_LIST_PG`

#### request.variables

> **variables**: `object`

#### request.variables.first

> **first**: `number` = `TAGS_QUERY_DATA_CHUNK_SIZE`

#### request.variables.input

> **input**: `object`

#### request.variables.input.id

> **id**: `string` = `'orgIdError'`

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
