[**talawa-admin**](README.md)

***

# Variable: MOCKS\_NULL\_USERS\_ASSIGNED\_TO

> `const` **MOCKS\_NULL\_USERS\_ASSIGNED\_TO**: `object`[]

Defined in: [src/screens/ManageTag/ManageTagNullFalsyMocks.ts:10](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/screens/ManageTag/ManageTagNullFalsyMocks.ts#L10)

## Type declaration

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

#### result.data.getAssignedUsers.\_\_typename

> **\_\_typename**: `string` = `'UserTag'`

#### result.data.getAssignedUsers.ancestorTags

> **ancestorTags**: `any`[] = `[]`

#### result.data.getAssignedUsers.name

> **name**: `string` = `'tag1'`

#### result.data.getAssignedUsers.usersAssignedTo

> **usersAssignedTo**: `any` = `null`
