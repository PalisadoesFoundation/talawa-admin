[Admin Docs](/)

***

# Variable: orgPinnedPostListMockBasic

> `const` **orgPinnedPostListMockBasic**: `object`

Defined in: [src/screens/OrgPost/OrgPostMocks.ts:27](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/OrgPost/OrgPostMocks.ts#L27)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `ORGANIZATION_PINNED_POST_LIST`

#### request.variables

> **variables**: `object`

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

#### result.data.organization.pinnedPosts

> **pinnedPosts**: `object`

#### result.data.organization.pinnedPosts.edges

> **edges**: `object`[]

#### result.data.organization.pinnedPosts.pageInfo

> **pageInfo**: `object`

#### result.data.organization.pinnedPosts.pageInfo.endCursor

> **endCursor**: `string` = `'cursor2'`

#### result.data.organization.pinnedPosts.pageInfo.hasNextPage

> **hasNextPage**: `boolean` = `false`

#### result.data.organization.pinnedPosts.pageInfo.hasPreviousPage

> **hasPreviousPage**: `boolean` = `false`

#### result.data.organization.pinnedPosts.pageInfo.startCursor

> **startCursor**: `string` = `'cursor1'`

#### result.data.organization.pinnedPosts.totalCount

> **totalCount**: `number` = `2`

#### result.data.organization.postsCount

> **postsCount**: `number` = `3`
