[Admin Docs](/)

***

# Type Alias: TestMock

> **TestMock**: `object`

Defined in: [src/screens/OrganizationPeople/MockDataTypes.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationPeople/MockDataTypes.ts#L36)

## Type declaration

### error?

> `optional` **error**: `Error`

### newData()?

> `optional` **newData**: () => `FetchResult`\<`Record`\<`string`, `any`\>\>

#### Returns

`FetchResult`\<`Record`\<`string`, `any`\>\>

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode`

#### request.variables

> **variables**: `object`

#### request.variables.after?

> `optional` **after**: `string` \| `null`

#### request.variables.before?

> `optional` **before**: `string` \| `null`

#### request.variables.email?

> `optional` **email**: `string`

#### request.variables.first?

> `optional` **first**: `number` \| `null`

#### request.variables.firstName?

> `optional` **firstName**: `string`

#### request.variables.firstName\_contains?

> `optional` **firstName\_contains**: `string`

#### request.variables.firstNameContains?

> `optional` **firstNameContains**: `string`

#### request.variables.id?

> `optional` **id**: `string`

#### request.variables.id\_not\_in?

> `optional` **id\_not\_in**: `string`[]

#### request.variables.last?

> `optional` **last**: `number` \| `null`

#### request.variables.lastName?

> `optional` **lastName**: `string`

#### request.variables.lastName\_contains?

> `optional` **lastName\_contains**: `string`

#### request.variables.lastNameContains?

> `optional` **lastNameContains**: `string`

#### request.variables.orgid?

> `optional` **orgid**: `string`

#### request.variables.orgId?

> `optional` **orgId**: `string`

#### request.variables.password?

> `optional` **password**: `string`

#### request.variables.userid?

> `optional` **userid**: `string`

#### request.variables.where?

> `optional` **where**: `any`

### result?

> `optional` **result**: `object`

#### result.data

> **data**: `object`

#### result.data.allUsers?

> `optional` **allUsers**: `object`

#### result.data.allUsers.edges

> **edges**: `object`[]

#### result.data.allUsers.pageInfo

> **pageInfo**: `object`

#### result.data.allUsers.pageInfo.endCursor

> **endCursor**: `string`

#### result.data.allUsers.pageInfo.hasNextPage

> **hasNextPage**: `boolean`

#### result.data.allUsers.pageInfo.hasPreviousPage

> **hasPreviousPage**: `boolean`

#### result.data.allUsers.pageInfo.startCursor

> **startCursor**: `string`

#### result.data.createMember?

> `optional` **createMember**: `object`

#### result.data.createMember.id

> **id**: `string`

#### result.data.organization?

> `optional` **organization**: `object`

#### result.data.organization.members?

> `optional` **members**: `object`

#### result.data.organization.members.edges

> **edges**: `object`[]

#### result.data.organization.members.pageInfo

> **pageInfo**: `object`

#### result.data.organization.members.pageInfo.endCursor

> **endCursor**: `string`

#### result.data.organization.members.pageInfo.hasNextPage

> **hasNextPage**: `boolean`

#### result.data.organization.members.pageInfo.hasPreviousPage

> **hasPreviousPage**: `boolean`

#### result.data.organization.members.pageInfo.startCursor

> **startCursor**: `string`

#### result.data.organizations?

> `optional` **organizations**: [`InterfaceQueryOrganizationsListObject`](../../../../utils/interfaces/interfaces/InterfaceQueryOrganizationsListObject.md)[]

#### result.data.organizationsMemberConnection?

> `optional` **organizationsMemberConnection**: `object`

#### result.data.organizationsMemberConnection.edges?

> `optional` **edges**: `Edge`[]

#### result.data.organizationsMemberConnection.user?

> `optional` **user**: `Edge`[]

#### result.data.removeMember?

> `optional` **removeMember**: `object`

#### result.data.removeMember.id

> **id**: `string`

#### result.data.signUp?

> `optional` **signUp**: `object`

#### result.data.signUp.accessToken?

> `optional` **accessToken**: `string`

#### result.data.signUp.refreshToken?

> `optional` **refreshToken**: `string`

#### result.data.signUp.user?

> `optional` **user**: `object`

#### result.data.signUp.user.id

> **id**: `string`

#### result.data.users?

> `optional` **users**: `object`[]
