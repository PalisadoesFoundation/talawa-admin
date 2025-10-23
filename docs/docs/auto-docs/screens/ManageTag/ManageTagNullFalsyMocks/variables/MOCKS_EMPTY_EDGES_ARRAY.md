[Admin Docs](/)

***

# Variable: MOCKS\_EMPTY\_EDGES\_ARRAY

> `const` **MOCKS\_EMPTY\_EDGES\_ARRAY**: `object`[] = `MOCKS_EMPTY_ASSIGNED_MEMBERS_ARRAY`

Defined in: [src/screens/ManageTag/ManageTagNullFalsyMocks.ts:70](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/ManageTag/ManageTagNullFalsyMocks.ts#L70)

## Type Declaration

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

#### request.variables.where.firstName.starts\_with

> **starts\_with**: `string` = `''`

#### request.variables.where.lastName

> **lastName**: `object`

#### request.variables.where.lastName.starts\_with

> **starts\_with**: `string` = `''`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.getAssignedUsers

> **getAssignedUsers**: `object`

#### result.data.getAssignedUsers.ancestorTags

> **ancestorTags**: `object`[]

#### result.data.getAssignedUsers.name

> **name**: `string`

#### result.data.getAssignedUsers.usersAssignedTo

> **usersAssignedTo**: `object`

#### result.data.getAssignedUsers.usersAssignedTo.edges

> **edges**: `object`[]

#### result.data.getAssignedUsers.usersAssignedTo.pageInfo

> **pageInfo**: `object`

#### result.data.getAssignedUsers.usersAssignedTo.pageInfo.endCursor

> **endCursor**: `string`

#### result.data.getAssignedUsers.usersAssignedTo.pageInfo.hasNextPage

> **hasNextPage**: `boolean`

#### result.data.getAssignedUsers.usersAssignedTo.pageInfo.hasPreviousPage

> **hasPreviousPage**: `boolean`

#### result.data.getAssignedUsers.usersAssignedTo.pageInfo.startCursor

> **startCursor**: `string`

#### result.data.getAssignedUsers.usersAssignedTo.totalCount

> **totalCount**: `number`
