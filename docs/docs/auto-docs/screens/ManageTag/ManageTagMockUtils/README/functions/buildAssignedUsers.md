[**talawa-admin**](README.md)

***

# Function: buildAssignedUsers()

> **buildAssignedUsers**(`overrides`?): `object`

Defined in: [src/screens/ManageTag/ManageTagMockUtils.ts:4](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/screens/ManageTag/ManageTagMockUtils.ts#L4)

## Parameters

### overrides?

`Partial`\<\{ `ancestorTags`: `object`[]; `name`: `string`; `usersAssignedTo`: \{ `edges`: `object`[]; `pageInfo`: \{ `endCursor`: `string`; `hasNextPage`: `boolean`; `hasPreviousPage`: `boolean`; `startCursor`: `string`; \}; `totalCount`: `number`; \}; \}\>

## Returns

`object`

### \_\_typename

> **\_\_typename**: `string` = `'UserTag'`

### ancestorTags

> **ancestorTags**: `object`[]

### name

> **name**: `string`

### usersAssignedTo

> **usersAssignedTo**: `object`

#### usersAssignedTo.\_\_typename

> **\_\_typename**: `string` = `'UserTagUsersAssignedToConnection'`

#### usersAssignedTo.edges

> **edges**: `object`[]

#### usersAssignedTo.pageInfo

> **pageInfo**: `object`

#### usersAssignedTo.pageInfo.\_\_typename

> **\_\_typename**: `string` = `'PageInfo'`

#### usersAssignedTo.pageInfo.endCursor

> **endCursor**: `string`

#### usersAssignedTo.pageInfo.hasNextPage

> **hasNextPage**: `boolean`

#### usersAssignedTo.pageInfo.hasPreviousPage

> **hasPreviousPage**: `boolean`

#### usersAssignedTo.pageInfo.startCursor

> **startCursor**: `string`

#### usersAssignedTo.totalCount

> **totalCount**: `number`
