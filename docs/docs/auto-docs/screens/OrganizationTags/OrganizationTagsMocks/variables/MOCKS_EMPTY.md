[Admin Docs](/)

***

# Variable: MOCKS\_EMPTY

> `const` **MOCKS\_EMPTY**: `ListMock`[] = `MOCK_RESPONSES.EMPTY`

Defined in: [src/screens/OrganizationTags/OrganizationTagsMocks.ts:312](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationTags/OrganizationTagsMocks.ts#L312)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `ORGANIZATION_USER_TAGS_LIST_PG`

#### request.variables

> **variables**: `object`

#### request.variables.after?

> `optional` **after**: `string`

#### request.variables.first

> **first**: `number`

#### request.variables.input

> **input**: `object`

#### request.variables.input.id

> **id**: `string`

#### request.variables.sortedBy

> **sortedBy**: `object`

#### request.variables.sortedBy.id

> **id**: `string`

#### request.variables.where

> **where**: `object`

#### request.variables.where.name

> **name**: `object`

#### request.variables.where.name.starts\_with

> **starts\_with**: `string`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.organizations

> **organizations**: `object`[]
