[Admin Docs](/)

***

# Variable: mockOrgPostList2

> `const` **mockOrgPostList2**: `object`

Defined in: [src/screens/OrgPost/OrgPostMocks.ts:341](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrgPost/OrgPostMocks.ts#L341)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `ORGANIZATION_POST_LIST`

#### request.variables

> **variables**: `object`

#### request.variables.after

> **after**: `string` = `'cursor2'`

#### request.variables.before

> **before**: `any` = `null`

#### request.variables.first

> **first**: `number` = `6`

#### request.variables.input

> **input**: `object`

#### request.variables.input.id

> **id**: `string` = `'123'`

#### request.variables.last

> **last**: `any` = `null`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.organization

> **organization**: `object`

#### result.data.organization.avatarURL

> **avatarURL**: `any` = `null`

#### result.data.organization.id

> **id**: `string` = `'123'`

#### result.data.organization.name

> **name**: `string` = `'Test Organization'`

#### result.data.organization.posts

> **posts**: `object`

#### result.data.organization.posts.edges

> **edges**: `object`[]

#### result.data.organization.posts.pageInfo

> **pageInfo**: `object`

#### result.data.organization.posts.pageInfo.endCursor

> **endCursor**: `string` = `'cursor3'`

#### result.data.organization.posts.pageInfo.hasNextPage

> **hasNextPage**: `boolean` = `false`

#### result.data.organization.posts.pageInfo.hasPreviousPage

> **hasPreviousPage**: `boolean` = `true`

#### result.data.organization.posts.pageInfo.startCursor

> **startCursor**: `string` = `'cursor3'`

#### result.data.organization.posts.totalCount

> **totalCount**: `number` = `1`

#### result.data.organization.postsCount

> **postsCount**: `number` = `1`
