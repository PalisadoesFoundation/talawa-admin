[Admin Docs](/)

***

# Type Alias: TestMock

> **TestMock**: `object`

Defined in: [src/screens/OrganizationPeople/MockDataTypes.ts:34](https://github.com/syedali237/talawa-admin/blob/dd4a08e622d0fa38bcf9758a530e8cdf917dbac8/src/screens/OrganizationPeople/MockDataTypes.ts#L34)

## Type declaration

### newData()?

> `optional` **newData**: () => [`TestMock`](TestMock.md)\[`"result"`\]

#### Returns

[`TestMock`](TestMock.md)\[`"result"`\]

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode`

#### request.variables

> **variables**: `object`

#### request.variables.email?

> `optional` **email**: `string`

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

### result

> **result**: `object`

#### result.\_\_typename?

> `optional` **\_\_typename**: `string`

#### result.data

> **data**: `object`

#### result.data.\_\_typename?

> `optional` **\_\_typename**: `string`

#### result.data.createMember?

> `optional` **createMember**: `object`

#### result.data.createMember.\_\_typename

> **\_\_typename**: `string`

#### result.data.createMember.\_id

> **\_id**: `string`

#### result.data.organizations?

> `optional` **organizations**: [`InterfaceQueryOrganizationsListObject`](../../../../utils/interfaces/interfaces/InterfaceQueryOrganizationsListObject.md)[]

#### result.data.organizationsMemberConnection?

> `optional` **organizationsMemberConnection**: `object`

#### result.data.organizationsMemberConnection.edges?

> `optional` **edges**: `Edge`[]

#### result.data.organizationsMemberConnection.user?

> `optional` **user**: `Edge`[]

#### result.data.signUp?

> `optional` **signUp**: `object`

#### result.data.signUp.accessToken?

> `optional` **accessToken**: `string`

#### result.data.signUp.refreshToken?

> `optional` **refreshToken**: `string`

#### result.data.signUp.user?

> `optional` **user**: `object`

#### result.data.signUp.user.\_id

> **\_id**: `string`

#### result.data.users?

> `optional` **users**: `object`[]
