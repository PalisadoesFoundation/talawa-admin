[Admin Docs](/)

***

# Variable: MOCK\_EMPTY

> `const` **MOCK\_EMPTY**: `object`[]

Defined in: [src/components/AdminPortal/Tags/Modals/AddMembersModal/AddMembersModalMocks.ts:179](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/components/AdminPortal/Tags/Modals/AddMembersModal/AddMembersModalMocks.ts#L179)

## Type Declaration

### request

> **request**: `object`

#### request.query

> **query**: `DocumentNode` = `USER_TAGS_MEMBERS_TO_ASSIGN_TO`

#### request.variables

> **variables**: `object` = `baseMemberQueryVariables`

#### request.variables.first

> **first**: `number` = `TAGS_QUERY_DATA_CHUNK_SIZE`

#### request.variables.organizationId

> **organizationId**: `string` = `'1'`

#### request.variables.tagId

> **tagId**: `string` = `'1'`

### result

> **result**: `object`

#### result.data

> **data**: `object`

#### result.data.organization

> **organization**: `object`

#### result.data.organization.id

> **id**: `string` = `'1'`

#### result.data.organization.members

> **members**: `object`

#### result.data.organization.members.edges

> **edges**: `object`[]

#### result.data.organization.members.pageInfo

> **pageInfo**: `object`

#### result.data.organization.members.pageInfo.endCursor

> **endCursor**: `string`

#### result.data.organization.members.pageInfo.hasNextPage

> **hasNextPage**: `boolean`

#### result.data.organization.members.pageInfo.hasPreviousPage

> **hasPreviousPage**: `boolean` = `false`

#### result.data.organization.members.pageInfo.startCursor

> **startCursor**: `string`

#### result.data.tag

> **tag**: `object`

#### result.data.tag.assignees

> **assignees**: `object`

#### result.data.tag.assignees.edges

> **edges**: `any`[] = `[]`

#### result.data.tag.id

> **id**: `string` = `'1'`
