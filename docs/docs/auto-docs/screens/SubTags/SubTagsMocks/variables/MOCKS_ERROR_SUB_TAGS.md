[Admin Docs](/)

---

# Variable: MOCKS_ERROR_SUB_TAGS

> `const` **MOCKS_ERROR_SUB_TAGS**: `object`[]

Defined in: [src/screens/SubTags/SubTagsMocks.ts:489](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/SubTags/SubTagsMocks.ts#L489)

## Type Declaration

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

#### request.variables.where.name.starts_with

> **starts_with**: `string` = `''`
