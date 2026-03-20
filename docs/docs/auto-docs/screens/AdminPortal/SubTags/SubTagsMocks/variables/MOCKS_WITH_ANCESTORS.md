[Admin Docs](/)

***

# Variable: MOCKS\_WITH\_ANCESTORS

> `const` **MOCKS\_WITH\_ANCESTORS**: `object`[]

Defined in: [src/screens/AdminPortal/SubTags/SubTagsMocks.ts:303](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/AdminPortal/SubTags/SubTagsMocks.ts#L303)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `USER_TAG_SUB_TAGS`

#### request.variables

> **variables**: `object`

#### request.variables.after

> **after**: `any` = `null`

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

> **ancestorTags**: `object`[]

#### result.data.getChildTags.childTags

> **childTags**: `object`

#### result.data.getChildTags.childTags.edges

> **edges**: `object`[]

#### result.data.getChildTags.childTags.pageInfo

> **pageInfo**: `object`

#### result.data.getChildTags.childTags.pageInfo.endCursor

> **endCursor**: `string` = `'subTag1'`

#### result.data.getChildTags.childTags.pageInfo.hasNextPage

> **hasNextPage**: `boolean` = `false`

#### result.data.getChildTags.childTags.pageInfo.hasPreviousPage

> **hasPreviousPage**: `boolean` = `false`

#### result.data.getChildTags.childTags.pageInfo.startCursor

> **startCursor**: `string` = `'subTag1'`

#### result.data.getChildTags.childTags.totalCount

> **totalCount**: `number` = `1`

#### result.data.getChildTags.name

> **name**: `string` = `'userTag 1'`
