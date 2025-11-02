[Admin Docs](/)

***

# Variable: MOCKS\_WITH\_EMPTY\_TAGS\_EDGES

> `const` **MOCKS\_WITH\_EMPTY\_TAGS\_EDGES**: `object`[]

Defined in: [src/screens/OrganizationTags/OrganizationTagsMocks.ts:516](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationTags/OrganizationTagsMocks.ts#L516)

## Type Declaration

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

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.organization

> **organization**: `object`

#### result.data.organization.tags

> **tags**: `object`

#### result.data.organization.tags.edges

> **edges**: `any` = `null`

#### result.data.organization.tags.pageInfo

> **pageInfo**: `object`

#### result.data.organization.tags.pageInfo.endCursor

> **endCursor**: `any` = `null`

#### result.data.organization.tags.pageInfo.hasNextPage

> **hasNextPage**: `boolean` = `false`
