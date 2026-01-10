[Admin Docs](/)

***

# Variable: MOCKS1

> `const` **MOCKS1**: `object`[]

Defined in: [src/components/AdminPortal/TagActions/Node/TagNodeMocks.ts:3](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AdminPortal/TagActions/Node/TagNodeMocks.ts#L3)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `USER_TAG_SUB_TAGS`

#### request.variables

> **variables**: `object`

#### request.variables.after

> **after**: `string` = `'subTag2'`

#### request.variables.first

> **first**: `number` = `10`

#### request.variables.id

> **id**: `string` = `'1'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.getChildTags

> **getChildTags**: `object`

#### result.data.getChildTags.\_\_typename

> **\_\_typename**: `string` = `'GetChildTagsPayload'`

#### result.data.getChildTags.ancestorTags

> **ancestorTags**: `any`[] = `[]`

#### result.data.getChildTags.childTags

> **childTags**: `object`

#### result.data.getChildTags.childTags.\_\_typename

> **\_\_typename**: `string` = `'ChildTagsConnection'`

#### result.data.getChildTags.childTags.edges

> **edges**: `object`[]

#### result.data.getChildTags.childTags.pageInfo

> **pageInfo**: `object`

#### result.data.getChildTags.childTags.pageInfo.\_\_typename

> **\_\_typename**: `string` = `'PageInfo'`

#### result.data.getChildTags.childTags.pageInfo.endCursor

> **endCursor**: `string` = `'subTag11'`

#### result.data.getChildTags.childTags.pageInfo.hasNextPage

> **hasNextPage**: `boolean` = `false`

#### result.data.getChildTags.childTags.pageInfo.hasPreviousPage

> **hasPreviousPage**: `boolean` = `true`

#### result.data.getChildTags.childTags.pageInfo.startCursor

> **startCursor**: `string` = `'subTag11'`

#### result.data.getChildTags.childTags.totalCount

> **totalCount**: `number` = `3`

#### result.data.getChildTags.name

> **name**: `string` = `'Parent Tag'`
