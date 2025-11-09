[Admin Docs](/)

***

# Variable: MOCK\_EMPTY

> `const` **MOCK\_EMPTY**: `object`[]

Defined in: [src/components/AddPeopleToTag/AddPeopleToTagsMocks.ts:294](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AddPeopleToTag/AddPeopleToTagsMocks.ts#L294)

## Type Declaration

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

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.getUsersToAssignTo

> **getUsersToAssignTo**: `object`

#### result.data.getUsersToAssignTo.usersToAssignTo

> **usersToAssignTo**: `object`

#### result.data.getUsersToAssignTo.usersToAssignTo.edges

> **edges**: `any`[] = `[]`

#### result.data.getUsersToAssignTo.usersToAssignTo.pageInfo

> **pageInfo**: `object`

#### result.data.getUsersToAssignTo.usersToAssignTo.pageInfo.hasNextPage

> **hasNextPage**: `boolean` = `false`
