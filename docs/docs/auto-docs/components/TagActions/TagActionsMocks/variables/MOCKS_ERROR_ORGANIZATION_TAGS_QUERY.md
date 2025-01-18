[Admin Docs](/)

***

# Variable: MOCKS\_ERROR\_ORGANIZATION\_TAGS\_QUERY

> `const` **MOCKS\_ERROR\_ORGANIZATION\_TAGS\_QUERY**: `object`[]

Defined in: [src/components/TagActions/TagActionsMocks.ts:622](https://github.com/gautam-divyanshu/talawa-admin/blob/69cd9f147d3701d1db7821366b2c564d1fb49f77/src/components/TagActions/TagActionsMocks.ts#L622)

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

> **id**: `string` = `'123'`

#### request.variables.where

> **where**: `object`

#### request.variables.where.name

> **name**: `object`

#### request.variables.where.name.starts\_with

> **starts\_with**: `string` = `''`
