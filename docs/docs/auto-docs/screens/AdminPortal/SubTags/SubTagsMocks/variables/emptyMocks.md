[Admin Docs](/)

***

# Variable: emptyMocks

> `const` **emptyMocks**: `object`[]

Defined in: [src/screens/AdminPortal/SubTags/SubTagsMocks.ts:267](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/SubTags/SubTagsMocks.ts#L267)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `USER_TAG_SUB_TAGS`

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

#### request.variables.where.name

> **name**: `object`

#### request.variables.where.name.starts\_with

> **starts\_with**: `string` = `''`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.getChildTags

> **getChildTags**: `object`

#### result.data.getChildTags.ancestorTags

> **ancestorTags**: `any`[] = `[]`

#### result.data.getChildTags.childTags

> **childTags**: `object`

#### result.data.getChildTags.childTags.edges

> **edges**: `any`[] = `[]`

#### result.data.getChildTags.childTags.pageInfo

> **pageInfo**: `object`

#### result.data.getChildTags.childTags.pageInfo.endCursor

> **endCursor**: `any` = `null`

#### result.data.getChildTags.childTags.pageInfo.hasNextPage

> **hasNextPage**: `boolean` = `false`

#### result.data.getChildTags.childTags.totalCount

> **totalCount**: `number` = `0`

#### result.data.getChildTags.name

> **name**: `string` = `'userTag 1'`
