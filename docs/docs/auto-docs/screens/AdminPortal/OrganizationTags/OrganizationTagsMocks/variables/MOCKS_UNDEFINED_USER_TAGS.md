[Admin Docs](/)

***

# Variable: MOCKS\_UNDEFINED\_USER\_TAGS

> `const` **MOCKS\_UNDEFINED\_USER\_TAGS**: `object`[] = `MOCK_RESPONSES.UNDEFINED_USER_TAGS`

Defined in: [src/screens/AdminPortal/OrganizationTags/OrganizationTagsMocks.ts:315](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/OrganizationTags/OrganizationTagsMocks.ts#L315)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `ORGANIZATION_USER_TAGS_LIST_PG`

#### request.variables

> **variables**: `object`

#### request.variables.first

> **first**: `number` = `PAGE_SIZE`

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

> **tags**: `UserTags`
