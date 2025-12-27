[**talawa-admin**](README.md)

***

# Variable: ORGANIZATION\_PINNED\_POST\_LIST\_WITH\_PAGINATION\_MOCK

> `const` **ORGANIZATION\_PINNED\_POST\_LIST\_WITH\_PAGINATION\_MOCK**: `object`

Defined in: [src/screens/OrgPost/OrgPostMocks.data.ts:176](https://github.com/SujalTripathi/talawa-admin/blob/201c311285eee8900b55c8a032a23046ba8c861b/src/screens/OrgPost/OrgPostMocks.data.ts#L176)

## Type declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `ORGANIZATION_PINNED_POST_LIST`

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

> **name**: `string` = `'Test Org'`

#### result.data.organization.pinnedPosts

> **pinnedPosts**: `object`

#### result.data.organization.pinnedPosts.edges

> **edges**: `any`[] = `[]`

#### result.data.organization.pinnedPosts.pageInfo

> **pageInfo**: `object`

#### result.data.organization.pinnedPosts.pageInfo.endCursor

> **endCursor**: `any` = `null`

#### result.data.organization.pinnedPosts.pageInfo.hasNextPage

> **hasNextPage**: `boolean` = `false`

#### result.data.organization.pinnedPosts.pageInfo.hasPreviousPage

> **hasPreviousPage**: `boolean` = `false`

#### result.data.organization.pinnedPosts.pageInfo.startCursor

> **startCursor**: `any` = `null`

#### result.data.organization.postsCount

> **postsCount**: `number` = `0`
