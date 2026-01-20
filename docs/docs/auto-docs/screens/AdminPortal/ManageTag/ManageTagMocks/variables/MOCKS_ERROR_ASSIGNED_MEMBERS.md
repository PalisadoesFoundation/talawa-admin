[Admin Docs](/)

---

# Variable: MOCKS_ERROR_ASSIGNED_MEMBERS

> `const` **MOCKS_ERROR_ASSIGNED_MEMBERS**: `object`[]

Defined in: [src/screens/AdminPortal/ManageTag/ManageTagMocks.ts:391](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/ManageTag/ManageTagMocks.ts#L391)

## Type Declaration

### error

> **error**: `Error`

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `USER_TAGS_ASSIGNED_MEMBERS`

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

#### request.variables.where.firstName

> **firstName**: `object`

#### request.variables.where.firstName.starts_with

> **starts_with**: `string` = `''`

#### request.variables.where.lastName

> **lastName**: `object`

#### request.variables.where.lastName.starts_with

> **starts_with**: `string` = `''`
