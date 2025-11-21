[Admin Docs](/)

***

# Variable: mockOrgPostList

> `const` **mockOrgPostList**: `object`

Defined in: [src/screens/OrgPost/OrgPostMocks.ts:154](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrgPost/OrgPostMocks.ts#L154)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `ORGANIZATION_POST_LIST`

#### request.variables

> **variables**: `object`

#### request.variables.after

> **after**: `any` = `null`

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

> **hasNextPage**: `boolean` = `true`

#### result.data.organization.posts.pageInfo.hasPreviousPage

> **hasPreviousPage**: `boolean` = `false`

#### result.data.organization.posts.pageInfo.startCursor

> **startCursor**: `string` = `'cursor1'`

#### result.data.organization.posts.totalCount

> **totalCount**: `number` = `6`

#### result.data.organization.postsCount

> **postsCount**: `number` = `6`
