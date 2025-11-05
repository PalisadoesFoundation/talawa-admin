[Admin Docs](/)

***

# Variable: MOCKS\_UNDEFINED\_USER\_TAGS

> `const` **MOCKS\_UNDEFINED\_USER\_TAGS**: `object`[]

Defined in: [src/screens/OrganizationTags/OrganizationTagsMocks.ts:318](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationTags/OrganizationTagsMocks.ts#L318)

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

#### result.data.organization.id

> **id**: `string` = `'orgId'`

#### result.data.organization.name

> **name**: `string` = `'Test Organization'`

#### result.data.organization.tags

> **tags**: `any` = `undefined`
