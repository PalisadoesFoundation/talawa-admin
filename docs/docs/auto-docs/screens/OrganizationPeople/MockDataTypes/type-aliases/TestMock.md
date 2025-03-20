[Admin Docs](/)

***

# Type Alias: TestMock

> **TestMock** = `object`

Defined in: [src/screens/OrganizationPeople/MockDataTypes.ts:36](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationPeople/MockDataTypes.ts#L36)

## Properties

### error?

> `optional` **error**: `Error`

Defined in: [src/screens/OrganizationPeople/MockDataTypes.ts:121](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationPeople/MockDataTypes.ts#L121)

***

### newData()?

> `optional` **newData**: () => `FetchResult`\<`Record`\<`string`, `any`\>\>

Defined in: [src/screens/OrganizationPeople/MockDataTypes.ts:122](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationPeople/MockDataTypes.ts#L122)

#### Returns

`FetchResult`\<`Record`\<`string`, `any`\>\>

***

### request

> **request**: `object`

Defined in: [src/screens/OrganizationPeople/MockDataTypes.ts:37](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationPeople/MockDataTypes.ts#L37)

#### query

> **query**: `DocumentNode`

#### variables

> **variables**: `object`

##### variables.after?

> `optional` **after**: `string` \| `null`

##### variables.before?

> `optional` **before**: `string` \| `null`

##### variables.email?

> `optional` **email**: `string`

##### variables.first?

> `optional` **first**: `number` \| `null`

##### variables.firstName?

> `optional` **firstName**: `string`

##### variables.firstName\_contains?

> `optional` **firstName\_contains**: `string`

##### variables.firstNameContains?

> `optional` **firstNameContains**: `string`

##### variables.id?

> `optional` **id**: `string`

##### variables.id\_not\_in?

> `optional` **id\_not\_in**: `string`[]

##### variables.last?

> `optional` **last**: `number` \| `null`

##### variables.lastName?

> `optional` **lastName**: `string`

##### variables.lastName\_contains?

> `optional` **lastName\_contains**: `string`

##### variables.lastNameContains?

> `optional` **lastNameContains**: `string`

##### variables.orgid?

> `optional` **orgid**: `string`

##### variables.orgId?

> `optional` **orgId**: `string`

##### variables.password?

> `optional` **password**: `string`

##### variables.userid?

> `optional` **userid**: `string`

##### variables.where?

> `optional` **where**: `object`

##### variables.where.role

> **role**: `object`

##### variables.where.role.equal

> **equal**: `"administrator"`

***

### result?

> `optional` **result**: `object`

Defined in: [src/screens/OrganizationPeople/MockDataTypes.ts:60](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrganizationPeople/MockDataTypes.ts#L60)

#### data

> **data**: `object`

##### data.allUsers?

> `optional` **allUsers**: `object`

##### data.allUsers.edges

> **edges**: `object`[]

##### data.allUsers.pageInfo

> **pageInfo**: `object`

##### data.allUsers.pageInfo.endCursor

> **endCursor**: `string`

##### data.allUsers.pageInfo.hasNextPage

> **hasNextPage**: `boolean`

##### data.allUsers.pageInfo.hasPreviousPage

> **hasPreviousPage**: `boolean`

##### data.allUsers.pageInfo.startCursor

> **startCursor**: `string`

##### data.createMember?

> `optional` **createMember**: `object`

##### data.createMember.id

> **id**: `string`

##### data.organization?

> `optional` **organization**: `object`

##### data.organization.members?

> `optional` **members**: `object`

##### data.organization.members.edges

> **edges**: `object`[]

##### data.organization.members.pageInfo

> **pageInfo**: `object`

##### data.organization.members.pageInfo.endCursor

> **endCursor**: `string`

##### data.organization.members.pageInfo.hasNextPage

> **hasNextPage**: `boolean`

##### data.organization.members.pageInfo.hasPreviousPage

> **hasPreviousPage**: `boolean`

##### data.organization.members.pageInfo.startCursor

> **startCursor**: `string`

##### data.organizations?

> `optional` **organizations**: [`InterfaceQueryOrganizationsListObject`](../../../../utils/interfaces/interfaces/InterfaceQueryOrganizationsListObject.md)[]

##### data.organizationsMemberConnection?

> `optional` **organizationsMemberConnection**: `object`

##### data.organizationsMemberConnection.edges?

> `optional` **edges**: `Edge`[]

##### data.organizationsMemberConnection.user?

> `optional` **user**: `Edge`[]

##### data.removeMember?

> `optional` **removeMember**: `object`

##### data.removeMember.id

> **id**: `string`

##### data.signUp?

> `optional` **signUp**: `object`

##### data.signUp.accessToken?

> `optional` **accessToken**: `string`

##### data.signUp.refreshToken?

> `optional` **refreshToken**: `string`

##### data.signUp.user?

> `optional` **user**: `object`

##### data.signUp.user.id

> **id**: `string`

##### data.users?

> `optional` **users**: `object`[]
