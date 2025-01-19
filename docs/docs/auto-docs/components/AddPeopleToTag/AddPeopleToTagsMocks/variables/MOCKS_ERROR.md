[Admin Docs](/)

***

# Variable: MOCKS\_ERROR

> `const` **MOCKS\_ERROR**: `object`[]

Defined in: [src/components/AddPeopleToTag/AddPeopleToTagsMocks.ts:277](https://github.com/abhassen44/talawa-admin/blob/285f7384c3d26b5028a286d84f89b85120d130a2/src/components/AddPeopleToTag/AddPeopleToTagsMocks.ts#L277)

## Type declaration

### error

> **error**: `Error`

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `USER_TAGS_MEMBERS_TO_ASSIGN_TO`

#### request.variables

> **variables**: `object`

#### request.variables.first

> **first**: `number` = `TAGS_QUERY_DATA_CHUNK_SIZE`

#### request.variables.id

> **id**: `string` = `'1'`

#### request.variables.where

> **where**: `object`

#### request.variables.where.firstName

> **firstName**: `object`

#### request.variables.where.firstName.starts\_with

> **starts\_with**: `string` = `''`

#### request.variables.where.lastName

> **lastName**: `object`

#### request.variables.where.lastName.starts\_with

> **starts\_with**: `string` = `''`
