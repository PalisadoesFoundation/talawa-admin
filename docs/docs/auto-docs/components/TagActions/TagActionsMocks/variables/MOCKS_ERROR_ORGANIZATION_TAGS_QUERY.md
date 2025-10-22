[Admin Docs](/)

---

# Variable: MOCKS_ERROR_ORGANIZATION_TAGS_QUERY

> `const` **MOCKS_ERROR_ORGANIZATION_TAGS_QUERY**: `object`[]

Defined in: [src/components/TagActions/TagActionsMocks.ts:279](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/TagActions/TagActionsMocks.ts#L279)

## Type Declaration

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

> **id**: `string` = `'123'`

#### request.variables.where

> **where**: `object`

#### request.variables.where.name

> **name**: `object`

#### request.variables.where.name.starts_with

> **starts_with**: `string` = `''`
